declare module 'node-record-lpcm16' {
  interface RecordOptions {
    sampleRateHertz?: number;
    threshold?: number;
    silence?: string | number;
    recordProgram?: 'sox' | 'arecord' | 'rec';
    verbose?: boolean;
  }

  interface Recording {
    stream(): NodeJS.ReadableStream;
    stop(): void;
  }

  function record(options?: RecordOptions): Recording;

  export default {
    record,
  };
}
