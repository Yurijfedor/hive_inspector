import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

type Props = {
  syncing?: boolean;
  voiceActive?: boolean;
  online?: boolean;
};

export const GlobalStatus: React.FC<Props> = ({
  syncing,
  voiceActive,
  online = true,
}) => {
  if (!syncing && !voiceActive && online) return null;

  return (
    <View style={styles.container}>
      {syncing && <Text style={styles.text}>🔄 Sync</Text>}
      {voiceActive && <Text style={styles.text}>🎤 Voice</Text>}
      {!online && <Text style={styles.text}>📡 Offline</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: '#000',
    padding: 10,
    borderRadius: 10,
    flexDirection: 'row',
    gap: 8,
  },
  text: {
    color: '#fff',
    fontSize: 12,
  },
});
