import React, {useEffect, useState} from 'react';

import {View, ActivityIndicator} from 'react-native';

import {initLocalization} from '../localization/i18n';

type Props = {
  children: React.ReactNode;
};

export function LocalizationProvider({children}: Props) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function bootstrap() {
      try {
        await initLocalization();

        setReady(true);
      } catch (e) {
        console.log('❌ LOCALIZATION INIT FAILED', e);
      }
    }

    bootstrap();
  }, []);

  if (!ready) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <ActivityIndicator />
      </View>
    );
  }

  return <>{children}</>;
}
