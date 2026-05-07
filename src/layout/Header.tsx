import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';

export const Header = ({onMenuPress}: {onMenuPress: () => void}) => {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      {/* LOGO */}
      <TouchableOpacity onPress={() => navigation.navigate('Apiary')}>
        <Text style={styles.logo}>🐝 Bee</Text>
      </TouchableOpacity>

      {/* MENU */}
      <TouchableOpacity onPress={onMenuPress}>
        <Text style={styles.button}>☰</Text>
      </TouchableOpacity>

      {/* PROFILE */}
      <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
        <Text style={styles.button}>👤</Text>
      </TouchableOpacity>
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
  button: {fontSize: 18},
});
