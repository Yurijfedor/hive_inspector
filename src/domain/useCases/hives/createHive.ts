import {HiveRepository} from '../../../persistence/hiveRepository';

export async function createHive(uid: string, hiveNumber: number) {
  const repository = new HiveRepository();

  await repository.create({
    hiveNumber,
    createdAt: Date.now(),
  });

  console.log('🐝 HIVE CREATED LOCALLY:', hiveNumber);
}
