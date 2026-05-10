import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import {useAuth} from '../auth/AuthProvider';
import {logout, switchGoogleAccount} from '../services/authService';
import {useAppTranslation} from '../hooks/useAppTranslation';
import {setAppLanguage} from '../localization/i18n';

export const ProfileScreen = () => {
  const {user} = useAuth();
  const navigation = useNavigation<any>();
  const {t, i18n} = useAppTranslation();

  const isAnonymous = user?.isAnonymous;

  const handleLogout = async () => {
    await logout();
    navigation.navigate('Apiary');
  };

  const handleSwitchAccount = async () => {
    try {
      await switchGoogleAccount();
    } catch (e) {
      console.log('❌ SWITCH FAILED', e);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {user?.photoURL ? (
          <Image source={{uri: user.photoURL}} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>
              {user?.displayName?.[0] || '?'}
            </Text>
          </View>
        )}

        <Text style={styles.name}>
          {user?.displayName || t('profile:user')}
        </Text>
      </View>
      <View style={styles.languageContainer}>
        <Text style={styles.languageLabel}>{t('profile:language')}</Text>

        <View style={styles.languageButtons}>
          <TouchableOpacity
            style={[
              styles.languageButton,
              i18n.language === 'en' && styles.activeLanguageButton,
            ]}
            onPress={() => setAppLanguage('en')}>
            <Text>EN</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.languageButton,
              i18n.language === 'uk' && styles.activeLanguageButton,
            ]}
            onPress={() => setAppLanguage('uk')}>
            <Text>UA</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.languageButton,
              i18n.language === 'de' && styles.activeLanguageButton,
            ]}
            onPress={() => setAppLanguage('de')}>
            <Text>DE</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* USER INFO */}
      <View style={styles.card}>
        <Text style={styles.label}>{t('profile:status')}</Text>
        <Text style={styles.value}>
          {isAnonymous ? t('profile:guest') : t('profile:googleAccount')}
        </Text>

        {!isAnonymous && (
          <>
            <Text style={styles.label}>{t('profile:email')}</Text>
            <Text style={styles.value}>{user?.email}</Text>
          </>
        )}

        <Text style={styles.label}>{t('profile:uid')}</Text>
        <Text style={styles.uid}>{user?.uid}</Text>
      </View>

      {/* ACTIONS */}
      {!isAnonymous && (
        <TouchableOpacity
          style={styles.switchButton}
          onPress={handleSwitchAccount}>
          <Text style={styles.buttonText}>🔄 {t('profile:switchAccount')}</Text>
        </TouchableOpacity>
      )}

      {!user?.isAnonymous && (
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.buttonText}>🚪 {t('profile:logout')}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },

  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 20,
  },

  card: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },

  label: {
    fontSize: 13,
    color: '#777',
    marginTop: 8,
  },

  value: {
    fontSize: 16,
    fontWeight: '500',
  },

  uid: {
    fontSize: 12,
    color: '#999',
  },

  switchButton: {
    backgroundColor: '#1976D2',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },

  logoutButton: {
    backgroundColor: '#D32F2F',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },

  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },

  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },

  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },

  avatarText: {
    fontSize: 28,
    color: '#fff',
    fontWeight: '600',
  },

  name: {
    fontSize: 18,
    fontWeight: '600',
  },
  languageContainer: {
    marginBottom: 20,
  },

  languageLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },

  languageButtons: {
    flexDirection: 'row',
    gap: 8,
  },

  languageButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#eee',
  },

  activeLanguageButton: {
    backgroundColor: '#90CAF9',
  },
});
