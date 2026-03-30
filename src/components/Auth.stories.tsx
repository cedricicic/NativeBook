import { register } from '../../nativebook';
import { EmailInput } from './EmailInput';
import { PasswordInput } from './PasswordInput';
import { SignInButton } from './SignInButton';
import { GoogleButton } from './GoogleButton';
import { AppleButton } from './AppleButton';

// Register sign-in screen components for NativeBook discovery

register('Auth Email Input', EmailInput, {
  label: { type: 'text', label: 'Label', defaultValue: 'Email' },
  placeholder: { type: 'text', label: 'Placeholder', defaultValue: 'Enter your email' },
  value: { type: 'text', label: 'Value', defaultValue: '' },
  state: { type: 'select', label: 'State', defaultValue: 'idle', options: ['idle', 'focused', 'success', 'error'] },
  disabled: { type: 'boolean', label: 'Disabled', defaultValue: false },
});

register('Auth Password Input', PasswordInput, {
  label: { type: 'text', label: 'Label', defaultValue: 'Password' },
  placeholder: { type: 'text', label: 'Placeholder', defaultValue: 'Enter your password' },
  value: { type: 'text', label: 'Value', defaultValue: '' },
  state: { type: 'select', label: 'State', defaultValue: 'idle', options: ['idle', 'focused', 'success', 'error'] },
  disabled: { type: 'boolean', label: 'Disabled', defaultValue: false },
});

register('Auth Sign In', SignInButton, {
  label: { type: 'text', label: 'Label', defaultValue: 'Sign In' },
  state: { type: 'select', label: 'State', defaultValue: 'idle', options: ['idle', 'loading', 'success', 'error'] },
  disabled: { type: 'boolean', label: 'Disabled', defaultValue: false },
});

register('Auth Continue with Google', GoogleButton, {
  label: { type: 'text', label: 'Label', defaultValue: 'Continue with Google' },
  disabled: { type: 'boolean', label: 'Disabled', defaultValue: false },
});

register('Auth Continue with Apple', AppleButton, {
  label: { type: 'text', label: 'Label', defaultValue: 'Continue with Apple' },
  disabled: { type: 'boolean', label: 'Disabled', defaultValue: false },
});
