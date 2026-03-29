import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface PasswordInputProps {
  label?: string;
  placeholder?: string;
  value?: string;
  disabled?: boolean;
}

function EyeIcon({ size = 20, color = '#6b7280' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 15a3 3 0 100-6 3 3 0 000 6z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  label = 'Password',
  placeholder = 'Enter your password',
  value = '',
  disabled = false,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputWrapper}>
        <TextInput
          style={[styles.input, disabled && styles.inputDisabled]}
          placeholder={placeholder}
          placeholderTextColor="#9ca3af"
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
          editable={!disabled}
          value={value}
        />
        <View style={styles.eyeButton}>
          <EyeIcon size={20} color="#6b7280" />
        </View>
      </View>
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
  inputWrapper: {
    position: 'relative' as const,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingRight: 48,
    fontSize: 16,
    color: '#000000',
    backgroundColor: '#ffffff',
  },
  inputDisabled: {
    backgroundColor: '#f3f4f6',
    color: '#9ca3af',
  },
  eyeButton: {
    position: 'absolute' as const,
    right: 16,
    top: 0,
    bottom: 0,
    justifyContent: 'center' as const,
    padding: 4,
  },
});
