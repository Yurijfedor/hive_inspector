import {RuntimePersistence} from './runtimePersistence';
import {RuntimeState} from './types';

export class InMemoryRuntimePersistence implements RuntimePersistence {
  private state: RuntimeState | null = null;

  async save(snapshot: RuntimeState): Promise<void> {
    this.state = snapshot;
  }

  async load(): Promise<RuntimeState | null> {
    return this.state;
  }

  async clear(): Promise<void> {
    this.state = null;
  }
}
