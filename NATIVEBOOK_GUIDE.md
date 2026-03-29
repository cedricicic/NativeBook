# NativeBook Guide

NativeBook is a **native-first Storybook alternative** for React Native. It allows developers to preview, interact with, and stress-test components in isolation directly within the iOS or Android simulator without needing a separate web-based interface.

---

## 🚀 How it Works

### 1. Integration (The Provider)
NativeBook is integrated into the app via the `NativeBookProvider`. This provider:
- Wraps the entire application.
- Keeps track of registered components and their preview state using a **Zustand** store.
- Renders a **floating draggable button** (labeled "NB") that stays on top of your app's main content.

### 2. Isolation Mode
When you select a component from the NativeBook menu:
- The provider replaces your main app's UI with a dedicated **preview environment**.
- The component is rendered in a centered "frame" on top of a **grid dot background** to help with alignment and visual auditing.
- A label at the bottom shows the exact **pixel dimensions** (width × height) of the rendered component.

---

## 🛠️ How Developers Use It

### Registration
To make a component discoverable in NativeBook, developers create a `.stories.tsx` file and use the `register` function:

```tsx
import { register } from './nativebook';
import { MyButton } from './components/Button';

// Register different variants to the explorer menu
register('Primary Button', () => <MyButton variant="primary" label="Save Changes" />);
register('Secondary Button', () => <MyButton variant="secondary" label="Cancel" />);
```

### Discovery
- Tapping the floating **NB** button opens the **Component Explorer**.
- You can search for components by name.
- Components are grouped by the last word in their name (e.g., "Primary Button" and "Secondary Button" both appear under the **BUTTONS** section).

---

## 🕵️‍♂️ Checking UI States (The "Props" Tab)

The core power of NativeBook is the **Overlay Panel**, specifically the **Props** tab. This is where you can "check states" dynamically:

| Input Type | Usage |
| :--- | :--- |
| **Strings** | Edit text labels in real-time using a text input. |
| **Enums** | Switch between predefined variants (e.g., primary, outline) using radio buttons. |
| **Booleans** | Toggle binary states like `disabled`, `loading`, or `active` using a toggle button. |

Changing any of these "knobs" instantly updates the isolated component in the preview frame without a full app reload.

---

## 📚 Future Roadmap
- **Events Tab**: Real-time logging of component callbacks like `onPress` and `onChangeText`.
- **Docs Tab**: Auto-populated documentation for component props and usage notes.
- **Auto-Discovery**: Automatic indexing of all `.stories.tsx` files via a Metro transformer.

---

## 📥 Getting Started
If you are a developer working with NativeBook:
1. Ensure your root component is wrapped with `<NativeBookProvider>`.
2. Add a `require('./path/to/my.stories');` in `src/stories.ts`.
3. Open the app, tap the "NB" button, and start tweaking!
