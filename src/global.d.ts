declare module 'node-record-lpcm16' {
  interface RecordOptions {
    sampleRateHertz?: number;
    threshold?: number;
    silence?: string | number;
    recordProgram?: string;
    verbose?: boolean;
  }

  interface Recording {
    stream(): NodeJS.ReadableStream;
    stop(): void;
  }

  const record: {
    record(options?: RecordOptions): Recording;
  };

  export default record;
}
