import React, {useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  PanResponder,
} from 'react-native';

import {useNavigation} from '@react-navigation/native';

import {ProfileAvatar} from '../components/ProfileAvatar';
import {UserBadge} from '../components/UserBadge';
import {LanguageSwitcher} from '../components/LanguageSwitcher';

type Props = {
  onMenuPress: () => void;
  onRefresh?: () => void | Promise<void>;
  refreshing?: boolean;
};

const SWIPE_THRESHOLD = 70;

export const Header = ({onMenuPress, onRefresh, refreshing = false}: Props) => {
  const navigation = useNavigation<any>();

  const refreshingRef = useRef(false);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        if (!onRefresh || refreshing || refreshingRef.current) {
          return false;
        }

        const {dx, dy} = gestureState;

        // Gesture активується тільки для вертикального руху вниз.
        // Звичайний tap по кнопці сюди не потрапляє.
        return dy > 10 && Math.abs(dy) > Math.abs(dx) * 1.2;
      },

      onPanResponderRelease: async (_, gestureState) => {
        if (
          gestureState.dy < SWIPE_THRESHOLD ||
          !onRefresh ||
          refreshing ||
          refreshingRef.current
        ) {
          return;
        }

        refreshingRef.current = true;

        try {
          console.log('🔄 HEADER SWIPE REFRESH');

          await onRefresh();
        } finally {
          refreshingRef.current = false;
        }
      },
    }),
  ).current;

  return (
    <View {...panResponder.panHandlers} style={styles.container}>
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
        <LanguageSwitcher />
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

  logo: {
    fontSize: 18,
    fontWeight: '600',
  },

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
