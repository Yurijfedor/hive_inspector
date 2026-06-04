import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

import {useAppTranslation} from '../hooks/useAppTranslation';
import {setAppLanguage} from '../localization/i18n';
import {AppLanguage} from '../localization/types';

const LANGUAGES: AppLanguage[] = ['en', 'uk', 'de'];

export const LanguageSwitcher = () => {
  const {currentLanguage} = useAppTranslation();

  const [opened, setOpened] = useState(false);

  const handleSelect = async (language: AppLanguage) => {
    await setAppLanguage(language);
    setOpened(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.badge}
        onPress={() => setOpened((prev) => !prev)}>
        <Text style={styles.badgeText}>{currentLanguage.toUpperCase()} ▼</Text>
      </TouchableOpacity>

      {opened && (
        <View style={styles.dropdown}>
          {LANGUAGES.map((language) => (
            <TouchableOpacity
              key={language}
              style={styles.option}
              onPress={() => handleSelect(language)}>
              <Text
                style={[
                  styles.optionText,
                  language === currentLanguage && styles.activeOption,
                ]}>
                {language.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },

  badge: {
    paddingHorizontal: 10,
    height: 36,

    borderRadius: 10,

    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: 'rgba(255,255,255,0.45)',
  },

  badgeText: {
    fontWeight: '600',
    color: '#333',
  },

  dropdown: {
    position: 'absolute',

    top: 42,
    right: 0,

    minWidth: 70,

    backgroundColor: '#fff',

    borderRadius: 10,

    borderWidth: 1,
    borderColor: '#eee',

    overflow: 'hidden',

    elevation: 4,
    zIndex: 999,
  },

  option: {
    paddingVertical: 10,
    alignItems: 'center',
  },

  optionText: {
    color: '#333',
  },

  activeOption: {
    fontWeight: '700',
  },
});
