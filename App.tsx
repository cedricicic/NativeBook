import React, { useRef, useCallback, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  StatusBar,
  Image,
  Pressable,
  Animated,
  Dimensions,
  ScrollView,
} from 'react-native';
import { NativeBookProvider } from './nativebook';
import DemoScreen from './DemoScreen';
import './src/stories';

const logoImg = require('./src/assets/logo.png');
const { width: SCREEN_WIDTH } = Dimensions.get('window');

const STEPS = [
  {
    number: '01',
    title: 'Tap the logo',
    description:
      'A floating NativeBook logo lives on every screen. Tap it to open the component explorer, your gateway to every registered story.',
    visual: 'NB',
    visualType: 'button' as const,
  },
  {
    number: '02',
    title: 'Choose a component',
    description:
      'Browse or search through all registered components. Each one is a self contained story ready to be isolated and tested.',
    visual: '☰',
    visualType: 'list' as const,
  },
  {
    number: '03',
    title: 'Isolate & inspect',
    description:
      'The component renders in a clean, isolated environment. No distractions, just the component, pixel perfect on its own stage.',
    visual: '◎',
    visualType: 'frame' as const,
  },
  {
    number: '04',
    title: 'Test every state',
    description:
      'Use the props panel to toggle variants, change labels, enable/disable states. See how your component behaves across every configuration in real time.',
    visual: '⚙',
    visualType: 'knobs' as const,
  },
];

