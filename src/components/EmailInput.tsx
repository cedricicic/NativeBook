import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

export type InputState = 'idle' | 'focused' | 'error' | 'success';

interface EmailInputProps {
  label?: string;
  placeholder?: string;
  value?: string;
  disabled?: boolean;
  state?: InputState;
}

export const EmailInput: React.FC<EmailInputProps> = ({
  label = 'Email',
  placeholder = 'Enter your email',
  value = '',
  disabled = false,
  state: externalState,
}) => {
  const [internalFocused, setInternalFocused] = useState(false);
  const borderFade = useRef(new Animated.Value(0)).current;

  const currentState: InputState = externalState || (internalFocused ? 'focused' : 'idle');

  useEffect(() => {
    let toValue = 0;
    if (currentState === 'focused') toValue = 1;
    if (currentState === 'success') toValue = 2;
    if (currentState === 'error') toValue = 3;

    Animated.timing(borderFade, {
      toValue,
      duration: 200,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [currentState, borderFade]);

  const borderColor = borderFade.interpolate({
    inputRange: [0, 1, 2, 3],
    outputRange: ['#d1d5db', '#000000', '#16a34a', '#dc2626'],
  });

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Animated.View
        style={[
          styles.inputWrapper,
          { borderColor },
          disabled && styles.inputDisabled,
        ]}
      >
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#9ca3af"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          editable={!disabled}
          value={value}
          onFocus={() => setInternalFocused(true)}
          onBlur={() => setInternalFocused(false)}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  inputWrapper: {
    borderWidth: 1,
    borderRadius: 8,
    height: 52,
    justifyContent: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
  },
  input: {
    fontSize: 16,
    color: '#000000',
    paddingVertical: 12,
  },
  inputDisabled: {
    backgroundColor: '#f3f4f6',
    opacity: 0.5,
  },
});
