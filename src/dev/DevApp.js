import {AuthProvider} from '../auth/AuthProvider';

import {SyncGate} from '../app/SyncGate';

import {AppNavigator} from '../navigation/AppNavigator';

import {ConversationProvider} from '../conversation/ConversationProvider';

export default function DevApp() {
  return (
    <AuthProvider>
      <ConversationProvider>
        <SyncGate>
          <AppNavigator />
        </SyncGate>
      </ConversationProvider>
    </AuthProvider>
  );
}
