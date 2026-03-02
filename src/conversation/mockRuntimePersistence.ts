import {RuntimePersistence} from './runtimePersistence';
import {RuntimeState} from './types';

export type RuntimeSnapshot = RuntimeState;

export class MockRuntimePersistence implements RuntimePersistence {
  private snapshot: RuntimeSnapshot | null = null;

  onSave?: (snapshot: RuntimeSnapshot) => void;

  async save(snapshot: RuntimeSnapshot) {
    console.log('💾 SAVE SNAPSHOT:', snapshot);

    this.snapshot = snapshot;

    // ⭐ test hook
    this.onSave?.(snapshot);
  }

  async load() {
    console.log('📂 LOAD SNAPSHOT');
    return this.snapshot;
  }

  async clear() {
    console.log('🧹 CLEAR SNAPSHOT');
    this.snapshot = null;
  }
}