function AppContent() {
  const slideAnim = useRef(new Animated.Value(0)).current;
  const [showTutorial, setShowTutorial] = React.useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const [currentStep, setCurrentStep] = React.useState(0);
  const stepAnim = useRef(new Animated.Value(1)).current;

  const openTutorial = useCallback(() => {
    setShowTutorial(true);
    setCurrentStep(0);
    stepAnim.setValue(1);
    Animated.spring(slideAnim, {
      toValue: 1,
      useNativeDriver: true,
      damping: 22,
      stiffness: 200,
    }).start();
  }, [slideAnim, stepAnim]);

  const closeTutorial = useCallback(() => {
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      damping: 22,
      stiffness: 200,
    }).start(() => {
      setShowTutorial(false);
      setCurrentStep(0);
    });
  }, [slideAnim]);

  const goToStep = useCallback(
    (step: number) => {
      Animated.timing(stepAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start(() => {
        setCurrentStep(step);
        Animated.spring(stepAnim, {
          toValue: 1,
          useNativeDriver: true,
          damping: 20,
          stiffness: 300,
        }).start();
      });
    },
    [stepAnim],
  );

  const nextStep = useCallback(() => {
    if (currentStep < STEPS.length - 1) {
      goToStep(currentStep + 1);
    } else {
      // "Done" — transition to the demo sign-in screen
      setShowDemo(true);
    }
  }, [currentStep, goToStep]);

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      goToStep(currentStep - 1);
    }
  }, [currentStep, goToStep]);

  const landingTranslateX = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -SCREEN_WIDTH * 0.3],
  });

  const tutorialTranslateX = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [SCREEN_WIDTH, 0],
  });

  const step = STEPS[currentStep];

  const stepContentTranslateY = stepAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [20, 0],
  });

  if (showDemo) {
    return <DemoScreen />;
  }

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      {/* ─── Landing Page ─── */}
      <Animated.View
        style={[
          styles.page,
          { transform: [{ translateX: landingTranslateX }] },
        ]}
      >
        <View style={styles.container}>
          <View style={styles.gridOverlay}>
            <View style={styles.gridLineV1} />
            <View style={styles.gridLineV2} />
            <View style={styles.gridLineH1} />
            <View style={styles.gridLineH2} />
          </View>

          <View style={styles.logoArea}>
            <Image
              source={logoImg}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>

          <View style={styles.bottomContent}>
            <Text style={styles.eyebrow}>COMPONENT DEVELOPMENT KIT</Text>
            <Text style={styles.title}>NativeBook</Text>
            <View style={styles.titleRule} />
            <Text style={styles.subtitle}>
              High-contrast component staging, rapid prop iteration, and a
              bottom-drawer explorer built for native iOS workflows.
            </Text>
          </View>

          <Pressable style={styles.chevronButton} onPress={openTutorial}>
            <View style={styles.chevronGlass} />
            <Text style={styles.chevronIcon}>›</Text>
          </Pressable>
        </View>
      </Animated.View>

      {/* ─── Tutorial Page ─── */}
      {showTutorial && (
        <Animated.View
          style={[
            styles.page,
            styles.tutorialPage,
            { transform: [{ translateX: tutorialTranslateX }] },
          ]}
        >
          {/* Header */}
          <View style={styles.tutorialHeader}>
            <Pressable style={styles.backButton} onPress={closeTutorial}>
              <View style={styles.chevronGlass} />
              <Text style={styles.backIcon}>‹</Text>
            </Pressable>
            <Text style={styles.tutorialHeaderTitle}>How it works</Text>
            <View style={{ width: 44 }} />
          </View>

          <ScrollView
            style={styles.tutorialScroll}
            contentContainerStyle={styles.tutorialScrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Visual area */}
            <Animated.View
              style={[
                styles.visualArea,
                {
                  opacity: stepAnim,
                  transform: [{ translateY: stepContentTranslateY }],
                },
              ]}
            >
              <View style={styles.visualContainer}>
                {step.visualType === 'button' && (
                  <View style={styles.mockScreen}>
                    <View style={styles.mockContent}>
                      <View style={styles.mockLine} />
                      <View style={[styles.mockLine, { width: '60%' }]} />
                      <View style={[styles.mockLine, { width: '80%' }]} />
                    </View>
                    <View style={styles.mockLogoButton}>
                      <Image
                        source={logoImg}
                        style={styles.mockLogoImage}
                        resizeMode="contain"
                      />
                    </View>
                  </View>
                )}
                {step.visualType === 'list' && (
                  <View style={styles.mockScreen}>
                    <View style={styles.mockSearchBar}>
                      <Text style={styles.mockSearchText}>Search...</Text>
                    </View>
                    {['PrimaryButton', 'Card', 'Avatar'].map((name, i) => (
                      <View key={name} style={styles.mockListItem}>
                        <View
                          style={[
                            styles.mockListRail,
                            i === 0 && { backgroundColor: '#FFFFFF' },
                          ]}
                        />
                        <Text
                          style={[
                            styles.mockListText,
                            i === 0 && { color: '#FFFFFF' },
                          ]}
                        >
                          {name}
                        </Text>
                        <Text style={styles.mockListChevron}>›</Text>
                      </View>
                    ))}
                  </View>
                )}
                {step.visualType === 'frame' && (
                  <View style={styles.mockScreen}>
                    <View style={styles.mockIsolated}>
                      <View style={styles.mockComponent}>
                        <Text style={styles.mockComponentText}>Submit</Text>
                      </View>
                    </View>
                    <Text style={styles.mockIsolatedLabel}>
                      PrimaryButton.tsx — 200×48px
                    </Text>
                  </View>
                )}
                {step.visualType === 'knobs' && (
                  <View style={styles.mockScreen}>
                    <View style={styles.mockKnobRow}>
                      <Text style={styles.mockKnobLabel}>LABEL</Text>
                      <View style={styles.mockKnobInput}>
                        <Text style={styles.mockKnobInputText}>Submit</Text>
                      </View>
                    </View>
                    <View style={styles.mockKnobRow}>
                      <Text style={styles.mockKnobLabel}>VARIANT</Text>
                      <View style={styles.mockRadioRow}>
                        <View style={styles.mockRadioActive} />
                        <View style={styles.mockRadio} />
                        <View style={styles.mockRadio} />
                      </View>
                    </View>
                    <View style={styles.mockKnobRow}>
                      <Text style={styles.mockKnobLabel}>DISABLED</Text>
                      <View style={styles.mockToggle}>
                        <Text style={styles.mockToggleText}>ON</Text>
                      </View>
                    </View>
                  </View>
                )}
              </View>
            </Animated.View>

            {/* Step content */}
            <Animated.View
              style={[
                styles.stepContent,
                {
                  opacity: stepAnim,
                  transform: [{ translateY: stepContentTranslateY }],
                },
              ]}
            >
          
              <Text style={styles.stepTitle}>{step.title}</Text>
              <Text style={styles.stepDescription}>{step.description}</Text>

              {/* Step indicator */}
              <View style={styles.stepIndicator}>
                {STEPS.map((_, i) => (
                  <Pressable
                    key={i}
                    onPress={() => goToStep(i)}
                    style={styles.dotPressable}
                  >
                    <View
                      style={[
                        styles.stepDot,
                        i === currentStep && styles.stepDotActive,
                        i < currentStep && styles.stepDotCompleted,
                      ]}
                    />
                  </Pressable>
                ))}
              </View>
            </Animated.View>
          </ScrollView>

          {/* Navigation */}
          <View style={styles.navBar}>
            {currentStep > 0 ? (
              <Pressable style={styles.navButton} onPress={prevStep}>
                <Text style={styles.navButtonText}>Back</Text>
              </Pressable>
            ) : (
              <View style={styles.navButton} />
            )}



            <Pressable style={styles.navButtonPrimary} onPress={nextStep}>
              <View style={styles.navButtonPrimaryGlass} />
              <Text style={styles.navButtonPrimaryText}>
                {currentStep === STEPS.length - 1 ? 'Done' : 'Next'}
              </Text>
            </Pressable>
          </View>
        </Animated.View>
      )}
    </View>
  );
}

