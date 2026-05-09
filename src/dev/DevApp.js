import {AuthProvider} from '../auth/AuthProvider';

import {SyncGate} from '../app/SyncGate';

import {AppNavigator} from '../navigation/AppNavigator';

import {ConversationProvider} from '../conversation/ConversationProvider';

import {LocalizationProvider} from '../providers/LocalizationProvider';

export default function DevApp() {
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
