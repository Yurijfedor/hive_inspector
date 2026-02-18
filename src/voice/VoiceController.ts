import {setVoiceState} from '../state/voiceStateMachine';
// import {transcribe} from '../voice/stt/transcribe';
// import {parseInspection} from '../voice/llm/parseInspection';
// import {handleInspection} from '../actions/handleInspection';
// import {handleInspectionEffect} from '../effects/inspectionEffectHandler';
// import {buildInspectionFeedback} from '../feedback/buildInspectionFeedback';

// export async function handleVoiceInput(audioPath: string) {
//   if (getVoiceState().type !== 'IDLE') {
//     console.log('⚠️ Busy, ignoring input');
//     return;
//   }

//   try {
//     setVoiceState({type: 'LISTENING'});

//     setVoiceState({type: 'PROCESSING'});

//     const text = await transcribe(audioPath);
//     const command = await parseInspection(text);
//     const event = await handleInspection(command);
//     const result = await handleInspectionEffect(event);
//     const feedback = buildInspectionFeedback(result);

//     setVoiceState({
//       type: 'CONFIRM',
//       pendingCommand: command,
//       feedback,
//     });
//   } catch (e: any) {
//     setVoiceState({
//       type: 'ERROR',
//       message: e.message ?? 'Unknown error',
//     });
//   }
// }

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
