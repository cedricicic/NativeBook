# UI_SPEC.md

## 🔭 Project: NativeBook
**Concept:** A Vercel-inspired, high-performance UI Component Explorer for Native iOS.  
**Design Language:** Minimalist / Monochrome / Industrial.

---

## 🎨 Brand Identity
- **Primary Palette:** `#000000` (Backgrounds), `#FFFFFF` (Text/Surface).
- **Accents:** `#888888` (Secondary Text), `#EAEAEA` (Borders).
- **Success State:** `#0070F3` (Vercel Blue - used sparingly for active states).
- **Typography:** **Work Sans** (Variable weight).

---

## 📐 Design System

### 1. Typography Hierarchy
| Role | Weight | Size | Tracking |
| :--- | :--- | :--- | :--- |
| **Heading** | 700 (Bold) | 24px | -0.04em |
| **Subheading** | 500 (Medium) | 16px | -0.02em |
| **Label / Mono** | 400 (Regular) | 12px | +0.02em |
| **Meta Data** | 400 (Regular) | 10px | +0.05em |

### 2. UI Components (The "Vercel" Look)

#### A. The "Glass" Bottom Sheet
The main navigation should be a native iOS `UISheetPresentationController` but styled as a solid, stark container.
- **Background:** `#FFFFFF` (Light Mode) / `#000000` (Dark Mode).
- **Corner Radius:** `12px` (Apple Standard).
- **Border:** `1px solid #EAEAEA`.

#### B. Component List Items
- **Unselected:** Black text on White, `1px` bottom border.
- **Hover/Active:** Background shifts to `#FAFAFA`, left border becomes `2px solid #000000`.
- **Iconography:** Thin-stroke Lucide icons (0.5px weight).

#### C. "The Knobs" (Property Editors)
Each property control (Slider, Switch, Text Input) should look like a terminal input.
- **Input Box:** White background, Black `1px` border, No shadow.
- **Focus State:** Border becomes `1.5px`.
- **Labels:** All Caps, `Size 10`, `#888888`.

---

## 🏗️ Interface Layout

### View 1: The Component Explorer
A clean, searchable list of every `.stories.tsx` file detected.

```text
_________________________________________
| [Search Components...]          [X] | <-- 1px Border, No Shadow
|_______________________________________|
|                                       |
|  BUTTONS                              | <-- Mono Label, Grey
|  > PrimaryButton                      |
|  > GhostButton                        |
|                                       |
|  INPUTS                               |
|  > TextInput                          |
|  > SearchBar                          |
|_______________________________________|
```

### View 2: The Stage (The Simulator)
The component sits in the center of the screen on a subtle **Grid Background** (reminiscent of a blueprint).
- **Background:** White with light grey dot-grid (`#F0F0F0`).
- **Overlay:** A floating badge at the bottom: `PrimaryButton.tsx — 420x60px`.

### View 3: The Control Panel (Bottom Drawer)

```text
_________________________________________
| Props             Events       Docs   | <-- Tab bar, 1px Border
|_______________________________________|
|                                       |
|  LABEL (string)                       |
|  [ Submit                    ]        | <-- Flat Input
|                                       |
|  VARIANT (enum)                       |
|  ( ) Primary   ( ) Secondary  ( ) Link | <-- Custom Radio
|                                       |
|  DISABLED (boolean)                   |
|  [ Toggle ]                           |
|_______________________________________|
```

---

## ⚡ Interaction Physics
- **Transitions:** No bounces, no springs. Use a clean `ease-in-out` with a duration of `150ms`.
- **Haptics:** `selectionChanged` haptic feedback when scrolling through the component list.
- **Empty States:** Centered text in **Work Sans Light**, "No components found. Add a .stories file to get started."

---

## 🛠️ Implementation Note
To load the font via Google Fonts in React Native:

```bash
npx expo install expo-font @expo-google-fonts/work-sans
```

```javascript
import { WorkSans_400Regular, WorkSans_700Bold } from '@expo-google-fonts/work-sans';
```

---

> *"Design is not just what it looks like and feels like. Design is how it works." — Steve Jobs* (But we're making it look like Vercel anyway).
