import React from 'react';
import { render } from '@testing-library/react-native';
import { AuthHeader } from '@/shared/components/AuthHeader';

describe('AuthHeader', () => {
  it('should render title and subtitle correctly', () => {
    const props = {
      title: 'Welcome Back',
      subtitle: 'Sign in to continue',
    };
    
    const { getByText } = render(<AuthHeader {...props} />);
    
    expect(getByText('Welcome Back')).toBeTruthy();
    expect(getByText('Sign in to continue')).toBeTruthy();
  });

  it('should render different title and subtitle', () => {
    const props = {
      title: 'Create Account',
      subtitle: 'Join us today',
    };
    
    const { getByText } = render(<AuthHeader {...props} />);
    
    expect(getByText('Create Account')).toBeTruthy();
    expect(getByText('Join us today')).toBeTruthy();
  });

  it('should handle empty subtitle', () => {
    const props = {
      title: 'Login',
      subtitle: '',
    };
    
    const { getByText } = render(<AuthHeader {...props} />);
    
    expect(getByText('Login')).toBeTruthy();
    expect(getByText('')).toBeTruthy();
  });

  it('should handle long text', () => {
    const props = {
      title: 'This is a very long title that might wrap',
      subtitle: 'This is a very long subtitle that might also wrap to multiple lines',
    };
    
    const { getByText } = render(<AuthHeader {...props} />);
    
    expect(getByText('This is a very long title that might wrap')).toBeTruthy();
    expect(getByText('This is a very long subtitle that might also wrap to multiple lines')).toBeTruthy();
  });
});
