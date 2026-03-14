import {NativeModules, NativeEventEmitter} from 'react-native';

import {EventBus} from '../conversation/eventBus';
import {ConversationDriver} from '../conversation/conversationDriver';
import {ConversationEvent} from '../conversation/events';

import {InMemoryRuntimePersistence} from '../conversation/InMemoryRuntimePersistence';

import {WakeWordController} from '../voice/WakeWordController';
import {PorcupineEngine} from '../voice/porcupineEngine';

import {handleInspectionEffect} from '../effects/inspectionEffectHandler';
import {InspectionEvent} from '../actions/inspectionEvents';

const {Vosk} = NativeModules;

export class DevVoiceRuntime {
  constructor(private uid: string) {}

  private voskEmitter = new NativeEventEmitter(Vosk);

  private bus = new EventBus<ConversationEvent>();

  private persistence = new InMemoryRuntimePersistence();

  private driver = new ConversationDriver(this.bus, this.persistence);

  private porcupine = new PorcupineEngine();

  private wakeController = new WakeWordController(
    this.driver,
    this.bus,
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
  // DRIVER EVENTS
  // --------------------------------------------------

  private bindDriverEvents() {
    this.bus.on('SYSTEM_SPEAK', e => {
      console.log('🗣 SYSTEM:', e.text);
    });

    this.bus.on('START_LISTENING', async () => {
      console.log('🎤 VOSK START');

      await this.stopPorcupine();

      try {
        await Vosk.stop();
      } catch (e) {}

      await Vosk.start({
        sampleRate: 16000,
      });
    });

    this.bus.on('CONVERSATION_FINISHED', async () => {
      console.log('🏁 CONVERSATION FINISHED');

      try {
        await Vosk.stop();
      } catch (e) {}

      await this.wakeController.onConversationFinished();
    });

    // --------------------------------------------------
    // FLOW EFFECTS
    // --------------------------------------------------

    this.bus.on('FLOW_EFFECT', async e => {
      const effect = e.effect;

      // ---------------------------
      // RUNTIME EFFECTS
      // ---------------------------

      if (effect.type === 'START_FLOW') {
        await this.driver.startFlow(effect.flowId, ...(effect.args ?? []));
        return;
      }

      if (effect.type === 'REPLACE_FLOW') {
        await this.driver.replaceFlow(effect.flowId, ...(effect.args ?? []));
        return;
      }

      // ---------------------------
      // DOMAIN EFFECTS
      // ---------------------------

      try {
        const inspectionEvent = mapFlowEffectToInspectionEvent(effect);

        if (inspectionEvent) {
          console.log('💾 SAVE INSPECTION EVENT', inspectionEvent);

          await handleInspectionEffect(this.uid, inspectionEvent);
        }
      } catch (err) {
        console.error('❌ EFFECT HANDLER ERROR', err);
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

// --------------------------------------------------
// FLOW EFFECT → DOMAIN EVENT MAPPER
// --------------------------------------------------

function mapFlowEffectToInspectionEvent(effect: any): InspectionEvent | null {
  switch (effect.type) {
    case 'STRENGTH_RECORDED':
      return {
        type: 'UPDATE_INSPECTION',
        hiveNumber: effect.payload.hiveNumber,
        payload: {
          strength: effect.payload.strength,
        },
      };

    case 'QUEEN_STATUS_UPDATED':
      return {
        type: 'UPDATE_INSPECTION',
        hiveNumber: effect.payload.hiveNumber,
        payload: {
          queen: effect.payload.hasQueen ? 'present' : 'absent',
        },
      };

    case 'HONEY_RECORDED':
      return {
        type: 'UPDATE_INSPECTION',
        hiveNumber: effect.payload.hiveNumber,
        payload: {
          honeyKg: effect.payload.honeyKg,
        },
      };

    case 'SAVE_INSPECTION':
      return {
        type: 'STOP_INSPECTION',
        hiveNumber: effect.payload.hiveNumber,
      };

    default:
      return null;
  }
}
