import 'i18next';

import {defaultResources} from './schema';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common';

    resources: typeof defaultResources;
  }
}
