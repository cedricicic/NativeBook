import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

interface ButtonProps {
  label?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  onPress?: () => void;
  disabled?: boolean;
}

export const MyButton: React.FC<ButtonProps> = ({ 
  label = 'Click Me', 
  variant = 'primary',
  onPress,
  disabled = false,
}) => {
  const getStyles = () => {
    switch (variant) {
      case 'secondary': return styles.secondary;
      case 'outline': return styles.outline;
      default: return styles.primary;
    }
  };

  const getTextColor = () => {
    if (disabled) return '#888888';
    if (variant === 'outline') return '#000000';
    return '#FFFFFF';
  };

  return (
    <TouchableOpacity 
      style={[styles.button, getStyles(), disabled && styles.disabled]} 
      onPress={onPress}
      activeOpacity={0.7}
      disabled={disabled}
    >
      <Text style={[styles.text, { color: getTextColor() }]}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 0,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120,
    minHeight: 44,
    borderWidth: 1,
    borderColor: '#000000',
  },
  text: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.32,
  },
  primary: {
    backgroundColor: '#000000',
  },
  secondary: {
    backgroundColor: '#5C5C5C',
    borderColor: '#5C5C5C',
  },
  outline: {
    backgroundColor: '#FFFFFF',
  },
  disabled: {
    backgroundColor: '#FAFAFA',
    borderColor: '#EAEAEA',
  },
});
