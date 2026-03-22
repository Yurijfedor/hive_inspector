import {NativeModules, NativeEventEmitter} from 'react-native';
import Tts from 'react-native-tts';

import {EventBus} from '../conversation/driver/eventBus';
import {ConversationDriver} from '../conversation/driver/conversationDriver';
import {ConversationEvent} from '../conversation/driver/events';

import {InMemoryRuntimePersistence} from '../conversation/InMemoryRuntimePersistence';

import {WakeWordController} from '../voice/WakeWordController';
import {PorcupineEngine} from '../voice/porcupineEngine';

import {handleDomainEvent} from '../domain/handlers/handleDomainEvent';

const {Vosk} = NativeModules;

export class DevVoiceRuntime {
  constructor(private uid: string) {}

  private voskEmitter = new NativeEventEmitter(Vosk);

  private bus = new EventBus<ConversationEvent>();

  private persistence = new InMemoryRuntimePersistence();

  private driver = new ConversationDriver(this.bus, this.persistence);
  private ttsResolve: (() => void) | null = null;
  private ttsInitialized = false;
  private initTts() {
    if (this.ttsInitialized) return;

    this.ttsInitialized = true;

    Tts.addEventListener('tts-finish', () => {
      if (this.ttsResolve) {
        this.ttsResolve();
        this.ttsResolve = null;
      }
    });

    Tts.addEventListener('tts-cancel', () => {
      if (this.ttsResolve) {
        this.ttsResolve();
        this.ttsResolve = null;
      }
    });
  }
  private porcupine = new PorcupineEngine();

  private wakeController = new WakeWordController(
    this.driver,
    this.bus,
    () => this.startPorcupine(),
    () => this.stopPorcupine(),
  );

  private speaking = false;

  async start() {
    console.log('🚀 DEV VOICE RUNTIME START');

    await Vosk.loadModel('model');

    this.bindDriverEvents();
    this.bindVoskEvents();

    await this.wakeController.start();

    console.log('🐝 WAITING WAKE WORD');
  }

  // --------------------------------------------------
  // PORCUPINE
  // --------------------------------------------------

  private async startPorcupine() {
    await this.porcupine.start(() => {
      this.wakeController.onWakeWord();
    });
  }

  private async stopPorcupine() {
    await this.porcupine.stop();
  }

  // --------------------------------------------------
  // 🔊 TTS (через events — ПРАВИЛЬНО)
  // --------------------------------------------------

  private speak(text: string): Promise<void> {
    this.initTts();

    return new Promise(resolve => {
      this.ttsResolve = resolve;
      Tts.speak(text);
    });
  }

  // --------------------------------------------------
  // DRIVER EVENTS
  // --------------------------------------------------

  private bindDriverEvents() {
    // -------------------------
    // SYSTEM SPEAK (🔥 ГОЛОВНЕ)
    // -------------------------

    this.bus.on('SYSTEM_SPEAK', async e => {
      if (this.speaking) return;

      this.speaking = true;

      console.log('🗣 SYSTEM:', e.text);

      // ❗ гарантуємо що мікрофон вимкнений
      try {
        await Vosk.stop();
      } catch {}

      await this.stopPorcupine();

      // 🔊 говоримо
      await this.speak(e.text);

      this.speaking = false;

      // 🎤 тільки після цього слухаємо
      this.bus.emit({
        type: 'START_LISTENING',
      });
    });

    // -------------------------
    // START LISTENING
    // -------------------------

    this.bus.on('START_LISTENING', async () => {
      if (this.speaking) {
        console.log('⛔ SKIP LISTENING (still speaking)');
        return;
      }

      console.log('🎤 VOSK START');

      try {
        await Vosk.stop();
      } catch {}

      await Vosk.start({
        sampleRate: 16000,
      });
    });

    // -------------------------
    // CONVERSATION FINISHED
    // -------------------------

    this.bus.on('CONVERSATION_FINISHED', async () => {
      console.log('🏁 CONVERSATION FINISHED');

      try {
        await Vosk.stop();
      } catch {}

      await this.wakeController.onConversationFinished();
    });

    // -------------------------
    // DEBUG
    // -------------------------

    this.bus.on('FLOW_EFFECT', e => {
      console.log('⚙️ FLOW EFFECT:', e.effect);
    });

    // -------------------------
    // DOMAIN EVENTS
    // -------------------------

    this.bus.on('DOMAIN_EVENT', async e => {
      try {
        console.log('📦 DOMAIN EVENT:', e.event);

        await handleDomainEvent(this.uid, e.event);
      } catch (err) {
        console.error('❌ DOMAIN HANDLER ERROR', err);
      }
    });
  }

  // --------------------------------------------------
  // VOSK EVENTS
  // --------------------------------------------------

  private bindVoskEvents() {
    this.voskEmitter.removeAllListeners('onResult');
    this.voskEmitter.removeAllListeners('onPartialResult');

    this.voskEmitter.addListener('onResult', async e => {
      console.log('RESULT RAW:', JSON.stringify(e));

      const text = typeof e === 'string' ? e : e?.text ?? e?.result?.text ?? '';

      console.log('👤 USER:', text);

      if (!text) return;

      await Vosk.stop();

      await this.driver.handleExternalInput(text);
    });

    this.voskEmitter.addListener('onPartialResult', e => {
      console.log('PARTIAL RAW:', JSON.stringify(e));
    });
  }
}
