# Trial Assignment React Native App

A React Native application built with Expo, TypeScript, and Firebase for the trial assignment.

## Architecture Overview

This app follows a **feature-based architecture** with clear separation of concerns:

### **Why SavedItems is the Feature (Not Items)**

The user value is in **saving & managing items**, not just viewing them. The SavedItems feature owns:

- Item fetching and display
- Save/unsave functionality
- Firestore relationships
- Deep linking to items
- User-specific saved collections

### **Folder Structure**

```
src/
├─ app/
│  ├─ index.tsx
│  └─ navigation/
│     ├─ AppNavigator.tsx
│     ├─ AuthStack.tsx
│     ├─ DeepLinkHandler.tsx
│     ├─ HomeStack.tsx
│     ├─ SavedItemsStack.tsx
│     ├─ SavedItemsTabStack.tsx
│     └─ TabNavigator.tsx
├─ features/
│  ├─ auth/
│  │  ├─ hooks/
│  │  │  └─ useAuth.ts
│  │  ├─ schemas/
│  │  │  └─ authSchemas.ts
│  │  ├─ screens/
│  │  │  ├─ LoginScreen.tsx
│  │  │  └─ SignupScreen.tsx
│  │  ├─ services/
│  │  │  └─ authService.ts
│  │  ├─ state/
│  │  │  └─ authStore.ts
│  │  ├─ types.ts
│  │  └─ index.ts
│  ├─ home_items/
│  │  ├─ components/
│  │  │  ├─ ItemCard.tsx
│  │  │  ├─ ItemDetailContent.tsx
│  │  │  └─ ItemDetailError.tsx
│  │  ├─ hooks/
│  │  │  └─ useHomeItems.ts
│  │  └─ index.ts
│  └─ saved_items/
│     ├─ components/
│     │  ├─ ItemActions.tsx
│     │  ├─ SavedItemsList.tsx
│     │  └─ SaveToggleButton.tsx
│     ├─ constants.ts
│     ├─ hooks/
│     │  ├─ useItemDetail.ts
│     │  ├─ useSavedItems.ts
│     │  └─ useSaveToggle.ts
│     ├─ screens/
│     │  ├─ ItemDetailScreen.tsx
│     │  ├─ SavedItemsScreen.tsx
│     │  └─ SaveToggleScreen.tsx
│     ├─ services/
│     │  ├─ Firebase.ts
│     │  └─ LinkingService.ts
│     ├─ state/
│     │  └─ savedItemsStore.ts
│     ├─ types.ts
│     └─ index.ts
├─ shared/
│  ├─ components/
│  │  ├─ ActionButton.tsx
│  │  ├─ AuthHeader.tsx
│  │  ├── ErrorBoundary.tsx
│  │  ├── ErrorState.tsx
│  │  ├── LoadingSpinner.tsx
│  │  ├── ScreenContainer.tsx
│  │  └── [8 more components...]
│  ├─ hooks/
│  │  ├─ useDebounce.ts
│  │  ├─ useNetworkStatus.ts
│  │  └─ [2 more hooks...]
│  ├─ theme/
│  │  ├─ colors.ts
│  │  ├─ spacing.ts
│  │  ├─ typography.ts
│  │  └─ [3 more files...]
│  ├─ types/
│  │  └─ navigation.ts
│  ├─ utils/
│  │  ├─ firebase.ts
│  │  ├─ formatters.ts
│  │  └─ [3 more utilities...]
│  └─ index.ts
└─ __tests__/
   ├─ components/
   ├─ hooks/
   ├─ integration/
   ├─ screens/
   └─ services/
```

### **Firestore Data Model**

We use a **relational approach** in Firestore to ensure data integrity and scalability:

- **`items` collection**: Global catalog of items. This is the single source of truth for item details (title, description, etc.).
- **`userSaves` collection**: A bridge collection mapping `userId` to `itemId`.
  - **Rationale**: This prevents data duplication. If an item's title changes, it's updated once in `/items` and reflects for all users who saved it.
  - **Scalability**: Handles 1,000+ items efficiently by leveraging Firestore's `in` queries (chunked) and persistent local cache.

