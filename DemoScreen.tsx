import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  StatusBar,
  TextInput,
  Pressable,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { NativeBookProvider } from './nativebook';
import './src/stories';

function CloseIcon({ size = 24, color = '#000000' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M18 6L6 18M6 6l12 12"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function AppleIcon({ size = 20, color = '#FFFFFF' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.32 2.32-1.55 4.3-3.74 4.25z" />
    </Svg>
  );
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

function GoogleIcon() {
  return (
    <View style={styles.googleIconContainer}>
      <View style={styles.googleIcon}>
        <Svg width={20} height={20} viewBox="0 0 24 24">
          <Path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <Path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <Path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <Path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </Svg>
      </View>
    </View>
  );
}

/**
 * A static replica of the sign-in screen from a real project.
 * No functional logic — purely visual, to demonstrate NativeBook
 * overlaying an existing screen.
 */
function StaticSignInScreen() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header with Logo */}
        <View style={styles.header}>
          <Text style={styles.logo}>CORDER</Text>
          <View style={styles.closeButton}>
            <CloseIcon size={24} color="#000000" />
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Sign in to your account</Text>
            <Text style={styles.subtitle}>
              Use your email and password to continue
            </Text>
          </View>

          {/* Google Sign In Button */}
          <Pressable style={styles.googleButton}>
            <GoogleIcon />
            <Text style={styles.googleButtonText}>Continue with Google</Text>
          </Pressable>

          {/* Apple Sign In Button */}
          <Pressable style={styles.appleButton}>
            <View style={styles.appleIcon}>
              <AppleIcon size={20} color="#FFFFFF" />
            </View>
            <Text style={styles.appleButtonText}>Continue with Apple</Text>
          </Pressable>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter your email"
              placeholderTextColor="#9ca3af"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={false}
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Enter your password"
                placeholderTextColor="#9ca3af"
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                editable={false}
              />
              <View style={styles.eyeButton}>
                <EyeIcon size={20} color="#6b7280" />
              </View>
            </View>
          </View>

          {/* Sign In Button */}
          <Pressable style={styles.signInButton}>
            <Text style={styles.signInButtonText}>Sign In</Text>
          </Pressable>

          {/* Forgot Password Link */}
          <View style={styles.forgotPasswordContainer}>
            <Text style={styles.forgotPasswordText}>
              Forgot your password?
            </Text>
          </View>

          {/* Sign Up Link */}
          <View style={styles.signUpContainer}>
            <Text style={styles.signUpText}>
              Don't have an account?{' '}
              <Text style={styles.signUpLinkText}>Create one</Text>
            </Text>
          </View>

          {/* Legal Text */}
          <View style={styles.legalContainer}>
            <Text style={styles.legalText}>
              By signing in, you agree to Corder's{' '}
              <Text style={styles.legalLink}>Terms of Service</Text> and{' '}
              <Text style={styles.legalLink}>Privacy Policy</Text>.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

export default function DemoScreen() {
  return (
    <NativeBookProvider showTrigger={true}>
      <StaticSignInScreen />
    </NativeBookProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#faf8f6',
  },
  header: {
    alignItems: 'center',
    paddingBottom: 16,
    backgroundColor: '#fbbf24',
    marginHorizontal: -24,
    paddingHorizontal: 24,
    paddingTop: 60,
    position: 'relative',
  },
  logo: {
    fontSize: 28,
    color: '#000000',
    letterSpacing: 1,
    fontFamily: 'DelaGothicOne-Regular',
  },
  closeButton: {
    position: 'absolute',
    right: 24,
    top: 60,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: 0,
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  card: {
    borderRadius: 8,
    padding: 24,
    backgroundColor: '#faf8f6',
    marginTop: 16,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  googleButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    height: 48,
  },
  googleButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '600',
  },
  googleIconContainer: {
    marginRight: 12,
  },
  googleIcon: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appleButton: {
    backgroundColor: '#000000',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    height: 48,
  },
  appleIcon: {
    marginRight: 8,
  },
  appleButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e5e7eb',
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#000000',
    backgroundColor: '#ffffff',
  },
  passwordContainer: {
    position: 'relative' as const,
  },
  passwordInput: {
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
  eyeButton: {
    position: 'absolute' as const,
    right: 16,
    top: 0,
    bottom: 0,
    justifyContent: 'center' as const,
    padding: 4,
  },

  signInButton: {
    backgroundColor: '#000000',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    height: 48,
  },
  signInButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  forgotPasswordContainer: {
    marginTop: 12,
    marginBottom: 0,
    alignItems: 'center',
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#6b7280',
    textDecorationLine: 'underline',
  },
  signUpContainer: {
    marginTop: 12,
    marginBottom: 0,
    alignItems: 'center',
  },
  signUpText: {
    fontSize: 14,
    color: '#6b7280',
  },
  signUpLinkText: {
    textDecorationLine: 'underline' as const,
  },
  legalContainer: {
    marginTop: 24,
  },
  legalText: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 18,
  },
  legalLink: {
    color: '#6b7280',
    textDecorationLine: 'underline' as const,
  },
});
