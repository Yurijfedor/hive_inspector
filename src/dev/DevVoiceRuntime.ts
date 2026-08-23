import {NativeModules, NativeEventEmitter} from 'react-native';
import Tts from 'react-native-tts';

import {EventBus} from '../conversation/driver/eventBus';
import {ConversationDriver} from '../conversation/driver/conversationDriver';
import {ConversationEvent} from '../conversation/driver/events';

import {InMemoryRuntimePersistence} from '../conversation/InMemoryRuntimePersistence';

import {handleDomainEvent} from '../domain/handlers/handleDomainEvent';

import {setVoiceUiState} from '../state/voiceUiStateMachine';
import {setVoiceUiContext} from '../state/voiceUiContext';
import {AudioCues} from '../voice/audioCues';

import i18n from '../localization/i18n';
import {loadVoiceModel} from '../voice/modelLoader';
import {getVoiceLanguage} from '../voice/getVoiceLanguage';
import {getTtsLanguage} from '../voice/getTtsLanguage';
import type {VoiceLanguage} from '../voice/language/VoiceLanguagePack';
import {VoiceModelManager} from '../voice/VoiceModelManager';

const {Vosk} = NativeModules;

/**
 * Voice runtime timing configuration.
 *
 * These values are not part of the normal pipeline.
 * Under normal conditions TTS completion is driven by the
 * 'tts-finish' event.
 *
 * Timeout is only an emergency fallback in case the platform
 * TTS engine never reports completion.
 */
const TTS_TIMEOUT_MS = 10000;

export class DevVoiceRuntime {
  constructor(private uid: string) {}

  private voiceLanguage: VoiceLanguage = 'uk';

  private voskEmitter = new NativeEventEmitter(Vosk);

  private bus = new EventBus<ConversationEvent>();
  private persistence = new InMemoryRuntimePersistence();

  private driver = new ConversationDriver(
    this.bus,
    this.persistence,
    this.uid,
    this.voiceLanguage,
  );

  private speaking = false;
  private listening = false;
  private stopped = false;
  private modelLoaded = false;

  // 🔥 Захист від self listening
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

  // --------------------------------------------------
  // INIT TTS
  // --------------------------------------------------

