// // import Config from 'react-native-config';
// import {
//   PorcupineManager,
//   BuiltInKeywords,
// } from '@picovoice/porcupine-react-native';

// export class PorcupineEngine {
//   private manager: PorcupineManager | null = null;

//   async start(onWakeWord: () => void) {
//     const ACCESS_KEY =
//       'cpqxgiTZb2iwT+o4OV1eURostH1Z993FkSqytpvhrIKaNVbHC0PCug==';

//     console.log('🐝 BEFORE CREATE');

//     try {
//       this.manager = await PorcupineManager.fromBuiltInKeywords(
//         ACCESS_KEY,
//         [BuiltInKeywords.BUMBLEBEE],
//         onWakeWord,
//       );

//       console.log('🐝 AFTER CREATE');

//       await this.manager.start();

//       console.log('🐝 AFTER START');
//     } catch (e) {
//       console.error('🐝 PORCUPINE ERROR', e);
//       throw e;
//     }
//   }
//   async stop() {
//     if (!this.manager) return;

//     await this.manager.stop();

//     console.log('🐝 Porcupine stopped');
//   }
// }
