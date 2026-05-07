import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import {ProfileAvatar} from '../components/ProfileAvatar';
import {UserBadge} from '../components/UserBadge';

export const Header = ({onMenuPress}: {onMenuPress: () => void}) => {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <TouchableOpacity onPress={() => navigation.navigate('Apiary')}>
          <Text style={styles.logo}>🐝 Bee</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={onMenuPress} style={styles.menuButton}>
        <Text style={styles.menuIcon}>☰</Text>
      </TouchableOpacity>

      <View style={styles.right}>
        <UserBadge />
        <ProfileAvatar />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,

    backgroundColor: 'rgba(255,255,255,0.45)',

    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',

    zIndex: 10,
  },

  logo: {fontSize: 18, fontWeight: '600'},
  left: {
    justifyContent: 'center',
  },

  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  menuButton: {
    minWidth: 44,
    height: 44,

    borderRadius: 12,

    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: 'rgba(255,255,255,0.45)',
  },

  menuIcon: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
  },
});
