import React from 'react';
import {View, StyleSheet} from 'react-native';

export const FieldModeOverlay = () => {
  return <View style={styles.overlay} pointerEvents="auto" />;
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
  },
});
