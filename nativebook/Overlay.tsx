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
import { useNativeBookStore, KnobDefinition } from './store';

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

  // Get the knob definitions for the selected component
  const knobDefs = useMemo(() => {
    if (!selectedComponent) return null;
    const registration = components[selectedComponent];
    return registration?.knobDefs || null;
  }, [selectedComponent, components]);

  useEffect(() => {
    if (isOpen) {
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
      onPress={() => {
        setSelectedComponent(item);
        setIsOpen(false);
      }}
    >
      <View style={styles.itemRail} />
      <Text style={styles.itemArrow}>›</Text>
      <Text style={styles.itemText}>{item}</Text>
    </Pressable>
  );

  // ─── Dynamic Knob Renderers ───

  const renderTextKnob = (key: string, def: KnobDefinition) => (
    <View style={styles.knobRow} key={key}>
      <Text style={styles.knobLabel}>
        {def.label.toUpperCase()} <Text style={styles.knobType}>STRING</Text>
      </Text>
      <TextInput
        style={styles.knobInput}
        value={knobs[key]?.toString() || ''}
        onChangeText={(text) => updateKnob(key, text)}
        placeholder={`Enter ${def.label.toLowerCase()}`}
        placeholderTextColor="#444444"
        selectionColor="#FFFFFF"
        cursorColor="#FFFFFF"
      />
    </View>
  );

  const renderBooleanKnob = (key: string, def: KnobDefinition) => (
    <View style={styles.knobRow} key={key}>
      <Text style={styles.knobLabel}>
        {def.label.toUpperCase()} <Text style={styles.knobType}>BOOLEAN</Text>
      </Text>
      <TouchableOpacity
        style={[styles.toggleButton, knobs[key] && styles.toggleButtonActive]}
        onPress={() => updateKnob(key, !knobs[key])}
      >
        <View style={styles.toggleGlass} />
        <View style={styles.toggleRow}>
          <View style={[styles.toggleDot, knobs[key] && styles.toggleDotActive]} />
          <Text style={[styles.toggleButtonText, knobs[key] && styles.toggleButtonTextActive]}>
            {knobs[key] ? 'true' : 'false'}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  const renderSelectKnob = (key: string, def: KnobDefinition) => {
    const options = def.options || [];
    return (
      <View style={styles.knobRow} key={key}>
        <Text style={styles.knobLabel}>
          {def.label.toUpperCase()} <Text style={styles.knobType}>ENUM</Text>
        </Text>
        <View style={styles.selectGroup}>
          {options.map((option) => {
            const isActive = knobs[key] === option;
            return (
              <Pressable
                key={option}
                style={[styles.selectOption, isActive && styles.selectOptionActive]}
                onPress={() => updateKnob(key, option)}
              >
                <View style={styles.selectOptionGlass} />
                <Text style={[styles.selectOptionText, isActive && styles.selectOptionTextActive]}>
                  {option}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    );
  };

  const renderKnobControl = (key: string, def: KnobDefinition) => {
    switch (def.type) {
      case 'text':
        return renderTextKnob(key, def);
      case 'boolean':
        return renderBooleanKnob(key, def);
      case 'select':
        return renderSelectKnob(key, def);
      default:
        return null;
    }
  };

  const renderPropsTab = () => {
    if (!knobDefs || Object.keys(knobDefs).length === 0) {
      return (
        <View style={styles.placeholderPanel}>
          <Text style={styles.placeholderTitle}>No Props Defined</Text>
          <Text style={styles.placeholderText}>
            Register knob definitions in your story to enable interactive controls.
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.panelBody}>
        {Object.entries(knobDefs).map(([key, def]) =>
          renderKnobControl(key, def)
        )}
      </View>
    );
  };

  const renderEventsTab = () => {
    return (
      <View style={styles.eventsPanel}>
        <View style={styles.eventItem}>
          <View style={styles.eventDot} />
          <View style={styles.eventContent}>
            <Text style={styles.eventName}>onPress</Text>
            <Text style={styles.eventTime}>callback registered</Text>
          </View>
          <View style={styles.eventBadge}>
            <Text style={styles.eventBadgeText}>0 calls</Text>
          </View>
        </View>
        <View style={styles.eventItem}>
          <View style={[styles.eventDot, styles.eventDotInactive]} />
          <View style={styles.eventContent}>
            <Text style={[styles.eventName, styles.eventNameInactive]}>onLongPress</Text>
            <Text style={styles.eventTime}>not wired</Text>
          </View>
        </View>
        <View style={styles.eventsHint}>
          <Text style={styles.eventsHintText}>
            Events are logged here as they fire. Interact with the component above to see callbacks in real time.
          </Text>
        </View>
      </View>
    );
  };

  const renderDocsTab = () => (
    <View style={styles.docsPanel}>
      <View style={styles.docBlock}>
        <Text style={styles.docBlockTitle}>Component</Text>
        <View style={styles.docCodeBlock}>
          <Text style={styles.docCode}>
            {'<'}{selectedComponent?.split(' ').pop() || 'Component'}{' '}
            {knobDefs && Object.entries(knobDefs).map(([key, def]) => {
              const val = knobs[key];
              if (def.type === 'boolean') return val ? `${key} ` : '';
              if (def.type === 'text') return `${key}="${val}" `;
              return `${key}="${val}" `;
            }).join('')}
            {'/>'}
          </Text>
        </View>
      </View>
      <View style={styles.docBlock}>
        <Text style={styles.docBlockTitle}>Props Interface</Text>
        {knobDefs && Object.entries(knobDefs).map(([key, def]) => (
          <View key={key} style={styles.docPropRow}>
            <Text style={styles.docPropName}>{key}</Text>
            <Text style={styles.docPropType}>
              {def.type === 'select' ? def.options?.map(o => `'${o}'`).join(' | ') : def.type === 'boolean' ? 'boolean' : 'string'}
            </Text>
            <Text style={styles.docPropDefault}>= {JSON.stringify(def.defaultValue)}</Text>
          </View>
        ))}
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
{/* 
        {selectedComponent ? (
          <TouchableOpacity
            style={styles.sheetBackButton}
            onPress={() => {
              setSelectedComponent(null);
              setIsOpen(false);
            }}
          >
            <Text style={styles.sheetBackButtonText}>‹ Back</Text>
          </TouchableOpacity>
        ) : null} */}

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
                    ? renderEventsTab()
                    : renderDocsTab()}
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
  tabButtonActive: {},
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
    color: '#888888',
    fontSize: 10,
    letterSpacing: 1,
    fontWeight: '600',
    marginBottom: 8,
  },
  knobType: {
    color: '#444444',
    fontWeight: '400',
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

  // ─── Select Knob ───
  selectGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  selectOption: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
    position: 'relative',
  },
  selectOptionActive: {
    borderColor: 'rgba(255, 255, 255, 0.35)',
  },
  selectOptionGlass: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  selectOptionText: {
    color: '#777777',
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: -0.2,
  },
  selectOptionTextActive: {
    color: '#FFFFFF',
  },

  // ─── Toggle Knob ───
  toggleButton: {
    height: 44,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
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
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  toggleButtonActive: {
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  toggleDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#333333',
    borderWidth: 1,
    borderColor: '#555555',
  },
  toggleDotActive: {
    backgroundColor: '#16a34a',
    borderColor: '#22c55e',
  },
  toggleButtonText: {
    color: '#777777',
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: -0.2,
  },
  toggleButtonTextActive: {
    color: '#FFFFFF',
  },

  // ─── Events Tab ───
  eventsPanel: {
    paddingTop: 16,
  },
  eventItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
  },
  eventDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#16a34a',
    marginRight: 12,
  },
  eventDotInactive: {
    backgroundColor: '#333333',
  },
  eventContent: {
    flex: 1,
  },
  eventName: {
    color: '#EEEEEE',
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: -0.2,
  },
  eventNameInactive: {
    color: '#555555',
  },
  eventTime: {
    color: '#555555',
    fontSize: 11,
    letterSpacing: 0.2,
    marginTop: 2,
  },
  eventBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
  },
  eventBadgeText: {
    color: '#888888',
    fontSize: 11,
    fontWeight: '500',
  },
  eventsHint: {
    paddingTop: 20,
    paddingHorizontal: 4,
  },
  eventsHintText: {
    color: '#444444',
    fontSize: 12,
    lineHeight: 18,
    letterSpacing: 0.1,
  },

  // ─── Docs Tab ───
  docsPanel: {
    paddingTop: 16,
  },
  docBlock: {
    marginBottom: 24,
  },
  docBlockTitle: {
    color: '#888888',
    fontSize: 10,
    letterSpacing: 1,
    fontWeight: '600',
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  docCodeBlock: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 8,
    padding: 14,
  },
  docCode: {
    color: '#CCCCCC',
    fontSize: 13,
    fontFamily: 'Courier',
    lineHeight: 20,
  },
  docPropRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
    gap: 8,
  },
  docPropName: {
    color: '#EEEEEE',
    fontSize: 13,
    fontWeight: '600',
    fontFamily: 'Courier',
  },
  docPropType: {
    color: '#888888',
    fontSize: 12,
    fontFamily: 'Courier',
    flex: 1,
  },
  docPropDefault: {
    color: '#555555',
    fontSize: 12,
    fontFamily: 'Courier',
  },

  // ─── Placeholder ───
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
