import {SwarmEvent} from '../events/swarmEvents';
import {saveSwarm} from '../repositories/swarmRepository';

export type SwarmEffectResult =
  | {
      kind: 'SWARM_UPDATED';
      hiveNumber: number;
    }
  | {
      kind: 'SWARM_STOPPED';
      hiveNumber: number;
    };

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
