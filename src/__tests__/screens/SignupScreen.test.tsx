import { SignupScreen } from '@/features/auth/screens/SignupScreen';
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
    signUp: jest.fn(),
    isAuthenticating: false,
    error: null,
  }),
}));

jest.mock('formik', () => ({
  Formik: ({ children }: { children: (props: unknown) => React.ReactElement }) => {
    const mockValues = {
      email: 'test@example.com',
      password: 'password123',
      confirmPassword: 'password123'
    };
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

describe('SignupScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render signup form correctly', () => {
    const { getByText, getByPlaceholderText } = renderWithProviders(<SignupScreen />);

    expect(getByText('Create Account')).toBeTruthy();
    expect(getByText('Join trial assignment today')).toBeTruthy();
    expect(getByPlaceholderText('Email address')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();
    expect(getByPlaceholderText('Confirm Password')).toBeTruthy();
    expect(getByText('Sign Up')).toBeTruthy();
    // Check for the auth footer text
    expect(getByText('Sign In')).toBeTruthy();
  });
});
