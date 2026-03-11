import {
  PorcupineManager,
  BuiltInKeywords,
} from '@picovoice/porcupine-react-native';

export class PorcupineEngine {
  private manager: PorcupineManager | null = null;

  async start(onWakeWord: () => void) {
    this.manager = await PorcupineManager.fromBuiltInKeywords(
      process.env.PICOVOICE_ACCESS_KEY!,
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
