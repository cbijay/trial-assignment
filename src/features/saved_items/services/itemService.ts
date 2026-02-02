import { COLLECTIONS } from '@/features/saved_items/constants';
import {
  Item,
  PaginatedResult,
  PaginationOptions,
} from '@/features/saved_items/types';
import {
  ErrorFactory,
  retryFirestoreOperation,
} from '@/shared/utils/errorHandling';
import { db } from '@/shared/utils/firebase';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  DocumentSnapshot,
  getDoc,
  getDocs,
  getDocsFromCache,
  getDocsFromServer,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  startAfter,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';

const itemsCol = collection(db, COLLECTIONS.ITEMS);
const userSavesCol = collection(db, COLLECTIONS.USER_SAVES);

const transformItemDoc = (doc: DocumentSnapshot<DocumentData>): Item => {
  const data = doc.data();
  if (!data) {
    throw ErrorFactory.itemNotFound(doc.id);
  }

  return {
    id: doc.id,
    title: data.title || '',
    description: data.description || '',
    updatedAt: data.updatedAt?.toMillis?.() || Date.now(),
    ...(data.createdAt && { createdAt: data.createdAt?.toMillis?.() }),
    ...(data.imageUrl && { imageUrl: data.imageUrl }),
    ...(data.category && { category: data.category }),
    ...(data.metadata && { metadata: data.metadata }),
  };
};

// Individual functions first
export const getAllItems = async (limitCount = 50): Promise<Item[]> => {
  try {
    const q = query(itemsCol, orderBy('updatedAt', 'desc'), limit(limitCount));
    const snapshot = await retryFirestoreOperation(() => getDocs(q));
    return snapshot.docs.map(transformItemDoc);
  } catch (error) {
    throw ErrorFactory.fromFirestoreError(
      error as { code?: string; message?: string },
      'getAllItems'
    );
  }
};

export const getAllItemsPaginated = async (
  limitCount = 50,
  _offset = 0
): Promise<{ items: Item[]; hasMore: boolean; totalCount?: number }> => {
  try {
    let totalCount: number | undefined;
    try {
      const countQuery = query(collection(db, COLLECTIONS.ITEMS));
      const countSnapshot = await getDocs(countQuery);
      totalCount = countSnapshot.size;
    } catch (countError) {
      console.warn('Could not get total count:', countError);
    }

    const q = query(itemsCol, orderBy('updatedAt', 'desc'), limit(limitCount));
    const snapshot = await getDocs(q);
    const items = snapshot.docs.map(transformItemDoc);

    const hasMore =
      items.length === limitCount &&
      (totalCount === undefined || items.length < totalCount);

    return { items, hasMore, totalCount };
  } catch (error) {
    console.error('Error getting paginated items:', error);
    throw new Error('Failed to fetch items');
  }
};

export const getItemsPaginated = async (
  options: PaginationOptions = {}
): Promise<PaginatedResult<Item>> => {
  try {
    const { limitCount = 20, lastVisible = null } = options;

    let q;
    if (lastVisible) {
      q = query(
        itemsCol,
        orderBy('updatedAt', 'desc'),
        startAfter(lastVisible),
        limit(limitCount)
      );
    } else {
      q = query(itemsCol, orderBy('updatedAt', 'desc'), limit(limitCount));
    }

    const snapshot = await retryFirestoreOperation(() => getDocs(q));
    const items = snapshot.docs.map(transformItemDoc);
    const newLastVisible = snapshot.docs[snapshot.docs.length - 1] || null;
    const hasMore = items.length === limitCount;

    return { items, hasMore, lastVisible: newLastVisible };
  } catch (error) {
    throw ErrorFactory.fromFirestoreError(
      error as { code?: string; message?: string },
      'getItemsPaginated'
    );
  }
};

export const getItem = async (itemId: string): Promise<Item | null> => {
  try {
    const docRef = doc(db, COLLECTIONS.ITEMS, itemId);
    const snapshot = await retryFirestoreOperation(() => getDoc(docRef));
    return snapshot.exists() ? transformItemDoc(snapshot) : null;
  } catch (error) {
    throw ErrorFactory.fromFirestoreError(
      error as { code?: string; message?: string },
      'getItem'
    );
  }
};

