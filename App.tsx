import React from 'react';
import { StyleSheet, View, Text, StatusBar } from 'react-native';
import { NativeBookProvider } from './nativebook';
import './src/stories'; // Register all stories

function App() {
  return (
    <NativeBookProvider>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        <View style={styles.hero}>

          <Text style={styles.title}>NativeBook</Text>
          <Text style={styles.subtitle}>
            High-contrast component staging, rapid prop iteration, and a bottom-drawer explorer
            designed for native iOS workflows.
          </Text>
        </View>

        <View style={styles.panel}>
          <View style={styles.panelRow}>
            <Text style={styles.panelLabel}>MODE</Text>
            <Text style={styles.panelValue}>DESIGN ALPHA</Text>
          </View>
          <View style={styles.panelRow}>
            <Text style={styles.panelLabel}>SURFACE</Text>
            <Text style={styles.panelValue}>MONOCHROME / INDUSTRIAL</Text>
          </View>
          <View style={styles.panelRow}>
            <Text style={styles.panelLabel}>FLOW</Text>
            <Text style={styles.panelValue}>EXPLORE → STAGE → TUNE</Text>
          </View>
        </View>

        <View style={styles.instructions}>
          <View style={styles.instructionRow}>
            <Text style={styles.instructionIndex}>01</Text>
            <Text style={styles.instructionText}>Open the floating `NB` trigger.</Text>
          </View>
          <View style={styles.instructionRow}>
            <Text style={styles.instructionIndex}>02</Text>
            <Text style={styles.instructionText}>Choose a registered story from the explorer.</Text>
          </View>
          <View style={styles.instructionRow}>
            <Text style={styles.instructionIndex}>03</Text>
            <Text style={styles.instructionText}>Edit props inside the drawer with terminal-style controls.</Text>
          </View>
        </View>


      </View>
    </NativeBookProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingTop: 72,
    paddingBottom: 48,
  },
  hero: {
    marginBottom: 28,
  },
  eyebrow: {
    color: '#888888',
    fontSize: 10,
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  title: {
    fontSize: 40,
    fontWeight: '700',
    color: '#000000',
    letterSpacing: -1.6,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#888888',
    lineHeight: 24,
    letterSpacing: -0.32,
  },
  panel: {
    borderWidth: 1,
    borderColor: '#EAEAEA',
    marginBottom: 24,
  },
  panelRow: {
    minHeight: 52,
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEA',
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  panelLabel: {
    color: '#888888',
    fontSize: 10,
    letterSpacing: 0.5,
  },
  panelValue: {
    color: '#000000',
    fontSize: 12,
    letterSpacing: 0.24,
  },
  instructions: {
    borderTopWidth: 1,
    borderTopColor: '#EAEAEA',
  },
  instructionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEA',
  },
  instructionIndex: {
    width: 34,
    color: '#888888',
    fontSize: 10,
    letterSpacing: 0.5,
  },
  instructionText: {
    flex: 1,
    color: '#000000',
    fontSize: 16,
    letterSpacing: -0.32,
  },
  footer: {
    marginTop: 'auto',
    paddingTop: 24,
  },
  footerText: {
    color: '#888888',
    fontSize: 12,
    letterSpacing: 0.24,
  }
});

export default App;
