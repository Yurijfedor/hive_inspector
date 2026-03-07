import {RuntimePersistence} from '../conversation/runtimePersistence';
import {RuntimeState} from '../conversation/types';

export class HybridRuntimePersistence implements RuntimePersistence {
  constructor(
    private local: RuntimePersistence,
    private cloud: RuntimePersistence,
  ) {}

  async save(snapshot: RuntimeState) {
    await this.local.save(snapshot);

    // cloud backup (не блокує runtime)
    this.cloud.save(snapshot).catch(console.error);
  }

  async load(): Promise<RuntimeState | null> {
    const local = await this.local.load();

    if (local) {
      console.log('⚡ runtime loaded from LOCAL');
      return local;
    }

    try {
      const cloud = await Promise.race([
        this.cloud.load(),
        new Promise<null>(resolve => setTimeout(() => resolve(null), 500)),
      ]);

      if (cloud) {
        console.log('☁️ runtime restored from CLOUD');
        await this.local.save(cloud);
        return cloud;
      }
    } catch (e) {
      console.log('⚠️ CLOUD LOAD FAILED');
    }

    return null;
  }

  async clear() {
    await this.local.clear();
    await this.cloud.clear();
  }
}