export const getUserSavedItemIds = async (
  userId: string
): Promise<string[]> => {
  const q = query(userSavesCol, where('userId', '==', userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => doc.data().itemId);
};

export const saveItem = async (
  userId: string,
  itemId: string
): Promise<void> => {
  try {
    const saveDocId = `${userId}_${itemId}`;
    const docRef = doc(db, COLLECTIONS.USER_SAVES, saveDocId);
    await retryFirestoreOperation(() =>
      setDoc(docRef, {
        userId,
        itemId,
        savedAt: serverTimestamp(),
      })
    );
  } catch (error) {
    throw ErrorFactory.itemSaveFailed(itemId, error);
  }
};

export const unsaveItem = async (
  userId: string,
  itemId: string
): Promise<void> => {
  try {
    const saveDocId = `${userId}_${itemId}`;
    const docRef = doc(db, COLLECTIONS.USER_SAVES, saveDocId);
    await retryFirestoreOperation(() => deleteDoc(docRef));
  } catch (error) {
    throw ErrorFactory.fromFirestoreError(
      error as { code?: string; message?: string },
      'saveItem'
    );
  }
};

export const getSavedItems = async (
  userId: string,
  limitCount = 20,
  lastVisible: unknown = null
): Promise<{ items: Item[]; hasMore: boolean; lastVisible: unknown }> => {
  try {
    // First, get the user's saved item IDs with pagination
    let savesQuery;

    if (lastVisible) {
      savesQuery = query(
        userSavesCol,
        where('userId', '==', userId),
        orderBy('savedAt', 'desc'),
        startAfter(lastVisible),
        limit(limitCount)
      );
    } else {
      savesQuery = query(
        userSavesCol,
        where('userId', '==', userId),
        orderBy('savedAt', 'desc'),
        limit(limitCount)
      );
    }

    const savesSnapshot = await getDocs(savesQuery);
    const savedItemIds = savesSnapshot.docs.map(doc => ({
      itemId: doc.data().itemId,
      savedAt: doc.data().savedAt?.toMillis?.() || Date.now(),
    }));

    if (savedItemIds.length === 0) {
      return { items: [], hasMore: false, lastVisible: null };
    }

    // Get the actual items in optimized batch queries
    // Firestore supports up to 10 items in an 'in' query, so we need to chunk
    const items: Item[] = [];
    const chunkSize = 10;

    for (let i = 0; i < savedItemIds.length; i += chunkSize) {
      const chunk = savedItemIds.slice(i, i + chunkSize);
      const itemIds = chunk.map(item => item.itemId);

      const itemsQuery = query(itemsCol, where('__name__', 'in', itemIds));
      const itemsSnapshot = await getDocs(itemsQuery);
      const chunkItems = itemsSnapshot.docs.map(transformItemDoc);

      // Merge with savedAt timestamp and sort by savedAt
      const mergedItems = chunkItems.map(item => {
        const savedItem = savedItemIds.find(saved => saved.itemId === item.id);
        return {
          ...item,
          savedAt: savedItem?.savedAt || Date.now(),
        };
      });

      items.push(...mergedItems);
    }

    // Sort by savedAt (most recent first)
    items.sort((a, b) => {
      const aSavedAt = (a as { savedAt?: number }).savedAt || 0;
      const bSavedAt = (b as { savedAt?: number }).savedAt || 0;
      return bSavedAt - aSavedAt;
    });

    const newLastVisible =
      savesSnapshot.docs[savesSnapshot.docs.length - 1] || null;
    const hasMore = savedItemIds.length === limitCount;

    return { items, hasMore, lastVisible: newLastVisible };
  } catch (error) {
    console.error('Error getting saved items:', error);
    throw new Error('Failed to fetch saved items');
  }
};

export const getItemsWithSaveStatus = async (
  userId: string,
  limitCount = 20
): Promise<{ items: (Item & { isSaved: boolean })[]; hasMore: boolean }> => {
  try {
    // Get all items first
    const itemsQuery = query(
      itemsCol,
      orderBy('updatedAt', 'desc'),
      limit(limitCount)
    );

    const itemsSnapshot = await getDocs(itemsQuery);
    const items = itemsSnapshot.docs.map(transformItemDoc);

    // Get user's saved item IDs in a single query
    const savesQuery = query(userSavesCol, where('userId', '==', userId));
    const savesSnapshot = await getDocs(savesQuery);
    const savedItemIds = new Set(
      savesSnapshot.docs.map(doc => doc.data().itemId)
    );

    // Add save status to each item
    const itemsWithStatus = items.map(item => ({
      ...item,
      isSaved: savedItemIds.has(item.id),
    }));

    return {
      items: itemsWithStatus,
      hasMore: items.length === limitCount,
    };
  } catch (error) {
    console.error('Error getting items with save status:', error);
    throw new Error('Failed to fetch items');
  }
};

export async function batchUpdateSaveStatus(
  userId: string,
  operations: unknown[]
): Promise<void> {
  // Implementation for batch operations
  // This would typically use Firestore batch writes
  const batch = writeBatch(db);

  operations.forEach(operation => {
    const op = operation as { itemId: string; action: string };
    const userItemRef = doc(db, 'users', userId, 'savedItems', op.itemId);
    if (op.action === 'save') {
      batch.set(userItemRef, {
        itemId: op.itemId,
        savedAt: serverTimestamp(),
      });
    } else {
      batch.delete(userItemRef);
    }
  });

  await batch.commit();
}

export const getAllItemsWithCache = async (
  limitCount = 20,
  preferCache = true
): Promise<Item[]> => {
  try {
    const itemsQuery = query(
      itemsCol,
      orderBy('updatedAt', 'desc'),
      limit(limitCount)
    );

    let snapshot;
    if (preferCache) {
      // Try cache first, fallback to server
      snapshot = await getDocsFromCache(itemsQuery).catch(() =>
        getDocsFromServer(itemsQuery)
      );
    } else {
      // Force server refresh
      snapshot = await getDocsFromServer(itemsQuery);
    }

    return snapshot.docs.map(transformItemDoc);
  } catch (error) {
    console.error('Error getting items with cache strategy:', error);
    throw new Error('Failed to fetch items');
  }
};

export const createItem = async (data: Partial<Item>): Promise<Item> => {
  const docRef = await addDoc(itemsCol, {
    ...data,
    updatedAt: serverTimestamp(),
  });
  const snapshot = await getDoc(docRef);
  return transformItemDoc(snapshot);
};

export const updateItem = async (
  itemId: string,
  data: Partial<Item>
): Promise<void> => {
  const docRef = doc(db, COLLECTIONS.ITEMS, itemId);
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
};

export const deleteItem = async (itemId: string): Promise<void> => {
  const docRef = doc(db, COLLECTIONS.ITEMS, itemId);
  await deleteDoc(docRef);
};

export const searchItems = async (
  searchQuery: string,
  limitCount = 50,
  preferCache = true
): Promise<Item[]> => {
  try {
    const itemsQuery = query(
      collection(db, COLLECTIONS.ITEMS),
      orderBy('updatedAt', 'desc'),
      limit(limitCount)
    );

    let snapshot;
    if (preferCache) {
      // Try cache first for better performance
      snapshot = await getDocsFromCache(itemsQuery).catch(() =>
        getDocsFromServer(itemsQuery)
      );
    } else {
      // Force server refresh for fresh results
      snapshot = await getDocsFromServer(itemsQuery);
    }

    const items: Item[] = [];
    const searchTerm = searchQuery.toLowerCase().trim();

    // Filter on client side (still needed since Firestore doesn't support full-text search)
    snapshot.forEach(doc => {
      const data = doc.data();
      const title = (data.title || '').toLowerCase();
      const description = (data.description || '').toLowerCase();

      if (title.includes(searchTerm) || description.includes(searchTerm)) {
        items.push({
          id: doc.id,
          title: data.title || '',
          description: data.description || '',
          updatedAt: data.updatedAt?.toMillis?.() || Date.now(),
        });
      }
    });

    return items;
  } catch (error) {
    console.error('Error searching items:', error);
    throw new Error('Failed to search items');
  }
};

export const getItemsByCategory = async (category: string): Promise<Item[]> => {
  try {
    const itemsQuery = query(
      collection(db, COLLECTIONS.ITEMS),
      where('category', '==', category),
      orderBy('updatedAt', 'desc')
    );

    const querySnapshot = await getDocs(itemsQuery);
    const items: Item[] = [];

    querySnapshot.forEach(doc => {
      const data = doc.data();
      items.push({
        id: doc.id,
        title: data.title || '',
        description: data.description || '',
        updatedAt: data.updatedAt?.toMillis?.() || Date.now(),
      });
    });

    return items;
  } catch (error) {
    console.error('Error fetching items by category:', error);
    return getAllItems();
  }
};

export const getUserSavedItems = getSavedItems;
export const toggleItemSave = async (
  userId: string,
  itemId: string,
  isSaved: boolean
) => {
  return isSaved ? saveItem(userId, itemId) : unsaveItem(userId, itemId);
};

export const itemService = {
  getAllItems,
  getAllItemsPaginated,
  getItem,
  getUserSavedItemIds,
  getSavedItems,
  saveItem,
  unsaveItem,
  createItem,
  updateItem,
  deleteItem,
};
