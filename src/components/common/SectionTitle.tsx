import React from 'react';

import {Text, StyleSheet} from 'react-native';

type Props = {
  children: React.ReactNode;
};

export const SectionTitle = ({children}: Props) => {
  return <Text style={styles.title}>{children}</Text>;
};

const styles = StyleSheet.create({
  title: {
    fontSize: 18,

    fontWeight: '600',

    marginTop: 16,

    marginBottom: 4,
  },
});
