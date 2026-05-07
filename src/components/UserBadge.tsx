import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

import {useAuth} from '../auth/AuthProvider';

export const UserBadge = () => {
  const {user} = useAuth();

  const label = (() => {
    if (!user) return '...';

    if (user.isAnonymous) {
      return 'Гість';
    }

    if (user.displayName) {
      return user.displayName;
    }

    if (user.email) {
      return user.email;
    }

    return 'Користувач';
  })();

  return (
    <View style={styles.container}>
      <Text style={styles.text} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    marginHorizontal: 12,

    backgroundColor: 'rgba(255,248,220,0.92)',

    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,

    justifyContent: 'center',
  },

  text: {
    fontSize: 13,
    color: '#333',
    fontWeight: '500',
    textAlign: 'right',
  },
});
