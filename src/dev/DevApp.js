import React, {useEffect} from 'react';

import {AuthProvider} from '../auth/AuthProvider';
import {SyncGate} from '../app/SyncGate';
import {AppNavigator} from '../navigation/AppNavigator';
import {ConversationProvider} from '../conversation/ConversationProvider';
import {LocalizationProvider} from '../providers/LocalizationProvider';

import {requestMicrophonePermission} from '../permissions/microphonePermission';

export default function DevApp() {
  useEffect(() => {
    requestMicrophonePermission();
  }, []);

  return (
    <LocalizationProvider>
      <AuthProvider>
        <ConversationProvider>
          <SyncGate>
            <AppNavigator />
          </SyncGate>
        </ConversationProvider>
      </AuthProvider>
    </LocalizationProvider>
  );
}
