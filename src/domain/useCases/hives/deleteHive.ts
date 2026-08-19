import {HiveRepository} from '../../../persistence/hiveRepository';
import {HiveContextRepository} from '../../../persistence/hiveContextRepository';
import {TaskRepository} from '../../repositories/taskRepository';
import {markHiveDeleted} from '../../../sync/deletedHives';

export async function deleteHive(
  uid: string,
  hiveNumber: number,
): Promise<void> {
  const hiveRepository = new HiveRepository();
  const contextRepository = new HiveContextRepository();
  const taskRepository = new TaskRepository();

  // --------------------------------------------------
  // LOCAL HIVE
  // --------------------------------------------------

  await hiveRepository.delete(hiveNumber);

  // --------------------------------------------------
  // LOCAL CONTEXT
  // --------------------------------------------------

  await contextRepository.deleteByHiveNumber(hiveNumber);

  // --------------------------------------------------
  // LOCAL TASKS
  // --------------------------------------------------

  await taskRepository.deleteByHiveNumber(uid, hiveNumber);

  // --------------------------------------------------
  // CLOUD DELETE MARKER
  // --------------------------------------------------

  await markHiveDeleted(hiveNumber);

  console.log('🗑️ HIVE LOCAL CLEANUP DONE:', hiveNumber);
}
