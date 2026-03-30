import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNativeBookStore } from './store';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const OVERLAY_HEIGHT = SCREEN_HEIGHT * 0.80;
const TABS = ['props', 'events', 'docs'] as const;

type TabKey = (typeof TABS)[number];

const getSectionLabel = (name: string) => {
  const parts = name.trim().split(/\s+/);
  return (parts[parts.length - 1] || 'Components').toUpperCase();
};

export const NativeBookOverlay = () => {
  const {
    isOpen,
    setIsOpen,
    components,
    setSelectedComponent,
    selectedComponent,
    knobs,
    updateKnob,
  } = useNativeBookStore();
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<TabKey>('props');

  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const contentFade = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isOpen) {
      // Opening: spring for natural bounce
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: SCREEN_HEIGHT - OVERLAY_HEIGHT,
          useNativeDriver: true,
          damping: 28,
          stiffness: 220,
          mass: 0.9,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 280,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Closing: smooth ease-out
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: SCREEN_HEIGHT,
          useNativeDriver: true,
          damping: 26,
          stiffness: 200,
          mass: 0.85,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 220,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isOpen, opacity, translateY]);

  useEffect(() => {
    if (!selectedComponent) {
      setActiveTab('props');
    }
    // Animate content swap
    contentFade.setValue(0);
    Animated.timing(contentFade, {
      toValue: 1,
      duration: 250,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [selectedComponent, contentFade]);

  const componentNames = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return Object.keys(components).filter((item) =>
      item.toLowerCase().includes(normalizedQuery)
    );
  }, [components, query]);

  const groupedComponents = useMemo(() => {
    const sections = new Map<string, string[]>();

    componentNames.forEach((item) => {
      const label = getSectionLabel(item);
      const existing = sections.get(label) || [];
      existing.push(item);
      sections.set(label, existing);
    });

    return Array.from(sections.entries()).sort(([left], [right]) =>
      left.localeCompare(right)
    );
  }, [componentNames]);

  const renderComponentItem = ({ item }: { item: string }) => (
    <Pressable
      style={({ pressed }) => [
        styles.componentItem,
        pressed && styles.componentItemPressed,
      ]}
      onPress={() => setSelectedComponent(item)}
    >
      <View style={styles.itemRail} />
      <Text style={styles.itemArrow}>›</Text>
      <Text style={styles.itemText}>{item}</Text>
    </Pressable>
  );

  const renderPropsTab = () => (
    <View style={styles.panelBody}>
      <View style={styles.knobRow}>
        <Text style={styles.knobLabel}>LABEL (STRING)</Text>
        <TextInput
          style={styles.knobInput}
          value={knobs.label || ''}
          onChangeText={(text) => updateKnob('label', text)}
          placeholder="Enter label text"
          placeholderTextColor="#555555"
          selectionColor="#FFFFFF"
          cursorColor="#FFFFFF"
        />
      </View>

      <View style={styles.knobRow}>
        <Text style={styles.knobLabel}>PLACEHOLDER (STRING)</Text>
        <TextInput
          style={styles.knobInput}
          value={knobs.placeholder || ''}
          onChangeText={(text) => updateKnob('placeholder', text)}
          placeholder="Enter placeholder text"
          placeholderTextColor="#555555"
          selectionColor="#FFFFFF"
          cursorColor="#FFFFFF"
        />
      </View>

      <View style={styles.knobRow}>
        <Text style={styles.knobLabel}>DISABLED (BOOLEAN)</Text>
        <TouchableOpacity
          style={[styles.toggleButton, knobs.disabled && styles.toggleButtonActive]}
          onPress={() => updateKnob('disabled', !knobs.disabled)}
        >
          <View style={styles.toggleGlass} />
          <Text style={[styles.toggleButtonText, knobs.disabled && styles.toggleButtonTextActive]}>
            {knobs.disabled ? 'Enabled: Off' : 'Enabled: On'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderPlaceholder = (title: string, description: string) => (
    <View style={styles.placeholderPanel}>
      <Text style={styles.placeholderTitle}>{title}</Text>
      <Text style={styles.placeholderText}>{description}</Text>
    </View>
  );

  return (
    <>
      <Animated.View
        pointerEvents={isOpen ? 'auto' : 'none'}
        style={[styles.backdrop, { opacity }]}
      >
        <TouchableOpacity
          style={styles.backdropPressable}
          onPress={() => setIsOpen(false)}
        />
      </Animated.View>

      <Animated.View
        style={[
          styles.sheet,
          {
            transform: [{ translateY }],
          },
        ]}
      >
        <View style={styles.handleContainer}>
          <View style={styles.handle} />
        </View>

        {selectedComponent ? (
          <TouchableOpacity
            style={styles.sheetBackButton}
            onPress={() => {
              setSelectedComponent(null);
              setIsOpen(false);
            }}
          >
            <Text style={styles.sheetBackButtonText}>‹ Back to Storyboard</Text>
          </TouchableOpacity>
        ) : null}

        <View style={styles.searchRow}>
          <View style={styles.searchContainer}>
            <TextInput
              placeholder="Search Components..."
              placeholderTextColor="#555555"
              style={styles.searchInput}
              value={query}
              onChangeText={setQuery}
              selectionColor="#FFFFFF"
              cursorColor="#FFFFFF"
            />
          </View>
          <Pressable onPress={() => setIsOpen(false)} style={styles.closeButton}>
            <View style={styles.closeButtonGlass} />
            <Text style={styles.closeButtonText}>✕</Text>
          </Pressable>
        </View>

        <Animated.View style={[styles.animatedContent, { opacity: contentFade }]}>
          {!selectedComponent ? (
            <View style={styles.content}>
              <FlatList
                data={groupedComponents}
                keyExtractor={([section]) => section}
                style={styles.list}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => (
                  <View style={styles.section}>
                    <Text style={styles.sectionLabel}>{item[0]}</Text>
                    {item[1].map((componentName) => (
                      <View key={componentName}>
                        {renderComponentItem({ item: componentName })}
                      </View>
                    ))}
                  </View>
                )}
                ListEmptyComponent={
                  <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No components found.</Text>
                    <Text style={styles.emptySubText}>
                      Add a .stories file to get started.
                    </Text>
                  </View>
                }
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              />
            </View>
          ) : (
            <View style={styles.panel}>
              <ScrollView
                style={styles.panelScroll}
                contentContainerStyle={styles.panelScrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                <View style={styles.panelHeader}>
                  <Text style={styles.panelTitle}>{selectedComponent}</Text>
                  <Text style={styles.panelMeta}>ACTIVE STORY</Text>
                </View>

                <View style={styles.tabBar}>
                  {TABS.map((tab) => {
                    const active = activeTab === tab;
                    return (
                      <TouchableOpacity
                        key={tab}
                        style={[styles.tabButton, active && styles.tabButtonActive]}
                        onPress={() => setActiveTab(tab)}
                      >
                        <Text style={[styles.tabText, active && styles.tabTextActive]}>
                          {tab.toUpperCase()}
                        </Text>
                        {active && <View style={styles.tabActiveIndicator} />}
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {activeTab === 'props'
                  ? renderPropsTab()
                  : activeTab === 'events'
                    ? renderPlaceholder(
                        'No Events Wired',
                        'Event logging can surface press, focus, and change callbacks here.'
                      )
                    : renderPlaceholder(
                        'Docs Pending',
                        'Docgen output can populate prop descriptions and usage notes in this tab.'
                      )}
              </ScrollView>
            </View>
          )}
        </Animated.View>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    zIndex: 999,
  },
  backdropPressable: {
    flex: 1,
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: OVERLAY_HEIGHT,
    backgroundColor: '#0A0A0A',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderBottomWidth: 0,
    zIndex: 1000,
    paddingHorizontal: 18,
    paddingBottom: 18,
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  handle: {
    width: 44,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  sheetBackButton: {
    alignSelf: 'flex-start',
    marginBottom: 10,
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  sheetBackButtonText: {
    color: '#888888',
    fontSize: 13,
    letterSpacing: 0.2,
  },
  searchContainer: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    justifyContent: 'center',
    paddingHorizontal: 14,
    marginRight: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
  },
  searchInput: {
    color: '#FFFFFF',
    fontSize: 15,
    letterSpacing: -0.3,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonGlass: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  closeButtonText: {
    color: '#AAAAAA',
    fontSize: 14,
    fontWeight: '500',
  },
  animatedContent: {
    flex: 1,
    minHeight: 0,
  },
  content: {
    flex: 1,
    minHeight: 0,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 32,
  },
  section: {
    marginBottom: 22,
  },
  sectionLabel: {
    color: '#666666',
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 1,
    marginBottom: 8,
  },
  componentItem: {
    minHeight: 48,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    backgroundColor: 'transparent',
  },
  componentItemPressed: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
  },
  itemRail: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: '#FFFFFF',
    opacity: 0.25,
  },
  itemArrow: {
    color: '#888888',
    fontSize: 16,
    marginRight: 10,
  },
  itemText: {
    color: '#EEEEEE',
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: -0.3,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  emptyText: {
    color: '#AAAAAA',
    fontSize: 16,
    fontWeight: '300',
    letterSpacing: -0.3,
    marginBottom: 8,
  },
  emptySubText: {
    color: '#555555',
    fontSize: 12,
    letterSpacing: 0.3,
  },
  panel: {
    flex: 1,
    minHeight: 0,
  },
  panelHeader: {
    paddingBottom: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  panelTitle: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: -1,
    marginBottom: 4,
  },
  panelMeta: {
    color: '#555555',
    fontSize: 10,
    letterSpacing: 1.5,
    fontWeight: '500',
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
  },
  tabButton: {
    flex: 1,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  tabButtonActive: {
    // active state handled by indicator below
  },
  tabText: {
    color: '#555555',
    fontSize: 12,
    letterSpacing: 0.5,
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  tabActiveIndicator: {
    position: 'absolute',
    bottom: 0,
    left: '20%',
    right: '20%',
    height: 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 1,
  },
  panelBody: {
    paddingTop: 20,
  },
  panelScroll: {
    flex: 1,
  },
  panelScrollContent: {
    paddingBottom: 28,
  },
  knobRow: {
    marginBottom: 22,
  },
  knobLabel: {
    color: '#666666',
    fontSize: 10,
    letterSpacing: 1,
    fontWeight: '500',
    marginBottom: 8,
  },
  knobInput: {
    height: 46,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 8,
    color: '#FFFFFF',
    paddingHorizontal: 14,
    fontSize: 15,
    letterSpacing: -0.3,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
  },
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    rowGap: 12,
  },
  radioOption: {
    width: '33%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterActive: {
    borderColor: '#FFFFFF',
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  radioLabel: {
    color: '#CCCCCC',
    fontSize: 12,
    letterSpacing: 0.2,
  },
  toggleButton: {
    height: 44,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  toggleGlass: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
  },
  toggleButtonActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  toggleButtonText: {
    color: '#AAAAAA',
    fontSize: 12,
    letterSpacing: 0.3,
    fontWeight: '500',
  },
  toggleButtonTextActive: {
    color: '#FFFFFF',
  },
  placeholderPanel: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingTop: 56,
  },
  placeholderTitle: {
    color: '#CCCCCC',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: -0.3,
    marginBottom: 10,
  },
  placeholderText: {
    color: '#555555',
    fontSize: 13,
    lineHeight: 20,
    letterSpacing: 0.1,
    textAlign: 'center',
  },
});
