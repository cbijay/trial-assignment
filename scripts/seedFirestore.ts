import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import { COLLECTIONS } from '../src/features/saved_items/constants';
import { db } from '../src/shared/utils/firebase';

const sampleItems = [
  {
    title: 'Getting Started with React Native',
    description:
      'A comprehensive guide to building your first React Native app with Expo.',
  },
  {
    title: 'Firestore Best Practices',
    description:
      'Learn how to structure your Firestore database for scalability and performance.',
  },
  {
    title: 'TypeScript for Mobile Development',
    description:
      'Why TypeScript is essential for building maintainable mobile applications.',
  },
  {
    title: 'State Management Patterns',
    description:
      'Comparing different state management approaches in React Native applications.',
  },
  {
    title: 'Offline-First Architecture',
    description:
      'Building mobile apps that work seamlessly offline and sync when online.',
  },
];

export const seedItems = async () => {
  try {
    for (const item of sampleItems) {
      await addDoc(collection(db, COLLECTIONS.ITEMS), {
        ...item,
        updatedAt: serverTimestamp(),
      });
    }
  } catch (error) {
    console.error('Error seeding items:', error);
  }
};

export const seedUserSave = async (userId: string, itemId: string) => {
  try {
    const saveDocId = `${userId}_${itemId}`;
    await setDoc(doc(db, COLLECTIONS.USER_SAVES, saveDocId), {
      userId,
      itemId,
      savedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error seeding user save:', error);
  }
};

export const seedDatabase = async () => {
  await seedItems();

  await seedUserSave('demo-user', 'first-item-id');
};

seedDatabase();
