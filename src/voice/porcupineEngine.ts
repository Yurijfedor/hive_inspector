// import Config from 'react-native-config';
import {
  PorcupineManager,
  BuiltInKeywords,
} from '@picovoice/porcupine-react-native';

export class PorcupineEngine {
  private manager: PorcupineManager | null = null;

  async start(onWakeWord: () => void) {
    // const accessKey = Config.PICOVOICE_ACCESS_KEY;
    const ACCESS_KEY =
      'cpqxgiTZb2iwT+o4OV1eURostH1Z993FkSqytpvhrIKaNVbHC0PCug==';

    // if (!accessKey) {
    //   throw new Error('PICOVOICE_ACCESS_KEY missing');
    // }

    this.manager = await PorcupineManager.fromBuiltInKeywords(
      ACCESS_KEY,
      [BuiltInKeywords.BUMBLEBEE],
      onWakeWord,
    );

    await this.manager.start();

    console.log('🐝 Porcupine started');
  }

  async stop() {
    if (!this.manager) return;

    await this.manager.stop();

    console.log('🐝 Porcupine stopped');
  }
}