### **Sync, Conflicts & Failures**

- **Real-time Sync**: Managed via Firestore Snapshots and React Query's `staleTime`.
- **Conflict Resolution**: Since "Saved Items" is a simple toggle, conflicts are handled by Firestore's standard "last write wins" strategy.
- **Offline Reliability**: Enabled via `persistentLocalCache`. Operations are queued locally and synced automatically when back online.
- **Defensive Parsing**: Deep links and manual navigation verify item existence in Firestore before rendering the UI, preventing crashes on deleted or missing data.

### **Deep Linking Architecture**

`src/app/navigation/DeepLinkHandler.tsx` manages incoming URLs:

1. **Verification**: When a link is opened, we first check if the `itemId` exists in Firestore.
2. **Conditional Navigation**: If found, we navigate to the detail screen; otherwise, we log a warning or could show a "Not Found" state.
3. **Link Creation**: `LinkingService.ts` generates links using `expo-linking`, ensuring consistent URL schemes across iOS and Android.

### **Offline & Edge Cases**

Handled naturally by:

- Firestore offline persistence
- Zustand local state
- Defensive parsing in LinkingService
- ErrorState components in shared

## Technology Stack

### **Core**

- **Expo** - React Native framework
- **TypeScript** - Type safety
- **React Native** - Native components

### **Firebase**

- **Authentication** - User auth flows
- **Firestore** - Primary remote data source
- **Offline persistence** - Built-in offline support

### **State & Data**

- **@tanstack/react-query** - Server state management
- **Zustand** - Local state management

### **Navigation & Linking**

- **@react-navigation/native** - Navigation
- **expo-linking** - Deep linking

### **Tooling**

- **ESLint** - Code linting with boundaries
- **Prettier** - Code formatting

## Getting Started

### **Prerequisites**

- Node.js 18+
- Expo CLI
- Firebase project

### **Installation**

```bash
npm install
```

### **Firebase Setup**

1. Create a Firebase project
2. Enable Authentication and Firestore
3. Copy Firebase config to:
   - `src/features/Auth/services/Firebase.ts`
   - `src/features/SavedItems/services/Firebase.ts`

### **Database Seeding**

To populate Firestore with sample data for development:

```bash
npm run seed
```

This will:

- Add 5 sample items to the `items` collection
- Create a sample user save relationship
- Provide initial data for testing the app functionality

### **Development Server**

```bash
npm start
```

### **Platform-Specific Commands**

```bash
# Run on iOS
npm run ios

# Run on Android
npm run android

# Run on Web
npm run web
```

## Features

### **Authentication**

- Login/Signup with email/password
- Firebase Auth integration
- Persistent sessions

### **Saved Items Management**

- View all available items
- Save/unsave items
- View saved items collection
- Item details screen
- Deep linking to items
- Share functionality

### **Offline Support**

- Firestore offline persistence
- Local state management
- Network awareness

## Code Quality

### **ESLint Boundaries**

Enforces architectural rules:

- `shared` → can only import `shared`
- `feature` → can import `shared` + same feature
- `app` → can import `shared` + `feature`

### **TypeScript**

Strict typing throughout:

- Full type coverage
- Interface definitions
- Generic utilities

### **Testing**

Focused test suite covering core functionality:

- Unit tests for core services
- Hook testing with `@testing-library/react-native`
- Mock configurations for Firebase and React Native modules
- Coverage reporting with `npm run test:coverage`

**Test Commands:**

```bash
npm run test              # Run all tests
npm run test:watch        # Run tests in watch mode
npm run test:coverage     # Run tests with coverage report
```

## Contributing

1. Follow the established folder structure
2. Respect ESLint boundaries
3. Write TypeScript types
4. Test on multiple platforms

## License

MIT License - see LICENSE file for details.

# Feature-based
