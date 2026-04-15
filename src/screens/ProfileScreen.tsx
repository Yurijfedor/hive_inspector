import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import {useAuth} from '../auth/AuthProvider';
import {logout, switchGoogleAccount} from '../services/authService';

export const ProfileScreen = () => {
  const {user} = useAuth();
  const navigation = useNavigation<any>();

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
      <Text style={styles.title}>👤 Профіль</Text>

      {/* USER INFO */}
      <View style={styles.card}>
        <Text style={styles.label}>Статус:</Text>
        <Text style={styles.value}>
          {isAnonymous ? 'Гість' : 'Google акаунт'}
        </Text>

        {!isAnonymous && (
          <>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{user?.email}</Text>
          </>
        )}

        <Text style={styles.label}>UID:</Text>
        <Text style={styles.uid}>{user?.uid}</Text>
      </View>

      {/* ACTIONS */}
      {!isAnonymous && (
        <TouchableOpacity
          style={styles.switchButton}
          onPress={handleSwitchAccount}>
          <Text style={styles.buttonText}>🔄 Змінити акаунт</Text>
        </TouchableOpacity>
      )}

      {!user?.isAnonymous && (
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.buttonText}>🚪 Вийти</Text>
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
});
