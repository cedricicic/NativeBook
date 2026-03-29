import React from 'react';
import { StyleSheet, View, Text, StatusBar, Image } from 'react-native';
import { NativeBookProvider } from './nativebook';
import './src/stories'; // Register all stories

const logoImg = require('./src/assets/logo.png');

function App() {
  return (
    <NativeBookProvider>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>

        {/* Grid overlay decoration */}
        <View style={styles.gridOverlay}>
          <View style={styles.gridLineV1} />
          <View style={styles.gridLineV2} />
          <View style={styles.gridLineH1} />
          <View style={styles.gridLineH2} />
        </View>

        {/* Logo centered */}
        <View style={styles.logoArea}>
          <Image
            source={logoImg}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

        {/* Bottom text */}
        <View style={styles.bottomContent}>
          <Text style={styles.eyebrow}>COMPONENT DEVELOPMENT KIT</Text>
          <Text style={styles.title}>NativeBook</Text>
          <View style={styles.titleRule} />
          <Text style={styles.subtitle}>
            High-contrast component staging, rapid prop iteration, and a bottom-drawer explorer built for native iOS workflows.
          </Text>
        </View>

      </View>
    </NativeBookProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },

  // Grid overlay
  gridOverlay: {
    ...StyleSheet.absoluteFillObject,
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

  // Logo area — fills upper portion, centers the blob
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

  // Bottom text pinned to bottom
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
});

export default App;
