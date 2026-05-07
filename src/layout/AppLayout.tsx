import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Header} from './Header';
import {SideMenu} from './SideMenu';
import {useMenu} from './useMenu';
import {GlobalStatus} from './GlobalStatus';

export const AppLayout: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const menu = useMenu();

  // 🔥 ТИМЧАСОВО (потім підключимо state)
  const syncing = false;
  const voiceActive = false;
  const online = true;

  return (
    <View style={styles.container}>
      <Header onMenuPress={menu.open} />

      <View style={styles.content}>{children}</View>

      <View style={styles.overlayLayer}>
        <SideMenu visible={menu.isOpen} onClose={menu.close} />

        <GlobalStatus
          syncing={syncing}
          voiceActive={voiceActive}
          online={online}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative', // 🔥 важливо для overlay
  },

  content: {
    flex: 1,
    zIndex: 1, // контент під overlay
  },

  overlayLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
    pointerEvents: 'box-none', // 🔥 дозволяє кліки проходити
  },
});
