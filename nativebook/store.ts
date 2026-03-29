import { create } from 'zustand';

interface NativeBookStore {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  selectedComponent: string | null;
  setSelectedComponent: (component: string | null) => void;
  knobs: Record<string, any>;
  updateKnob: (key: string, value: any) => void;
  components: Record<string, any>;
  registerComponent: (name: string, component: any) => void;
}

export const useNativeBookStore = create<NativeBookStore>((set) => ({
  isOpen: false,
  setIsOpen: (isOpen) => set({ isOpen }),
  selectedComponent: null,
  setSelectedComponent: (component) => set({ selectedComponent: component, knobs: {} }),
  knobs: {},
  updateKnob: (key, value) => 
    set((state) => ({ knobs: { ...state.knobs, [key]: value } })),
  components: {},
  registerComponent: (name, component) => 
    set((state) => ({ components: { ...state.components, [name]: component } })),
}));
