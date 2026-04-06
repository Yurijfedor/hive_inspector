// import {getFunctions} from 'firebase/functions';
// import {app} from '../../firebase/firebaseApp';

// import {Inspection} from '../../types/inspection';
import {Task} from '../../types/task';
import {
  // loadInspections,
  loadHiveContextsFromFirebase,
} from '../../persistence/inspectionRepository';
import {TaskRepository} from '../../domain/repositories/taskRepository';
import {mapLLMTasksToDomain} from './mapTasks';

// const functions = getFunctions(app, 'us-central1');

const taskRepository = new TaskRepository();

export const generateTasks = async (hives: any[]): Promise<{tasks: Task[]}> => {
  try {
    console.log('🤖 CALLING AI (fetch)...', hives);

    const res = await fetch(
      'https://us-central1-hiveinspector-613f8.cloudfunctions.net/generateTasksHttp',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({hives}),
      },
    );

    if (!res.ok) {
      throw new Error(`HTTP ERROR: ${res.status}`);
    }

    const data = await res.json();

    console.log('✅ AI RESPONSE:', data);

    return data;
  } catch (e) {
    console.error('💥 AI FETCH ERROR:', e);
    throw e;
  }
};

export const generateTasksForApiary = async (uid: string) => {
  const tasks = await taskRepository.getAll();
  const hives = await loadHiveContextsFromFirebase(uid);

  const hivesToSend = [];

  for (const hive of hives) {
    const hasActive = tasks.some(
      (t) => t.hiveNumber === hive.hiveNumber && !t.completed,
    );

    if (hasActive) continue;

    hivesToSend.push(hive);
  }

  if (hivesToSend.length === 0) {
    console.log('✅ NO NEED TO GENERATE TASKS');
    return [];
  }

  console.log('🤖 GENERATING TASKS...', hivesToSend);

  const result = await generateTasks(hivesToSend);

  const mappedTasks = mapLLMTasksToDomain(result);

  const merged = await taskRepository.mergeFromAI(uid, mappedTasks);

  return merged;
};

export const generateTasksForHive = async (uid: string, hiveNumber: number) => {
  const hives = await loadHiveContextsFromFirebase(uid);

  const hive = hives.find((h) => h.hiveNumber === hiveNumber);

  if (!hive) {
    console.log('❌ NO HIVE CONTEXT');
    return [];
  }

  console.log('🤖 GENERATING TASKS FOR HIVE...', hive);

  const result = await generateTasks([hive]); // 🔥 тепер передаємо контекст

  const mappedTasks = mapLLMTasksToDomain(result);

  const merged = await taskRepository.mergeFromAI(uid, mappedTasks);

  return merged;
};
