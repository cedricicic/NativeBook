import { create } from 'zustand';

export interface KnobDefinition {
  type: 'text' | 'boolean' | 'select';
  label: string;
  defaultValue: any;
  options?: string[]; // for 'select' type
}

interface ComponentRegistration {
  component: React.ComponentType<any>;
  knobDefs?: Record<string, KnobDefinition>;
}

interface NativeBookStore {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  selectedComponent: string | null;
  setSelectedComponent: (component: string | null) => void;
  knobs: Record<string, any>;
  updateKnob: (key: string, value: any) => void;
  components: Record<string, ComponentRegistration>;
  registerComponent: (name: string, registration: ComponentRegistration) => void;
}

export const useNativeBookStore = create<NativeBookStore>((set) => ({
  isOpen: false,
  setIsOpen: (isOpen) => set({ isOpen }),
  selectedComponent: null,
  setSelectedComponent: (component) => {
    // When selecting a component, initialize knobs from its definitions
    set((state) => {
      const registration = component ? state.components[component] : null;
      const initialKnobs: Record<string, any> = {};
      if (registration?.knobDefs) {
        Object.entries(registration.knobDefs).forEach(([key, def]) => {
          initialKnobs[key] = def.defaultValue;
        });
      }
      return { selectedComponent: component, knobs: initialKnobs };
    });
  },
  knobs: {},
  updateKnob: (key, value) => 
    set((state) => ({ knobs: { ...state.knobs, [key]: value } })),
  components: {},
  registerComponent: (name, registration) => 
    set((state) => ({ components: { ...state.components, [name]: registration } })),
}));
