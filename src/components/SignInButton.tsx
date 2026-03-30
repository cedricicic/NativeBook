import React, { useEffect, useRef } from 'react';
import {
  ActivityIndicator,
  Animated,
  Easing,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export type SignInButtonState = 'idle' | 'loading' | 'success' | 'error';

interface SignInButtonProps {
  label?: string;
  disabled?: boolean;
  state?: SignInButtonState;
  onPress?: () => void;
}

export const SignInButton: React.FC<SignInButtonProps> = ({
  label = 'Sign In',
  disabled = false,
  state = 'idle',
  onPress,
}) => {
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const bgFade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (state === 'error') {
      // Shake animation for error
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 10, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -10, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 8, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -8, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 4, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
      ]).start();
    }
  }, [state, shakeAnim]);

  useEffect(() => {
    if (state === 'success') {
      Animated.sequence([
        Animated.timing(scaleAnim, { toValue: 0.95, duration: 100, useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 1, damping: 10, stiffness: 300, useNativeDriver: true }),
      ]).start();
    } else {
      scaleAnim.setValue(1);
    }
  }, [state, scaleAnim]);

  useEffect(() => {
    Animated.timing(bgFade, {
      toValue: state === 'success' ? 1 : state === 'error' ? 2 : 0,
      duration: 200,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [state, bgFade]);

  const backgroundColor = bgFade.interpolate({
    inputRange: [0, 1, 2],
    outputRange: ['#000000', '#000000', '#000000'],
  });

  const isLoading = state === 'loading';
  const isSuccess = state === 'success';
  const isError = state === 'error';

  const displayLabel = isSuccess ? 'Signed In' : isError ? 'Try Again' : label;

  return (
    <Animated.View
      style={[
        { transform: [{ translateX: shakeAnim }, { scale: scaleAnim }] },
        styles.wrapper,
      ]}
    >
      <TouchableOpacity
        style={[styles.touchable, disabled && styles.touchableDisabled]}
        onPress={onPress}
        activeOpacity={0.8}
        disabled={disabled || isLoading}
      >
        <Animated.View style={[styles.button, { backgroundColor }]}>
          {isLoading ? (
            <View style={styles.loadingRow}>
              <ActivityIndicator size="small" color="#ffffff" />
              <Text style={styles.loadingText}>Signing in...</Text>
            </View>
          ) : (
            <Text style={[styles.text, disabled && styles.textDisabled]}>
              {displayLabel}
            </Text>
          )}
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  touchable: {
    width: '100%',
  },
  touchableDisabled: {
    opacity: 0.5,
  },
  button: {
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    width: '100%',
  },
  text: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  textDisabled: {
    color: '#9ca3af',
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  loadingText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
