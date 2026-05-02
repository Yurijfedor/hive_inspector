import React from 'react';
import {Image, StyleSheet, View} from 'react-native';

export const AppBackground: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  return (
    <View style={styles.container}>
      {/* 🔹 OVERLAY */}
      <View style={styles.overlay} />

      {/* 🔹 ФОН */}
      <Image
        source={require('../assets/honeycomb-bg.png')}
        resizeMode="cover"
        style={styles.background}
      />

      {/* 🔹 КОНТЕНТ */}
      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    opacity: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 248, 220, 0.85)',
  },
  content: {
    flex: 1,
  },
});
