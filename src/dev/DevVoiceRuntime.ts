import {NativeModules, NativeEventEmitter} from 'react-native';

import {EventBus} from '../conversation/eventBus';
import {ConversationDriver} from '../conversation/conversationDriver';
import {ConversationEvent} from '../conversation/events';
// import {RuntimePersistence} from '../conversation/runtimePersistence';
import {InMemoryRuntimePersistence} from '../conversation/InMemoryRuntimePersistence';

import {WakeWordController} from '../voice/WakeWordController';
import {PorcupineEngine} from '../voice/porcupineEngine';

const {Vosk} = NativeModules;

export class DevVoiceRuntime {
  private voskEmitter = new NativeEventEmitter(Vosk);

  private bus = new EventBus<ConversationEvent>();
  private persistence = new InMemoryRuntimePersistence();

  private driver = new ConversationDriver(this.bus, this.persistence);

  private porcupine = new PorcupineEngine();

  private wakeController = new WakeWordController(
    this.driver,
    null as any,
    () => this.startPorcupine(),
    () => this.stopPorcupine(),
  );

  async start() {
    console.log('🚀 DEV VOICE RUNTIME START');

    await Vosk.loadModel('model');

    this.bindDriverEvents();
    this.bindVoskEvents();

    await this.wakeController.start();

    console.log('🐝 WAITING WAKE WORD');
  }

  // -----------------------------
  // PORCUPINE
  // -----------------------------

  private async startPorcupine() {
    await this.porcupine.start(() => {
      this.wakeController.onWakeWord();
    });
  }

  private async stopPorcupine() {
    await this.porcupine.stop();
  }

  // -----------------------------
  // DRIVER EVENTS
  // -----------------------------

  private bindDriverEvents() {
    this.bus.on('SYSTEM_SPEAK', e => {
      console.log('🗣 SYSTEM:', e.text);
    });

    this.bus.on('START_LISTENING', async () => {
      console.log('🎤 VOSK START');

      await Vosk.start({
        sampleRate: 16000,
      });
    });

    this.bus.on('FLOW_EFFECT', async e => {
      if (e.effect.type === 'START_FLOW') {
        console.log('➡ START FLOW:', e.effect.flowId);

        await this.driver.startFlow(e.effect.flowId);
      }
    });
  }

  // -----------------------------
  // VOSK EVENTS
  // -----------------------------

  private bindVoskEvents() {
    this.voskEmitter.removeAllListeners('onResult');
    this.voskEmitter.removeAllListeners('onPartialResult');

    this.voskEmitter.addListener('onResult', async e => {
      const text = e?.text ?? '';

      console.log('👤 USER:', text);

      if (!text) return;

      await this.driver.handleExternalInput(text);
    });

    this.voskEmitter.addListener('onPartialResult', e => {
      const partial = e?.partial ?? '';

      if (partial) {
        console.log('…', partial);
      }
    });
  }
}
