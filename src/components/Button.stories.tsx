import React from 'react';
import { register } from '../../nativebook';
import { MyButton } from './Button';

// Register the button component for NativeBook discovery
register('Primary Button', () => <MyButton variant="primary" label="Save Changes" />);
register('Secondary Button', () => <MyButton variant="secondary" label="Confirm Download" />);
register('Outline Button', () => <MyButton variant="outline" label="Cancel" />);
