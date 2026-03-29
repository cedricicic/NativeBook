import React from 'react';
import { register } from '../../nativebook';
import { EmailInput } from './EmailInput';
import { PasswordInput } from './PasswordInput';
import { SignInButton } from './SignInButton';
import { GoogleButton } from './GoogleButton';
import { AppleButton } from './AppleButton';

// Register sign-in screen components for NativeBook discovery
register('Auth Email Input', () => <EmailInput />);
register('Auth Password Input', () => <PasswordInput />);
register('Auth Sign In', () => <SignInButton />);
register('Auth Continue with Google', () => <GoogleButton />);
register('Auth Continue with Apple', () => <AppleButton />);