function App() {
  return (
    <NativeBookProvider showTrigger={false}>
      <AppContent />
    </NativeBookProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  page: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },

  // Grid
  gridOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  gridLineV1: {
    position: 'absolute',
    left: 28,
    top: 0,
    bottom: 0,
    width: StyleSheet.hairlineWidth,
    backgroundColor: '#1A1A1A',
  },
  gridLineV2: {
    position: 'absolute',
    right: 28,
    top: 0,
    bottom: 0,
    width: StyleSheet.hairlineWidth,
    backgroundColor: '#1A1A1A',
  },
  gridLineH1: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 60,
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#1A1A1A',
  },
  gridLineH2: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 36,
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#1A1A1A',
  },

  // Logo
  logoArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
  },
  logoImage: {
    width: 400,
    height: 400,
    tintColor: '#FFFFFF',
    opacity: 0.9,
  },

  // Bottom content
  bottomContent: {
    paddingHorizontal: 28,
    paddingBottom: 60,
  },
  eyebrow: {
    color: '#aeaeaeff',
    fontSize: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 48,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -2,
    marginBottom: 12,
  },
  titleRule: {
    width: 48,
    height: 3,
    backgroundColor: '#333333',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 15,
    color: '#aeaeaeff',
    lineHeight: 22,
    letterSpacing: -0.2,
  },

  // Chevron
  chevronButton: {
    position: 'absolute',
    top: 64,
    right: 28,
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chevronGlass: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  chevronIcon: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '300',
    marginLeft: 2,
    marginBottom: 4,
  },

  // ─── Tutorial Page ───
  tutorialPage: {
    backgroundColor: '#0A0A0A',
  },
  tutorialHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 28,
    paddingTop: 64,
    marginBottom: 12,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '300',
    marginRight: 2,
    marginBottom: 4,
  },
  tutorialHeaderTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  tutorialScroll: {
    flex: 1,
  },
  tutorialScrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: 20,
  },

  // Step indicator dots
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    marginTop: 24,
  },
  dotPressable: {
    padding: 6,
  },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2A2A2A',
  },
  stepDotActive: {
    backgroundColor: '#FFFFFF',
    width: 24,
    borderRadius: 4,
  },
  stepDotCompleted: {
    backgroundColor: '#555555',
  },

  // Visual mock area
  visualArea: {
    paddingHorizontal: 28,
    marginBottom: 32,
  },
  visualContainer: {
    height: 280,
    borderWidth: 1,
    borderColor: '#1E1E1E',
    borderRadius: 16,
    backgroundColor: '#111111',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Mock screen shared
  mockScreen: {
    width: '80%',
    height: '80%',
    borderRadius: 10,
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#2A2A2A',
    padding: 16,
    overflow: 'hidden',
  },

  // Step 1 - NB button mock
  mockContent: {
    gap: 8,
    marginBottom: 20,
  },
  mockLine: {
    height: 6,
    backgroundColor: '#2A2A2A',
    borderRadius: 3,
    width: '100%',
  },
  mockLogoButton: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mockLogoImage: {
    width: 32,
    height: 38,
    tintColor: '#FFFFFF',
    opacity: 0.9,
  },

  // Step 2 - list mock
  mockSearchBar: {
    height: 28,
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 6,
    justifyContent: 'center',
    paddingHorizontal: 10,
    marginBottom: 12,
  },
  mockSearchText: {
    color: '#444444',
    fontSize: 10,
  },
  mockListItem: {
    height: 32,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#2A2A2A',
    paddingHorizontal: 10,
  },
  mockListRail: {
    width: 2,
    height: 16,
    backgroundColor: '#444444',
    borderRadius: 1,
    marginRight: 10,
  },
  mockListText: {
    flex: 1,
    color: '#888888',
    fontSize: 11,
    fontWeight: '500',
  },
  mockListChevron: {
    color: '#444444',
    fontSize: 14,
  },

  // Step 3 - isolated mock
  mockIsolated: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mockComponent: {
    paddingHorizontal: 28,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
  },
  mockComponentText: {
    color: '#000000',
    fontSize: 12,
    fontWeight: '600',
  },
  mockIsolatedLabel: {
    color: '#444444',
    fontSize: 8,
    textAlign: 'center',
    letterSpacing: 0.5,
  },

  // Step 4 - knobs mock
  mockKnobRow: {
    marginBottom: 12,
  },
  mockKnobLabel: {
    color: '#555555',
    fontSize: 8,
    letterSpacing: 1,
    marginBottom: 4,
  },
  mockKnobInput: {
    height: 24,
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 4,
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  mockKnobInputText: {
    color: '#AAAAAA',
    fontSize: 10,
  },
  mockRadioRow: {
    flexDirection: 'row',
    gap: 10,
  },
  mockRadioActive: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    backgroundColor: '#FFFFFF',
  },
  mockRadio: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: '#444444',
  },
  mockToggle: {
    width: 48,
    height: 22,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mockToggleText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 1,
  },

  // Step text content
  stepContent: {
    paddingHorizontal: 28,
  },
  stepNumber: {
    color: '#444444',
    fontSize: 12,
    fontFamily: 'Courier',
    letterSpacing: 2,
    marginBottom: 8,
  },
  stepTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -1,
    marginBottom: 12,
  },
  stepDescription: {
    color: '#888888',
    fontSize: 15,
    lineHeight: 24,
    letterSpacing: -0.2,
  },

  // Bottom nav
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 28,
    paddingBottom: 44,
    paddingTop: 16,
  },
  navButton: {
    width: 72,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButtonText: {
    color: '#888888',
    fontSize: 15,
    fontWeight: '500',
  },
  navProgress: {
    color: '#444444',
    fontSize: 12,
    fontFamily: 'Courier',
    letterSpacing: 1,
  },
  navButtonPrimary: {
    width: 72,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButtonPrimaryGlass: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  navButtonPrimaryText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});

export default App;
