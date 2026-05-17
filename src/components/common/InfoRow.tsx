import React from 'react';

import {View, Text, StyleSheet} from 'react-native';

type Props = {
  label: string;

  value: React.ReactNode;
};

export const InfoRow = ({label, value}: Props) => {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}:</Text>

      <Text style={styles.value}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',

    marginBottom: 4,
  },

  label: {
    fontWeight: '600',

    marginRight: 4,
  },

  value: {
    flex: 1,
  },
});
