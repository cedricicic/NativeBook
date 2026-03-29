import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

interface EmailInputProps {
  label?: string;
  placeholder?: string;
  value?: string;
  disabled?: boolean;
}

export const EmailInput: React.FC<EmailInputProps> = ({
  label = 'Email',
  placeholder = 'Enter your email',
  value = '',
  disabled = false,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, disabled && styles.inputDisabled]}
        placeholder={placeholder}
        placeholderTextColor="#9ca3af"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        editable={!disabled}
        value={value}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#000000',
    backgroundColor: '#ffffff',
  },
  inputDisabled: {
    backgroundColor: '#f3f4f6',
    color: '#9ca3af',
  },
});
