import React from 'react';

import {View, Text, StyleSheet} from 'react-native';

import {useAppTranslation} from '../../hooks/useAppTranslation';

type Props = {
  status: 'good' | 'warning' | 'critical';
};

export const ApiaryStatusCard = ({status}: Props) => {
  const {t} = useAppTranslation();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        {status === 'good' && `🟢 ${t('analytics:apiaryGood')}`}

        {status === 'warning' && `🟡 ${t('analytics:apiaryWarning')}`}

        {status === 'critical' && `🔴 ${t('analytics:apiaryCritical')}`}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#eef6ff',
    marginTop: 12,
  },

  text: {
    fontWeight: '600',
  },
});
