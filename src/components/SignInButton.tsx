import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

interface SignInButtonProps {
  label?: string;
  disabled?: boolean;
  onPress?: () => void;
}

export const SignInButton: React.FC<SignInButtonProps> = ({
  label = 'Sign In',
  disabled = false,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.buttonDisabled]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={disabled}
    >
      <Text style={[styles.text, disabled && styles.textDisabled]}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#000000',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    width: '100%',
  },
  buttonDisabled: {
    backgroundColor: '#d1d5db',
  },
  text: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  textDisabled: {
    color: '#9ca3af',
  },
});
