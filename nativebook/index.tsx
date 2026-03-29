import React, { useMemo, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  LayoutChangeEvent,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useNativeBookStore } from './store';
import { NativeBookOverlay } from './Overlay';

interface NativeBookProviderProps {
  children: React.ReactNode;
  showTrigger?: boolean;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GRID_COLUMNS = 14;
const GRID_ROWS = 24;

export const NativeBookProvider: React.FC<NativeBookProviderProps> = ({ children, showTrigger = true }) => {
  const { isOpen, setIsOpen, selectedComponent, components, knobs } = useNativeBookStore();
  const [previewSize, setPreviewSize] = useState({ width: 0, height: 0 });

  const pan = useRef(new Animated.ValueXY({ x: 20, y: 100 })).current;
  const dragStart = useRef({ x: 20, y: 100 });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) =>
        Math.abs(gestureState.dx) > 2 || Math.abs(gestureState.dy) > 2,
      onPanResponderGrant: () => {
        pan.stopAnimation((value: { x: number; y: number }) => {
          dragStart.current = value;
        });
      },
      onPanResponderMove: (_, gestureState) => {
        pan.setValue({
          x: dragStart.current.x + gestureState.dx,
          y: dragStart.current.y + gestureState.dy,
        });
      },
      onPanResponderRelease: (_, gestureState) => {
        const dragged =
          Math.abs(gestureState.dx) > 6 || Math.abs(gestureState.dy) > 6;

        if (!dragged) {
          setIsOpen(true);
        }
      },
      onPanResponderTerminate: () => {
        pan.stopAnimation((value: { x: number; y: number }) => {
          dragStart.current = value;
        });
      },
    })
  ).current;

  const PreviewComponent = useMemo(() => {
    if (!selectedComponent) return null;
    const item = components[selectedComponent];
    if (!item) return null;
    
    const Component = item.component;
    // Spread knobs to the component
    return <Component {...knobs} />;
  }, [selectedComponent, components, knobs]);

  const onPreviewLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setPreviewSize({
      width: Math.round(width),
      height: Math.round(height),
    });
  };

  return (
    <View style={styles.flex}>
      <View style={styles.flex}>
        {selectedComponent ? (
          <View style={styles.previewContainer}>
            <View style={styles.gridBackground} pointerEvents="none">
              {Array.from({ length: GRID_ROWS }).map((_, rowIndex) => (
                <View key={`row-${rowIndex}`} style={styles.gridRow}>
                  {Array.from({ length: GRID_COLUMNS }).map((__, columnIndex) => (
                    <View
                      key={`dot-${rowIndex}-${columnIndex}`}
                      style={styles.gridDot}
                    />
                  ))}
                </View>
              ))}
            </View>
            <View style={styles.previewFrame} onLayout={onPreviewLayout}>
              {PreviewComponent}
            </View>
            <View style={styles.previewLabel}>
              <Text style={styles.previewLabelText}>
                {selectedComponent}.tsx — {previewSize.width || Math.round(SCREEN_WIDTH * 0.72)}x
                {previewSize.height || 60}px
              </Text>
            </View>
          </View>
        ) : (
          children
        )}

        {/* Floating Trigger Button */}
        {showTrigger && !isOpen && (
          <Animated.View
            style={[styles.trigger, { transform: pan.getTranslateTransform() }]}
            {...panResponder.panHandlers}
          >
            <Pressable style={styles.triggerInner} onPress={() => setIsOpen(true)}>
              <Text style={styles.triggerGlyph}>NB</Text>
            </Pressable>
          </Animated.View>
        )}

        <NativeBookOverlay />
      </View>
    </View>
  );
};

export const register = (name: string, component: any) => {
  const { registerComponent } = useNativeBookStore.getState();
  registerComponent(name, { component });
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  trigger: {
    position: 'absolute',
    top: 36,
    left: 16,
    zIndex: 1001,
  },
  triggerInner: {
    minWidth: 52,
    height: 36,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EAEAEA',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  triggerGlyph: {
    color: '#000000',
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 0.24,
  },
  previewContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  gridBackground: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-evenly',
    paddingVertical: 20,
    paddingHorizontal: 12,
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  gridDot: {
    width: 2,
    height: 2,
    borderRadius: 1,
    backgroundColor: '#F0F0F0',
  },
  previewFrame: {
    minWidth: '76%',
    minHeight: 120,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 28,
  },
  previewLabel: {
    position: 'absolute',
    bottom: 24,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EAEAEA',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  previewLabelText: {
    color: '#888888',
    fontSize: 10,
    letterSpacing: 0.5,
  }
});
