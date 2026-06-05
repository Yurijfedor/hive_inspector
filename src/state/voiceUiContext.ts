export type VoiceUiContext = {
  currentStep: number;
  totalSteps: number;
};

let context: VoiceUiContext = {
  currentStep: 0,
  totalSteps: 0,
};

const listeners = new Set<(ctx: VoiceUiContext) => void>();

export function getVoiceUiContext() {
  return context;
}

export function setVoiceUiContext(next: VoiceUiContext) {
  context = next;

  listeners.forEach((listener) => listener(next));
}

export function subscribeVoiceUiContext(
  listener: (ctx: VoiceUiContext) => void,
) {
  listeners.add(listener);

  return () => listeners.delete(listener);
}
