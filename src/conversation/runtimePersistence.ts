import {RuntimeState} from './types';

export interface RuntimePersistence {
  save(snapshot: RuntimeState): Promise<void>;
  load(): Promise<RuntimeState | null>;
  clear(): Promise<void>;
}
