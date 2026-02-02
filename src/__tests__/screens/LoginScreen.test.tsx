import { LoginScreen } from '@/features/auth/screens/LoginScreen';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react-native';
import React from 'react';

// Mock all the dependencies
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
}));

jest.mock('@/features/auth/state/authStore', () => ({
  useAuthStore: () => ({
    signIn: jest.fn(),
    isAuthenticating: false,
    error: null,
  }),
}));

jest.mock('formik', () => ({
  Formik: ({ children }: { children: (props: unknown) => React.ReactElement }) => {
    const mockValues = { email: 'test@example.com', password: 'password123' };
    return children({
      values: mockValues,
      errors: {},
      touched: {},
      isSubmitting: false,
      handleChange: jest.fn(),
      handleBlur: jest.fn(),
      handleSubmit: jest.fn(),
    });
  },
}));

const renderWithProviders = (component: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      {component}
    </QueryClientProvider>
  );
};

describe('LoginScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render login form correctly', () => {
    const { getByText, getByPlaceholderText } = renderWithProviders(<LoginScreen />);

    expect(getByText('Welcome Back')).toBeTruthy();
    expect(getByText('Sign in to continue to trial assignment')).toBeTruthy();
    expect(getByPlaceholderText('Email address')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();
    expect(getByText('Sign In')).toBeTruthy();
    // Check for the auth footer text
    expect(getByText('Sign Up')).toBeTruthy();
  });
});
