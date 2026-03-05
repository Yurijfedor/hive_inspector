/**
 * @format
 */

import {AppRegistry} from 'react-native';
import DevApp from './src/dev/DevApp';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => DevApp);