  private initTts() {
    if (this.ttsInitialized) {
      return;
    }

    this.ttsInitialized = true;

    Tts.removeAllListeners('tts-finish');
    Tts.removeAllListeners('tts-cancel');

    Tts.addEventListener('tts-start', () => {});

    Tts.addEventListener('tts-finish', () => {
      this.ttsResolve?.();
      this.ttsResolve = null;
    });

    Tts.addEventListener('tts-cancel', () => {
      console.log('🟡 TTS CANCEL');

      this.ttsResolve?.();
      this.ttsResolve = null;
    });

    Tts.addEventListener('tts-error', (e) => {
      console.log('🔴 TTS ERROR', e);
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
        if (resolved) {
          return;
        }

        resolved = true;
        resolve();
      };

      Tts.speak(text);

      // 🔥 fallback
      setTimeout(() => {
        if (!resolved) {
          console.warn('⚠️ TTS timeout fallback');

          resolved = true;
          resolve();
        }
      }, TTS_TIMEOUT_MS);
    });
  }

  // --------------------------------------------------
  // START
  // --------------------------------------------------

  async start() {
    if (this.listening) {
      console.log('🎤 already listening');
      return;
    }

    console.log('🚀 DEV VOICE RUNTIME START');

    await this.reset();

    setVoiceUiState({
      type: 'IDLE',
    });

    await this.speak(i18n.t('inspection:voice.preparing'));

    if (!this.modelLoaded) {
      const language = i18n.language;

      console.log('🌍 APP LANGUAGE:', language);
      console.log('🎤 VOICE LANGUAGE:', this.voiceLanguage);

      const modelPath = await VoiceModelManager.installModel(
        this.voiceLanguage,
        (progress) => {
          console.log(`⬇️ Download: ${(progress * 100).toFixed(0)}%`);
        },
      );

      console.log('📦 LOADING LOCAL MODEL:', modelPath);

      try {
        await loadVoiceModel(modelPath);

        console.log('✅ LOCAL MODEL LOADED');
        console.log('⏳ WAIT AFTER LOAD');

        await new Promise((r) => setTimeout(r, 3000));

        console.log('✅ WAIT FINISHED');

        this.modelLoaded = true;
      } catch (error) {
        console.error('❌ LOCAL MODEL LOAD FAILED', error);
        return;
      }
    }

    this.bindDriverEvents();
    this.bindVoskEvents();

    await this.driver.startFlow('hive');

    console.log('🎤 HIVE FLOW STARTED');
  }

  // --------------------------------------------------
  // RESET
  // --------------------------------------------------

  private async reset() {
    console.log('♻️ RESET RUNTIME');

    try {
      await Vosk.stop();
    } catch {}

    this.listening = false;
    this.speaking = false;

    this.voskEmitter.removeAllListeners('onResult');
    this.voskEmitter.removeAllListeners('onPartialResult');
    this.voskEmitter.removeAllListeners('onFinalResult');

    this.voiceLanguage = getVoiceLanguage(i18n.language);

    const ttsLanguage = getTtsLanguage(this.voiceLanguage);

    console.log('🗣 TTS LANGUAGE:', ttsLanguage);

    try {
      await Tts.setDefaultLanguage(ttsLanguage);
    } catch (error) {
      console.error('❌ TTS LANGUAGE FAILED:', ttsLanguage, error);
    }

    this.bus = new EventBus<ConversationEvent>();
    this.persistence = new InMemoryRuntimePersistence();

    this.driver = new ConversationDriver(
      this.bus,
      this.persistence,
      this.uid,
      this.voiceLanguage,
    );

    this.stopped = false;
    this.blockListeningUntil = 0;
  }

  // --------------------------------------------------
  // DRIVER EVENTS
  // --------------------------------------------------

  private bindDriverEvents() {
    this.bus.on('SYSTEM_SPEAK', async (e) => {
      if (this.speaking || this.stopped) {
        return;
      }

      this.speaking = true;

      console.log('🗣 SYSTEM:', e.text);

      setVoiceUiState({
        type: 'QUESTION',
        text: e.text,
      });

      // 🔥 Блокуємо self listening
      this.blockListeningUntil = Date.now() + 3000;

      // 🔥 Важливо:
      // перед TTS гарантовано припиняємо попередню Vosk-сесію
      try {
        await Vosk.stop();
      } catch {
        console.log('❌ VOSK STOP FAILED');
      }

      this.listening = false;

      await new Promise((resolve) => setTimeout(resolve, 250));

      await this.speak(e.text);

      await new Promise((resolve) => setTimeout(resolve, 250));

      this.speaking = false;

      if (this.stopped) {
        return;
      }

      const wait = Math.max(0, this.blockListeningUntil - Date.now());

      if (wait > 0) {
        await new Promise((resolve) => setTimeout(resolve, wait));
      }

      setVoiceUiState({
        type: 'LISTENING',
      });

      AudioCues.listening();

      console.log('🎤 VOSK START (safe)');
      console.log('🎯 GRAMMAR:', e.grammar);

      if (this.listening) {
        console.log('⚠️ Vosk already listening');
        return;
      }

      // 🔥 НОВА СЕСІЯ СЛУХАННЯ
      this.listening = true;

      try {
        await Vosk.start({
          sampleRate: 16000,
        });

        console.log('✅ VOSK STARTED');
      } catch (error) {
        console.log('❌ VOSK START FAILED', error);

        // 🔥 Якщо native start не вдався,
        // стан listening не повинен залишитися true.
        this.listening = false;
      }
    });

    this.bus.on('CONVERSATION_FINISHED', async () => {
      if (this.stopped) {
        return;
      }

      console.log('🏁 CONVERSATION FINISHED');

      try {
        await Vosk.stop();
      } catch {
        console.log('❌ VOSK STOP FAILED');
      }

      this.listening = false;

      setVoiceUiState({
        type: 'IDLE',
      });
    });

    this.bus.on('STOP_INSPECTION', async () => {
      console.log('🛑 FULL STOP INSPECTION');

      this.stopped = true;
      this.listening = false;

      setVoiceUiState({
        type: 'IDLE',
      });

      try {
        await Vosk.stop();
      } catch {
        console.log('❌ VOSK STOP FAILED');
      }

      await new Promise((r) => setTimeout(r, 190));

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

    this.bus.on('FLOW_PROGRESS', (e) => {
      setVoiceUiContext({
        currentStep: e.current,
        totalSteps: e.total,
      });
    });
  }

  // --------------------------------------------------
  // VOSK EVENTS
  // --------------------------------------------------

  private bindVoskEvents() {
    // --------------------------------------------------
    // FINAL RESULT
    // --------------------------------------------------

    this.voskEmitter.addListener('onResult', async (e) => {
      if (this.stopped) {
        return;
      }

      // 🔥 КРИТИЧНО:
      // Якщо Vosk вже зупинений, цей event може бути
      // запізнілим native event від попередньої сесії.
      if (!this.listening) {
        console.log('⛔ IGNORE RESULT — VOSK NOT LISTENING');
        return;
      }

      if (Date.now() < this.blockListeningUntil) {
        console.log('⛔ IGNORE SELF AUDIO');
        return;
      }

      console.log('RESULT RAW:', JSON.stringify(e));

      const text = typeof e === 'string' ? e : e?.text ?? e?.result?.text ?? '';

      console.log('👤 USER:', text);

      if (!text) {
        return;
      }

      AudioCues.accepted();

      setVoiceUiState({
        type: 'PROCESSING',
      });

      // 🔥 Миттєво закриваємо поточну recognition session
      this.listening = false;

      try {
        await Vosk.stop();
      } catch {
        console.log('❌ VOSK STOP FAILED');
      }

      await this.driver.handleExternalInput(text);
    });

    // --------------------------------------------------
    // PARTIAL RESULT
    // --------------------------------------------------

    this.voskEmitter.addListener('onPartialResult', async (e) => {
      if (this.stopped) {
        return;
      }

      // 🔥 КРИТИЧНО:
      // Після прийняття відповіді listening=false.
      // Будь-який native partial, який прийде після цього,
      // повинен бути проігнорований.
      if (!this.listening) {
        console.log('⛔ IGNORE PARTIAL — VOSK NOT LISTENING');
        return;
      }

      if (Date.now() < this.blockListeningUntil) {
        return;
      }

      const text = String(e ?? '')
        .trim()
        .toLowerCase();

      console.log('PARTIAL RAW:', JSON.stringify(e));
      console.log('PARTIAL TEXT:', text);

      // --------------------------------------------------
      // SPECIAL CASE:
      // коротке "так"
      // --------------------------------------------------

      if (text === 'так') {
        console.log('🔥 ACCEPT PARTIAL YES');

        // 🔥 Найважливіше:
        // блокуємо всі наступні partial/result
        // ще ДО Vosk.stop().
        this.listening = false;

        try {
          await Vosk.stop();
        } catch {
          console.log('❌ VOSK STOP FAILED');
        }

        setVoiceUiState({
          type: 'PROCESSING',
        });

        AudioCues.accepted();

        await this.driver.handleExternalInput('так');
      }
    });

    // --------------------------------------------------
    // FINAL RESULT DEBUG
    // --------------------------------------------------

    this.voskEmitter.addListener('onFinalResult', (e) => {
      console.log('🏁 FINAL RAW:', JSON.stringify(e));
    });
  }

  // --------------------------------------------------
  // TEXT INPUT
  // --------------------------------------------------

  public async handleTextInput(text: string) {
    if (!this.driver || this.stopped) {
      console.log('❌ DRIVER NOT READY OR STOPPED');
      return;
    }

    await this.driver.handleExternalInput(text);
  }

  // --------------------------------------------------
  // STOP INSPECTION
  // --------------------------------------------------

  public async stopInspection() {
    if (this.stopped) {
      return;
    }

    this.listening = false;

    await this.driver.stopInspection();
  }
}
