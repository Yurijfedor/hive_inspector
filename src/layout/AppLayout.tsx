import React, {useCallback, useState} from 'react';
import {View, StyleSheet} from 'react-native';

import {Header} from './Header';
import {SideMenu} from './SideMenu';
import {useMenu} from './useMenu';
import {GlobalStatus} from './GlobalStatus';

import {useAuth} from '../auth/AuthProvider';
import {refreshAppData} from '../refresh/refreshAppData';

export const AppLayout: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const menu = useMenu();

  const {user} = useAuth();

  const [syncing, setSyncing] = useState(false);

  const voiceActive = false;
  const online = true;

  // --------------------------------------------------
  // REFRESH
  // --------------------------------------------------

  const handleRefresh = useCallback(async () => {
    if (!user?.uid) {
      return;
    }

    if (syncing) {
      return;
    }

    console.log('🔄 HEADER SWIPE REFRESH');

    setSyncing(true);

    try {
      await refreshAppData(user.uid);

      console.log('✅ HEADER REFRESH DONE');
    } catch (e) {
      console.log('❌ HEADER REFRESH FAILED:', e);
    } finally {
      setSyncing(false);
    }
  }, [user?.uid, syncing]);

  return (
    <View style={styles.container}>
      <Header
        onMenuPress={menu.open}
        onRefresh={handleRefresh}
        refreshing={syncing}
      />

      {/* SCREEN CONTENT */}

      <View style={styles.content}>{children}</View>

      {/* OVERLAYS */}

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
    position: 'relative',
  },

  content: {
    flex: 1,
    zIndex: 1,
  },

  overlayLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
    pointerEvents: 'box-none',
  },
});
