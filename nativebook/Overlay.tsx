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

const OVERLAY_HEIGHT = SCREEN_HEIGHT * 0.88;
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

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: isOpen ? SCREEN_HEIGHT - OVERLAY_HEIGHT : SCREEN_HEIGHT,
        duration: 150,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: isOpen ? 1 : 0,
        duration: 150,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  }, [isOpen, opacity, translateY]);

  useEffect(() => {
    if (!selectedComponent) {
      setActiveTab('props');
    }
  }, [selectedComponent]);

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
          value={knobs.label || 'Submit'}
          onChangeText={(text) => updateKnob('label', text)}
          placeholder="Submit"
          placeholderTextColor="#888888"
          selectionColor="#000000"
          cursorColor="#000000"
        />
      </View>

      <View style={styles.knobRow}>
        <Text style={styles.knobLabel}>VARIANT (ENUM)</Text>
        <View style={styles.radioGroup}>
          {['primary', 'secondary', 'outline'].map((variant) => {
            const active = (knobs.variant || 'primary') === variant;
            return (
              <TouchableOpacity
                key={variant}
                style={styles.radioOption}
                onPress={() => updateKnob('variant', variant)}
              >
                <View style={[styles.radioOuter, active && styles.radioOuterActive]}>
                  {active ? <View style={styles.radioInner} /> : null}
                </View>
                <Text style={styles.radioLabel}>
                  {variant === 'outline' ? 'Link' : `${variant[0].toUpperCase()}${variant.slice(1)}`}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={styles.knobRow}>
        <Text style={styles.knobLabel}>DISABLED (BOOLEAN)</Text>
        <TouchableOpacity
          style={[styles.toggleButton, knobs.disabled && styles.toggleButtonActive]}
          onPress={() => updateKnob('disabled', !knobs.disabled)}
        >
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
            onPress={() => setSelectedComponent(null)}
          >
            <Text style={styles.sheetBackButtonText}>‹ Back to Explorer</Text>
          </TouchableOpacity>
        ) : null}

        <View style={styles.searchRow}>
          <View style={styles.searchContainer}>
            <TextInput
              placeholder="Search Components..."
              placeholderTextColor="#888888"
              style={styles.searchInput}
              value={query}
              onChangeText={setQuery}
              selectionColor="#000000"
              cursorColor="#000000"
            />
          </View>
          <TouchableOpacity onPress={() => setIsOpen(false)} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>X</Text>
          </TouchableOpacity>
        </View>

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
    </>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.12)',
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
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    zIndex: 1000,
    paddingHorizontal: 18,
    paddingBottom: 18,
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  handle: {
    width: 44,
    height: 3,
    backgroundColor: '#EAEAEA',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  sheetBackButton: {
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  sheetBackButtonText: {
    color: '#888888',
    fontSize: 12,
    letterSpacing: 0.24,
  },
  searchContainer: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    justifyContent: 'center',
    paddingHorizontal: 12,
    marginRight: 8,
  },
  searchInput: {
    color: '#000000',
    fontSize: 16,
    letterSpacing: -0.32,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    color: '#000000',
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 0.24,
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
    marginBottom: 20,
  },
  sectionLabel: {
    color: '#888888',
    fontSize: 12,
    fontWeight: '400',
    letterSpacing: 0.24,
    marginBottom: 6,
  },
  componentItem: {
    minHeight: 48,
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEA',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
  },
  componentItemPressed: {
    backgroundColor: '#FAFAFA',
  },
  itemRail: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: '#000000',
  },
  itemArrow: {
    color: '#000000',
    fontSize: 14,
    marginRight: 10,
  },
  itemText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: -0.32,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  emptyText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '300',
    letterSpacing: -0.32,
    marginBottom: 6,
  },
  emptySubText: {
    color: '#888888',
    fontSize: 12,
    letterSpacing: 0.24,
  },
  panel: {
    flex: 1,
    minHeight: 0,
  },
  panelHeader: {
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEA',
  },
  panelTitle: {
    color: '#000000',
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.96,
    marginBottom: 4,
  },
  panelMeta: {
    color: '#888888',
    fontSize: 10,
    letterSpacing: 0.5,
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEA',
  },
  tabButton: {
    flex: 1,
    minHeight: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: '#EAEAEA',
  },
  tabButtonActive: {
    backgroundColor: '#FAFAFA',
  },
  tabText: {
    color: '#888888',
    fontSize: 12,
    letterSpacing: 0.24,
  },
  tabTextActive: {
    color: '#000000',
  },
  panelBody: {
    paddingTop: 18,
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
    color: '#888888',
    fontSize: 10,
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  knobInput: {
    height: 46,
    borderWidth: 1,
    borderColor: '#000000',
    color: '#000000',
    paddingHorizontal: 12,
    fontSize: 16,
    letterSpacing: -0.32,
    backgroundColor: '#FFFFFF',
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
    borderColor: '#000000',
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterActive: {
    borderColor: '#5C5C5C',
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#5C5C5C',
  },
  radioLabel: {
    color: '#000000',
    fontSize: 12,
    letterSpacing: 0.24,
  },
  toggleButton: {
    height: 42,
    borderWidth: 1,
    borderColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  toggleButtonActive: {
    backgroundColor: '#F2F2F2',
    borderColor: '#888888',
  },
  toggleButtonText: {
    color: '#000000',
    fontSize: 12,
    letterSpacing: 0.24,
  },
  toggleButtonTextActive: {
    color: '#000000',
  },
  placeholderPanel: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingTop: 56,
  },
  placeholderTitle: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: -0.32,
    marginBottom: 8,
  },
  placeholderText: {
    color: '#888888',
    fontSize: 12,
    lineHeight: 18,
    letterSpacing: 0.24,
    textAlign: 'center',
  },
});
