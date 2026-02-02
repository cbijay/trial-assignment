// Core domain types
export interface Item {
  id: string;
  title: string;
  description: string;
  updatedAt: number;
  createdAt?: number;
  imageUrl?: string;
  category?: string;
  metadata?: Record<string, unknown>;
}

export interface SavedItem extends Item {
  userId: string;
  isSaved: boolean;
  savedAt?: number;
}

// Data transfer objects
export interface CreateItemData {
  title: string;
  description: string;
  category?: string;
  imageUrl?: string;
  metadata?: Record<string, unknown>;
}

export interface UpdateItemData {
  title?: string;
  description?: string;
  category?: string;
  imageUrl?: string;
  metadata?: Record<string, unknown>;
}

// Firestore-specific types
export interface ItemDocument extends Item {
  createdAt: number;
}

export interface UserSaveDocument {
  userId: string;
  itemId: string;
  savedAt: number;
}

export interface UserSaveInput {
  userId: string;
  itemId: string;
}

// Pagination and query types
export interface PaginationOptions {
  limitCount?: number;
  lastVisible?: unknown; // DocumentSnapshot from Firestore
}

export interface PaginatedResult<T> {
  items: T[];
  hasMore: boolean;
  lastVisible?: unknown; // DocumentSnapshot from Firestore
  totalCount?: number;
}

export interface QueryOptions {
  preferCache?: boolean;
  includeMetadata?: boolean;
}

// Batch operations
export interface BatchSaveOperation {
  itemId: string;
  action: 'save' | 'unsave';
}

export interface BatchWriteResult {
  success: boolean;
  written: number;
  failed: number;
  errors?: unknown[];
}

// Search and filter types
export interface SearchOptions {
  query: string;
  limitCount?: number;
  preferCache?: boolean;
}

export interface FilterOptions {
  sortBy?: 'updatedAt' | 'createdAt' | 'title';
  sortOrder?: 'asc' | 'desc';
  limitCount?: number;
}

// Cache strategy
export type CacheStrategy =
  | 'cache-first'
  | 'network-first'
  | 'cache-only'
  | 'network-only';

export interface CacheOptions {
  strategy: CacheStrategy;
  staleTime?: number; // in milliseconds
  cacheTime?: number; // in milliseconds
}
