import {GoogleSignin} from '@react-native-google-signin/google-signin';

export function configureGoogleSignIn() {
  GoogleSignin.configure({
    webClientId:
      '985102730017-hp7jif3129ct7cem77uonp17tp2p1keb.apps.googleusercontent.com',
    offlineAccess: true,
  });
}
