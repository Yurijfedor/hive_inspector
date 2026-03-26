import {AuthProvider} from '../auth/AuthProvider';

import {SyncGate} from '../app/SyncGate';

import {AppNavigator} from '../navigation/AppNavigator';

export default function DevApp() {
  return (
    <AuthProvider>
      <SyncGate>
        <AppNavigator />
      </SyncGate>
    </AuthProvider>
  );
}
