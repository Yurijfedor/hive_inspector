import {SwarmEvent} from '../events/swarmEvents';
import {saveSwarm} from '../repositories/swarmRepository';

import {TaskRepository} from '../repositories/taskRepository';
import {autoCompleteTasks} from '../tasks/autoCompleteTasks';

export type SwarmEffectResult =
  | {
      kind: 'SWARM_UPDATED';
      hiveNumber: number;
    }
  | {
      kind: 'SWARM_STOPPED';
      hiveNumber: number;
    };

const taskRepo = new TaskRepository();

export async function handleSwarmEffect(
  uid: string,
  event: SwarmEvent,
): Promise<SwarmEffectResult> {
  switch (event.type) {
    case 'UPDATE_SWARM':
      await saveSwarm(uid, {
        hiveNumber: event.hiveNumber,
        ...event.payload,
      });

      // 🔥 AUTO COMPLETE TASKS
      try {
        const tasks = await taskRepo.getAll();

        const updated = autoCompleteTasks(tasks, event.hiveNumber, 'SWARM');

        const hasChanges = updated.some((t, i) => t !== tasks[i]);

        if (hasChanges) {
          await taskRepo.saveAll(uid, updated);
          console.log('✅ SWARM → tasks auto-completed');
        } else {
          console.log('ℹ️ SWARM → no tasks to complete');
        }
      } catch (e) {
        console.log('❌ AUTO COMPLETE FAILED', e);
      }

      return {
        kind: 'SWARM_UPDATED',
        hiveNumber: event.hiveNumber,
      };

    case 'STOP_SWARM':
      return {
        kind: 'SWARM_STOPPED',
        hiveNumber: event.hiveNumber,
      };
  }
}
