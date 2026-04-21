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
  private driver = new ConversationDriver(this.bus, this.persistence, this.uid);

  private porcupine = new PorcupineEngine();

  private speaking = false;
  private stopped = false;
  private modelLoaded = false;

  // 🔥 захист від self listening
  private blockListeningUntil = 0;

  private ttsResolve: (() => void) | null = null;
  private ttsInitialized = false;

  private onStopCallback: (() => void) | null = null;

  public onStop(cb: () => void) {
    this.onStopCallback = cb;
    return () => {
      this.onStopCallback = null;
    };
  }

  private wakeController = new WakeWordController(
    this.driver,
    this.bus,
    () => this.startPorcupine(),
    () => this.stopPorcupine(),
  );

  // --------------------------------------------------
  // INIT TTS
  // --------------------------------------------------

  private initTts() {
    if (this.ttsInitialized) return;

    this.ttsInitialized = true;

    Tts.removeAllListeners('tts-finish');
    Tts.removeAllListeners('tts-cancel');

    Tts.addEventListener('tts-finish', () => {
      this.ttsResolve?.();
      this.ttsResolve = null;
    });

    Tts.addEventListener('tts-cancel', () => {
      this.ttsResolve?.();
      this.ttsResolve = null;
    });
  }

  // --------------------------------------------------
  // SAFE SPEAK
  // --------------------------------------------------

  private speak(text: string): Promise<void> {
    this.initTts();

    return new Promise((resolve) => {
      let resolved = false;

      this.ttsResolve = () => {
        if (resolved) return;
        resolved = true;
        resolve();
      };

      Tts.speak(text);

      // 🔥 fallback
      setTimeout(() => {
        if (!resolved) {
          console.log('⚠️ TTS fallback resolve');
          resolved = true;
          resolve();
        }
      }, 2500);
    });
  }

  // --------------------------------------------------
  // START
  // --------------------------------------------------

  async start() {
    console.log('🚀 DEV VOICE RUNTIME START');

    await this.reset();

    if (!this.modelLoaded) {
      console.log('📦 LOAD VOSK MODEL');
      await Vosk.loadModel('model');
      this.modelLoaded = true;
    }

    this.bindDriverEvents();
    this.bindVoskEvents();

    await this.wakeController.start();

    console.log('🐝 WAITING WAKE WORD');
  }

  // --------------------------------------------------
  // RESET
  // --------------------------------------------------

  private async reset() {
    console.log('♻️ RESET RUNTIME');

    try {
      await Vosk.stop();
    } catch {}

    try {
      await this.stopPorcupine();
    } catch {}

    this.voskEmitter.removeAllListeners('onResult');
    this.voskEmitter.removeAllListeners('onPartialResult');

    this.bus = new EventBus<ConversationEvent>();
    this.persistence = new InMemoryRuntimePersistence();
    this.driver = new ConversationDriver(this.bus, this.persistence, this.uid);

    this.porcupine = new PorcupineEngine();

    this.wakeController = new WakeWordController(
      this.driver,
      this.bus,
      () => this.startPorcupine(),
      () => this.stopPorcupine(),
    );

    this.stopped = false;
  }

  // --------------------------------------------------
  // PORCUPINE
  // --------------------------------------------------

  private async startPorcupine() {
    if (this.stopped) return;

    await this.porcupine.start(() => {
      this.wakeController.onWakeWord();
    });
  }

  private async stopPorcupine() {
    await this.porcupine.stop();
  }

  // --------------------------------------------------
  // DRIVER EVENTS
  // --------------------------------------------------

  private bindDriverEvents() {
    this.bus.on('SYSTEM_SPEAK', async (e) => {
      if (this.speaking || this.stopped) return;

      this.speaking = true;

      console.log('🗣 SYSTEM:', e.text);

      // 🔥 блокуємо self listening
      this.blockListeningUntil = Date.now() + 3000;

      try {
        await Vosk.stop();
      } catch {}

      await this.stopPorcupine();

      await this.speak(e.text);

      this.speaking = false;

      if (this.stopped) return;

      const wait = Math.max(0, this.blockListeningUntil - Date.now());
      if (wait > 0) {
        await new Promise((r) => setTimeout(r, wait));
      }

      console.log('🎤 VOSK START (safe)');

      try {
        await Vosk.start({sampleRate: 16000});
      } catch (e) {
        console.log('❌ VOSK START FAILED', e);
      }
    });

    this.bus.on('CONVERSATION_FINISHED', async () => {
      if (this.stopped) return;

      console.log('🏁 CONVERSATION FINISHED');

      try {
        await Vosk.stop();
      } catch {}

      await this.wakeController.onConversationFinished();
    });

    this.bus.on('STOP_INSPECTION', async () => {
      console.log('🛑 FULL STOP INSPECTION');

      this.stopped = true;

      try {
        await Vosk.stop();
      } catch {}

      await this.stopPorcupine();

      await new Promise((r) => setTimeout(r, 190));

      await this.speak('Огляд завершено');

      this.onStopCallback?.();
    });

    this.bus.on('DOMAIN_EVENT', async (e) => {
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
    this.voskEmitter.addListener('onResult', async (e) => {
      if (this.stopped) return;

      if (Date.now() < this.blockListeningUntil) {
        console.log('⛔ IGNORE SELF AUDIO');
        return;
      }

      console.log('RESULT RAW:', JSON.stringify(e));

      const text = typeof e === 'string' ? e : e?.text ?? e?.result?.text ?? '';

      console.log('👤 USER:', text);

      if (!text) return;

      await Vosk.stop();

      await this.driver.handleExternalInput(text);
    });

    this.voskEmitter.addListener('onPartialResult', (e) => {
      if (this.stopped) return;

      if (Date.now() < this.blockListeningUntil) return;

      console.log('PARTIAL RAW:', JSON.stringify(e));
    });
  }

  // --------------------------------------------------

  public async handleTextInput(text: string) {
    if (!this.driver || this.stopped) {
      console.log('❌ DRIVER NOT READY OR STOPPED');
      return;
    }

    await this.driver.handleExternalInput(text);
  }
}
