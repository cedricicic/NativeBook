import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface AppleButtonProps {
  label?: string;
  disabled?: boolean;
  onPress?: () => void;
}

function AppleIcon() {
  return (
    <View style={styles.iconContainer}>
      <Svg width={20} height={20} viewBox="0 0 24 24" fill="#FFFFFF">
        <Path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.32 2.32-1.55 4.3-3.74 4.25z" />
      </Svg>
    </View>
  );
}

export const AppleButton: React.FC<AppleButtonProps> = ({
  label = 'Continue with Apple',
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
      <AppleIcon />
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    width: '100%',
  },
  buttonDisabled: {
    backgroundColor: '#555555',
  },
  iconContainer: {
    marginRight: 8,
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
