import { ItemActions } from '@/shared/components/ItemActions';
import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

describe('ItemActions', () => {
  const defaultProps = {
    isSaved: false,
    isToggling: false,
    onSaveToggle: jest.fn(),
    onShare: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render save and share buttons', () => {
    const { getByText } = render(<ItemActions {...defaultProps} />);

    expect(getByText('Save')).toBeTruthy();
    expect(getByText('Share')).toBeTruthy();
  });

  it('should show "Saved" when item is saved', () => {
    const props = { ...defaultProps, isSaved: true };
    const { getByText } = render(<ItemActions {...props} />);

    expect(getByText('Saved')).toBeTruthy();
    expect(getByText('Share')).toBeTruthy();
  });

  it('should call onSaveToggle when save button is pressed', () => {
    const mockOnSaveToggle = jest.fn();
    const props = { ...defaultProps, onSaveToggle: mockOnSaveToggle };
    const { getByText } = render(<ItemActions {...props} />);

    const saveButton = getByText('Save');
    fireEvent.press(saveButton);

    expect(mockOnSaveToggle).toHaveBeenCalledTimes(1);
  });

  it('should call onShare when share button is pressed', () => {
    const mockOnShare = jest.fn();
    const props = { ...defaultProps, onShare: mockOnShare };
    const { getByText } = render(<ItemActions {...props} />);

    const shareButton = getByText('Share');
    fireEvent.press(shareButton);

    expect(mockOnShare).toHaveBeenCalledTimes(1);
  });

  it('should disable save button when toggling', () => {
    const mockOnSaveToggle = jest.fn();
    const props = { ...defaultProps, isToggling: true, onSaveToggle: mockOnSaveToggle };
    const { getByText } = render(<ItemActions {...props} />);

    // When toggling, the save button shows "Loading..." instead of "Save"
    const saveButton = getByText('Loading...');
    fireEvent.press(saveButton);

    expect(mockOnSaveToggle).not.toHaveBeenCalled();
  });

  it('should show loading state on save button when toggling', () => {
    const props = { ...defaultProps, isToggling: true };
    const { getByText } = render(<ItemActions {...props} />);

    expect(getByText('Loading...')).toBeTruthy();
  });

  it('should not disable share button when toggling', () => {
    const mockOnShare = jest.fn();
    const props = { ...defaultProps, isToggling: true, onShare: mockOnShare };
    const { getByText } = render(<ItemActions {...props} />);

    const shareButton = getByText('Share');
    fireEvent.press(shareButton);

    expect(mockOnShare).toHaveBeenCalledTimes(1);
  });
});
