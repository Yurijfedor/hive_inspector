import {EventBus} from '../conversation/eventBus';
import {ConversationEvent} from '../conversation/events';
import {VoiceAdapter} from '../adapters/voice/VoiceAdapter';
import Vosk from 'react-native-vosk';

export class VoskVoiceAdapter implements VoiceAdapter {
  constructor(private bus: EventBus<ConversationEvent>) {}

  async listen(): Promise<string> {
    console.log('🎤 VOSK LISTEN');

    const v = Vosk as any;

    return new Promise(async resolve => {
      v.onResult((res: any) => {
        if (res.text) {
          console.log('👤 USER:', res.text);
          v.stop();
          resolve(res.text);
        }
      });

      await v.start();
    });
  }

  async speak(text: string): Promise<void> {
    console.log('🗣 SYSTEM:', text);

    this.bus.emit({
      type: 'SYSTEM_SPEAK',
      text,
    });
  }
}
