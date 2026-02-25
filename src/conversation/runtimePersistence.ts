import {RuntimeSnapshot} from './runtimeSnapshot';

export interface RuntimePersistence {
  save(snapshot: RuntimeSnapshot): Promise<void>;
  load(): Promise<RuntimeSnapshot | null>;
  clear(): Promise<void>;
}
