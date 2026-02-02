require('react-native-gesture-handler/jestSetup');

// Global cleanup for async operations
afterEach(() => {
  jest.clearAllTimers();
  jest.useRealTimers();
  jest.clearAllMocks();
});

// Handle Jest not exiting issue
afterAll(() => {
  jest.clearAllMocks();
  jest.useRealTimers();
  jest.restoreAllMocks();
});

// Force close any hanging connections
process.on('exit', () => {
  jest.clearAllMocks();
  jest.useRealTimers();
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Handle uncaught exceptions
process.on('uncaughtException', error => {
  console.log('Uncaught Exception:', error);
});

// Mock react-native-vector-icons
jest.mock('react-native-vector-icons/Ionicons', () => ({
  __esModule: true,
  default: ({ name, _testID }) => `Icon-${name}`,
}));

// Mock Firebase configuration
jest.mock('@/shared/utils/firebase', () => ({
  auth: {
    currentUser: null,
    onAuthStateChanged: jest.fn(),
    signInWithEmailAndPassword: jest.fn(),
    createUserWithEmailAndPassword: jest.fn(),
    signOut: jest.fn(),
  },
  db: {
    collection: jest.fn(() => ({
      doc: jest.fn(() => ({
        get: jest.fn(),
        set: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      })),
      addDoc: jest.fn(),
      where: jest.fn(() => ({
        get: jest.fn(),
        orderBy: jest.fn(() => ({
          limit: jest.fn(() => ({
            get: jest.fn(),
          })),
        })),
      })),
      orderBy: jest.fn(() => ({
        limit: jest.fn(() => ({
          get: jest.fn(),
        })),
      })),
      limit: jest.fn(() => ({
        get: jest.fn(),
      })),
    })),
  },
  enableOfflineMode: jest.fn(),
  enableOnlineMode: jest.fn(),
}));

jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
  }),
  useRoute: () => ({
    params: {},
  }),
}));

jest.mock('expo-linking', () => ({
  createURL: jest.fn(() => 'trialassignment://item-detail?itemId=test'),
  parse: jest.fn(() => ({
    hostname: 'item-detail',
    queryParams: { _testID: 'test-button' },
  })),
  addEventListener: jest.fn(() => ({
    remove: jest.fn(),
  })),
  getInitialURL: jest.fn(() => Promise.resolve(null)),
}));

jest.mock('@react-native-community/netinfo', () => ({
  fetch: jest.fn(() => Promise.resolve({ isConnected: true })),
  addEventListener: jest.fn(() => jest.fn()),
}));

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  doc: jest.fn(),
  addDoc: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
  getDoc: jest.fn(),
  getDocs: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  orderBy: jest.fn(),
  limit: jest.fn(),
  startAfter: jest.fn(),
  runTransaction: jest.fn(),
  Timestamp: {
    now: jest.fn(() => ({ toMillis: () => Date.now() })),
    fromDate: jest.fn(),
  },
}));

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({
    currentUser: null,
    onAuthStateChanged: jest.fn(),
  })),
}));
