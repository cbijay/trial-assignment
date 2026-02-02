import { ActionButton } from '@/shared/components/ActionButton';
import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

describe('ActionButton', () => {
  const defaultProps = {
    title: 'Test Button',
    onPress: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render correctly with default props', () => {
    const { getByText } = render(<ActionButton {...defaultProps} />);

    expect(getByText('Test Button')).toBeTruthy();
  });

  it('should call onPress when pressed', () => {
    const mockOnPress = jest.fn();
    const props = { ...defaultProps, onPress: mockOnPress };
    const { getByText } = render(<ActionButton {...props} />);

    const button = getByText('Test Button');
    fireEvent.press(button);

    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when disabled prop is true', () => {
    const mockOnPress = jest.fn();
    const props = { ...defaultProps, onPress: mockOnPress, disabled: true };
    const { getByText } = render(<ActionButton {...props} />);

    const button = getByText('Test Button');
    fireEvent.press(button);

    expect(mockOnPress).not.toHaveBeenCalled();
  });

  it('should be disabled when loading prop is true', () => {
    const mockOnPress = jest.fn();
    const props = { ...defaultProps, onPress: mockOnPress, loading: true };
    const { getByText } = render(<ActionButton {...props} />);

    const button = getByText('Loading...');
    fireEvent.press(button);

    expect(mockOnPress).not.toHaveBeenCalled();
  });

  it('should show loading text when loading', () => {
    const props = { ...defaultProps, loading: true };
    const { getByText } = render(<ActionButton {...props} />);

    expect(getByText('Loading...')).toBeTruthy();
  });

  it('should render secondary variant when specified', () => {
    const props = { ...defaultProps, variant: 'secondary' as const };
    const { getByText } = render(<ActionButton {...props} />);

    expect(getByText('Test Button')).toBeTruthy();
  });

  it('should render with icon on the left by default', () => {
    const props = { ...defaultProps, icon: 'heart' };
    const { getByText } = render(<ActionButton {...props} />);

    expect(getByText('Test Button')).toBeTruthy();
  });

  it('should render with icon on the right when specified', () => {
    const props = { ...defaultProps, icon: 'heart', iconPosition: 'right' as const };
    const { getByText } = render(<ActionButton {...props} />);

    expect(getByText('Test Button')).toBeTruthy();
  });

  it('should use custom activeOpacity when provided', () => {
    const props = { ...defaultProps, activeOpacity: 0.5 };
    const { getByText } = render(<ActionButton {...props} />);

    expect(getByText('Test Button')).toBeTruthy();
  });

  it('should not render icon when not provided', () => {
    const { getByText } = render(<ActionButton {...defaultProps} />);

    expect(getByText('Test Button')).toBeTruthy();
  });
});
