export type VoiceAdapter = {
  listen(): Promise<string>;
  speak(text: string): Promise<void>;
};
