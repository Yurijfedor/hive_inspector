import {PorcupineManager} from '@picovoice/porcupine-react-native';
import {RhinoManager} from '@picovoice/rhino-react-native';

const NUMBER_MAP = {
  zero: '0',
  one: '1',
  two: '2',
  three: '3',
  four: '4',
  five: '5',
  six: '6',
  seven: '7',
  eight: '8',
  nine: '9',
  ten: '10',
  'one two': '12',
};

const ACCESS_KEY = 'cpqxgiTZb2iwT+o4OV1eURostH1Z993FkSqytpvhrIKaNVbHC0PCug==';

export class VoiceHandler {
  constructor() {
    this.porcupineManager = null;
    this.rhinoManager = null;
    this.onWakeWordDetected = null;
    this.onInference = null;
    this.isListeningForContext = false;
    this.hiveIdBuffer = ''; // Буфер для накопичення цифр
    this.idTimer = null; // Таймер для завершення введення номера
  }

  async init(onWakeWordDetected, onInference) {
    this.onWakeWordDetected = onWakeWordDetected;
    this.onInference = onInference;

    try {
      this.porcupineManager = await PorcupineManager.fromBuiltInKeywords(
        ACCESS_KEY,
        ['bumblebee'],
        () => {
          console.log('Wake word detected');
          this.onWakeWordDetected();
          this.isListeningForContext = true;

          this.porcupineManager
            .stop()
            .then(() => {
              setTimeout(() => {
                console.log('Starting Rhino process');
                this.rhinoManager.process().catch(error => {
                  console.error(
                    'Rhino process error:',
                    error.message,
                    error.stack,
                  );
                  this.resetToPorcupine();
                });
              }, 1000);
            })
            .catch(error => {
              console.error(
                'Porcupine stop error:',
                error.message,
                error.stack,
              );
              this.resetToPorcupine();
            });
        },
        error => {
          console.error('Porcupine error:', error.message, error.stack);
          this.resetToPorcupine();
        },
      );

      this.rhinoManager = await RhinoManager.create(
        ACCESS_KEY,
        'hiveData_android.rhn', // Оновлено назву контексту
        inference => {
          console.log(
            'Raw Rhino inference:',
            JSON.stringify(inference, null, 2),
          );
          let processedInference = {...inference, intent: null, slots: {}};

          if (inference._isUnderstood) {
            if ('id' in inference.slots) {
              processedInference.intent = 'id';
              const digit = NUMBER_MAP[inference.slots.id] || '';
              this.hiveIdBuffer += digit;
              processedInference.slots.hiveId = this.hiveIdBuffer;
              processedInference.slots.id = digit;

              if (this.hiveIdBuffer.length >= 4) {
                processedInference.slots.final = true;
                this.onInference(processedInference);
                this.hiveIdBuffer = '';
                if (this.idTimer) {
                  clearTimeout(this.idTimer);
                }
                this.resetToPorcupine();
              } else {
                this.onInference(processedInference);
                if (this.idTimer) {
                  clearTimeout(this.idTimer);
                }
                this.idTimer = setTimeout(() => {
                  if (this.hiveIdBuffer) {
                    this.onInference({
                      intent: 'id',
                      slots: {hiveId: this.hiveIdBuffer, final: true},
                    });
                    this.hiveIdBuffer = '';
                    this.resetToPorcupine();
                  }
                }, 10000);
                setTimeout(() => {
                  this.rhinoManager.process().catch(error => {
                    console.error(
                      'Rhino process error:',
                      error.message,
                      error.stack,
                    );
                    this.resetToPorcupine();
                  });
                }, 1000);
              }
            } else if ('box' in inference.slots) {
              processedInference.intent = 'box';
              processedInference.slots.box = inference.slots.box;
              this.hiveIdBuffer = '';
              if (this.idTimer) {
                clearTimeout(this.idTimer);
              }
              this.onInference(processedInference);
              this.resetToPorcupine();
            } else if ('bread' in inference.slots) {
              processedInference.intent = 'bread';
              processedInference.slots.bread = inference.slots.bread;
              this.hiveIdBuffer = '';
              if (this.idTimer) {
                clearTimeout(this.idTimer);
              }
              this.onInference(processedInference);
              this.resetToPorcupine();
            } else if ('color' in inference.slots) {
              processedInference.intent = 'color';
              processedInference.slots.color = inference.slots.color;
              this.hiveIdBuffer = '';
              if (this.idTimer) {
                clearTimeout(this.idTimer);
              }
              this.onInference(processedInference);
              this.resetToPorcupine();
            } else if ('state' in inference.slots) {
              processedInference.intent = 'state';
              processedInference.slots.state = inference.slots.state;
              this.hiveIdBuffer = '';
              if (this.idTimer) {
                clearTimeout(this.idTimer);
              }
              this.onInference(processedInference);
              this.resetToPorcupine();
            } else if ('strengt' in inference.slots) {
              processedInference.intent = 'strength';
              processedInference.slots.strength = inference.slots.strengt;
              this.hiveIdBuffer = '';
              if (this.idTimer) {
                clearTimeout(this.idTimer);
              }
              this.onInference(processedInference);
              this.resetToPorcupine();
            } else if ('QueenStatus' in inference.slots) {
              processedInference.intent = 'queen';
              processedInference.slots.QueenStatus =
                inference.slots.QueenStatus;
              this.hiveIdBuffer = '';
              if (this.idTimer) {
                clearTimeout(this.idTimer);
              }
              this.onInference(processedInference);
              this.resetToPorcupine();
            } else if ('honey' in inference.slots) {
              processedInference.intent = 'honey';
              processedInference.slots.honey = inference.slots.honey;
              this.hiveIdBuffer = '';
              if (this.idTimer) {
                clearTimeout(this.idTimer);
              }
              this.onInference(processedInference);
              this.resetToPorcupine();
            } else if ('endRecording' in inference.slots) {
              processedInference.intent = 'stop';
              this.hiveIdBuffer = '';
              if (this.idTimer) {
                clearTimeout(this.idTimer);
              }
              this.onInference(processedInference);
              this.resetToPorcupine();
            }
          } else {
            this.onInference(processedInference);
            this.resetToPorcupine();
          }
        },
        error => {
          console.error('Rhino error:', error.message, error.stack);
          this.resetToPorcupine();
        },
      );

      console.log('VoiceHandler initialized');
    } catch (error) {
      console.error('VoiceHandler init error:', error.message, error.stack);
      throw error;
    }
  }

  async resetToPorcupine() {
    try {
      if (this.isListeningForContext) {
        this.isListeningForContext = false;
        console.log('Resetting to Porcupine');
        await this.porcupineManager.start();
      }
    } catch (error) {
      console.error('Reset error:', error.message, error.stack);
    }
  }

  async start() {
    try {
      console.log(
        'Audio stream state:',
        this.isListeningForContext ? 'Rhino' : 'Porcupine',
      );
      if (!this.isListeningForContext) {
        await this.porcupineManager.start();
        console.log('PorcupineManager started');
      }
    } catch (error) {
      console.error('Start error:', error.message, error.stack);
      this.resetToPorcupine();
    }
  }

  async stop() {
    try {
      if (this.porcupineManager) {
        await this.porcupineManager.stop();
        await this.porcupineManager.delete();
      }
      if (this.rhinoManager) {
        await this.rhinoManager.delete();
      }
      this.isListeningForContext = false;
      this.hiveIdBuffer = '';
      if (this.idTimer) {
        clearTimeout(this.idTimer);
      }
      console.log('VoiceHandler stopped');
    } catch (error) {
      console.error('Stop error:', error.message, error.stack);
    }
  }
}
