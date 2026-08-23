import {EventBus} from '../conversation/driver/eventBus';
import {ConversationEvent} from '../conversation/driver/events';
import {VoiceAdapter} from '../adapters/voice/VoiceAdapter';
import Vosk from 'react-native-vosk';
import {NativeModules} from 'react-native';

export class VoskVoiceAdapter implements VoiceAdapter {
  constructor(private bus: EventBus<ConversationEvent>) {}

  async listen(): Promise<string> {
    console.log('🎤 VOSK LISTEN');

    const v = Vosk as any;

    return new Promise(async (resolve) => {
      v.onResult((res: any) => {
        if (res.text) {
          console.log('👤 USER:', res.text);
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

  async testBluetoothScoInput(): Promise<void> {
    console.log('🎧 TEST BLUETOOTH SCO INPUT');

    const {Vosk} = NativeModules;

    if (!Vosk) {
      console.error('❌ NativeModules.Vosk is not available');
      return;
    }

    console.log('🎧 Native Vosk module:', Vosk);

    try {
      const result = await Vosk.testBluetoothScoInput();

      console.log('✅ Bluetooth SCO test result:', result);
    } catch (error) {
      console.error('❌ Bluetooth SCO test failed:', error);
    }
  }
}
