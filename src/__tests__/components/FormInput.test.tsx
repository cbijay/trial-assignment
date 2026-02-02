import { FormInput } from '@/shared/components/FormInput';
import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

describe('FormInput', () => {
  const defaultProps = {
    value: '',
    onChangeText: jest.fn(),
    onBlur: jest.fn(),
    placeholder: 'Test placeholder',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render correctly with default props', () => {
    const { getByPlaceholderText } = render(<FormInput {...defaultProps} />);

    expect(getByPlaceholderText('Test placeholder')).toBeTruthy();
  });

  it('should display the current value', () => {
    const props = { ...defaultProps, value: 'test value' };
    const { getByDisplayValue } = render(<FormInput {...props} />);

    expect(getByDisplayValue('test value')).toBeTruthy();
  });

  it('should call onChangeText when text changes', () => {
    const mockOnChangeText = jest.fn();
    const props = { ...defaultProps, onChangeText: mockOnChangeText };
    const { getByPlaceholderText } = render(<FormInput {...props} />);

    const input = getByPlaceholderText('Test placeholder');
    fireEvent.changeText(input, 'new value');

    expect(mockOnChangeText).toHaveBeenCalledWith('new value');
  });

  it('should call onBlur when input loses focus', () => {
    const mockOnBlur = jest.fn();
    const props = { ...defaultProps, onBlur: mockOnBlur };
    const { getByPlaceholderText } = render(<FormInput {...props} />);

    const input = getByPlaceholderText('Test placeholder');
    fireEvent(input, 'blur');

    expect(mockOnBlur).toHaveBeenCalled();
  });

  it('should display error message when error and touched are provided', () => {
    const props = {
      ...defaultProps,
      error: 'This field is required',
      touched: true,
    };
    const { getByText } = render(<FormInput {...props} />);

    expect(getByText('This field is required')).toBeTruthy();
  });

  it('should not display error message when not touched', () => {
    const props = {
      ...defaultProps,
      error: 'This field is required',
      touched: false,
    };
    const { queryByText } = render(<FormInput {...props} />);

    expect(queryByText('This field is required')).toBeFalsy();
  });

  it('should apply secure text entry when specified', () => {
    const props = { ...defaultProps, secureTextEntry: true };
    const { getByPlaceholderText } = render(<FormInput {...props} />);

    const input = getByPlaceholderText('Test placeholder');
    expect(input.props.secureTextEntry).toBe(true);
  });

  it('should apply email keyboard type when specified', () => {
    const props = { ...defaultProps, keyboardType: 'email-address' as const };
    const { getByPlaceholderText } = render(<FormInput {...props} />);

    const input = getByPlaceholderText('Test placeholder');
    expect(input.props.keyboardType).toBe('email-address');
  });

  it('should apply autoCapitalize none when specified', () => {
    const props = { ...defaultProps, autoCapitalize: 'none' as const };
    const { getByPlaceholderText } = render(<FormInput {...props} />);

    const input = getByPlaceholderText('Test placeholder');
    expect(input.props.autoCapitalize).toBe('none');
  });

  it('should use custom placeholder text color when provided', () => {
    const props = { ...defaultProps, placeholderTextColor: '#ff0000' };
    const { getByPlaceholderText } = render(<FormInput {...props} />);

    const input = getByPlaceholderText('Test placeholder');
    expect(input.props.placeholderTextColor).toBe('#ff0000');
  });
});
