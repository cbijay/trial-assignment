import { commonStyles } from '@/shared/theme';
import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

interface FormInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onBlur: (e?: unknown) => void;
  placeholder: string;
  error?: string;
  touched?: boolean;
  secureTextEntry?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  placeholderTextColor?: string;
}

export const FormInput: React.FC<FormInputProps> = ({
  value,
  onChangeText,
  onBlur,
  placeholder,
  error,
  touched,
  secureTextEntry = false,
  autoCapitalize = 'sentences',
  keyboardType = 'default',
  placeholderTextColor = '#9ca3af',
}) => {
  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={[
          commonStyles.input,
          touched && error && commonStyles.inputError,
        ]}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        value={value}
        onChangeText={onChangeText}
        onBlur={onBlur}
        secureTextEntry={secureTextEntry}
        autoCapitalize={autoCapitalize}
        keyboardType={keyboardType}
      />
      {touched && error && (
        <Text style={commonStyles.errorText}>{error}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 16,
  },
});
