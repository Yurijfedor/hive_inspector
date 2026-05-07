import React from 'react';
import {TouchableOpacity, View, Text, Image, StyleSheet} from 'react-native';

import {useNavigation} from '@react-navigation/native';
import {useAuth} from '../auth/AuthProvider';

export const ProfileAvatar = () => {
  const navigation = useNavigation<any>();
  const {user} = useAuth();

  return (
    <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
      {user?.photoURL ? (
        <Image source={{uri: user.photoURL}} style={styles.avatar} />
      ) : (
        <View style={styles.fallback}>
          <Text style={styles.fallbackText}>
            {user?.displayName?.[0] || '👤'}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },

  fallback: {
    width: 36,
    height: 36,
    borderRadius: 18,

    backgroundColor: '#d6d6d6',

    justifyContent: 'center',
    alignItems: 'center',
  },

  fallbackText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
});
