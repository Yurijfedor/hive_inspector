import {setVoiceState} from '../state/voiceStateMachine';

export async function handleVoiceInputMock() {
  try {
    setVoiceState({type: 'LISTENING'});

    await delay(300);

    setVoiceState({type: 'PROCESSING'});

    await delay(300);

    const fakeCommand = {hiveNumber: 5, strength: 7};
    const fakeFeedback = 'Вулик 5. Сила 7. Записано.';

    setVoiceState({
      type: 'CONFIRM',
      pendingCommand: fakeCommand,
      feedback: fakeFeedback,
    });
  } catch (e: any) {
    setVoiceState({
      type: 'ERROR',
      message: e.message,
    });
  }
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
