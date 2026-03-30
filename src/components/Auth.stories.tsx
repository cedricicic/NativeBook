import { register } from '../../nativebook';
import { EmailInput } from './EmailInput';
import { PasswordInput } from './PasswordInput';
import { SignInButton } from './SignInButton';
import { GoogleButton } from './GoogleButton';
import { AppleButton } from './AppleButton';

// Register sign-in screen components for NativeBook discovery

register('Auth Email Input', EmailInput, {
  placeholder: { type: 'text', label: 'Placeholder', defaultValue: 'Enter your email' },
  disabled: { type: 'boolean', label: 'Disabled', defaultValue: false },
});

register('Auth Password Input', PasswordInput, {
  placeholder: { type: 'text', label: 'Placeholder', defaultValue: 'Enter your password' },
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
