import { Item } from '@/features/saved_items/types';
import { create } from 'zustand';

interface SavedItemsState {
  items: Item[];
  savedItemIds: string[];
  isLoading: boolean;
  error: string | null;

  setItems: (items: Item[]) => void;
  setSavedItemIds: (ids: string[]) => void;
  addItem: (item: Item) => void;
  updateItem: (itemId: string, updates: Partial<Item>) => void;
  removeItem: (itemId: string) => void;
  toggleSaveItem: (itemId: string, isSaved: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;

  isItemSaved: (itemId: string) => boolean;
  getSavedItemsList: () => Item[];
}

export const useSavedItemsStore = create<SavedItemsState>((set, get) => ({
  items: [],
  savedItemIds: [],
  isLoading: false,
  error: null,

  setItems: items => {
    set({ items });
  },

  setSavedItemIds: ids => {
    set({ savedItemIds: ids });
  },

  addItem: item => {
    set(state => ({
      items: [item, ...state.items],
    }));
  },

  updateItem: (itemId, updates) => {
    set(state => ({
      items: state.items.map(item =>
        item.id === itemId ? { ...item, ...updates } : item
      ),
    }));
  },

  removeItem: itemId => {
    set(state => ({
      items: state.items.filter(item => item.id !== itemId),
      savedItemIds: state.savedItemIds.filter(id => id !== itemId),
    }));
  },

  toggleSaveItem: (itemId, isSaved) => {
    set(state => {
      const newSavedIds = isSaved
        ? Array.from(new Set([...state.savedItemIds, itemId]))
        : state.savedItemIds.filter(id => id !== itemId);
      return { savedItemIds: newSavedIds };
    });
  },

  setLoading: loading => set({ isLoading: loading }),
  setError: error => set({ error }),
  clearError: () => set({ error: null }),

  isItemSaved: itemId => {
    return get().savedItemIds.includes(itemId);
  },

  getSavedItemsList: () => {
    const { items, savedItemIds } = get();
    return items.filter(item => savedItemIds.includes(item.id));
  },
}));
