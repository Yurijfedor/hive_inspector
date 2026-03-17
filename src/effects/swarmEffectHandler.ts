import {SwarmEvent} from '../actions/swarmEvents';
import {saveSwarm} from '../persistence/swarmRepository';
import {SwarmEffectResult} from './types';

export async function handleSwarmEffect(
  uid: string,
  event: SwarmEvent,
): Promise<SwarmEffectResult> {
  switch (event.type) {
    case 'RECORD_SWARM': {
      const command = {
        hiveNumber: event.hiveNumber,
        hasSwarmSigns: event.payload?.hasSwarmSigns,
        hasQueenCells: event.payload?.hasQueenCells,
        queenCellsCount: event.payload?.queenCellsCount,
      };

      await saveSwarm(uid, command);

      return {
        kind: 'RECORDED',
        hiveNumber: event.hiveNumber,
        payload: {
          hasSwarmSigns: command.hasSwarmSigns ?? null,
          hasQueenCells: command.hasQueenCells ?? null,
          queenCellsCount: command.queenCellsCount ?? null,
        },
      };
    }
  }
}
