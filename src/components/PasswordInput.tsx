import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';

export type InputState = 'idle' | 'focused' | 'error' | 'success';

interface PasswordInputProps {
  label?: string;
  placeholder?: string;
  value?: string;
  disabled?: boolean;
  state?: InputState;
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
  state: externalState,
}) => {
  const [internalFocused, setInternalFocused] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  
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
          secureTextEntry={secureTextEntry}
          autoCapitalize="none"
          autoCorrect={false}
          editable={!disabled}
          value={value}
          onFocus={() => setInternalFocused(true)}
          onBlur={() => setInternalFocused(false)}
        />
        
        <TouchableOpacity 
          style={styles.eyeButton} 
          onPress={() => setSecureTextEntry(!secureTextEntry)}
        >
          <EyeIcon size={20} color={currentState === 'focused' ? '#000000' : '#6b7280'} />
        </TouchableOpacity>
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000000',
    paddingVertical: 12,
    margin: 0,
  },
  inputDisabled: {
    backgroundColor: '#f3f4f6',
    opacity: 0.5,
  },
  eyeButton: {
    padding: 4,
    marginLeft: 8,
  },
});
