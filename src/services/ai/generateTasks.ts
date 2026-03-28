// import {getFunctions} from 'firebase/functions';
// import {app} from '../../firebase/firebaseApp';

import {Inspection} from '../../types/inspection';
import {Task} from '../../types/task';
import {loadInspections} from '../../persistence/inspectionRepository';
import {TaskRepository} from '../../domain/repositories/taskRepository';
import {mapLLMTasksToDomain} from './mapTasks';

// const functions = getFunctions(app, 'us-central1');

const taskRepository = new TaskRepository();

export const generateTasks = async (
  inspections: Inspection[],
): Promise<{tasks: Task[]}> => {
  try {
    console.log('🤖 CALLING AI (fetch)...', inspections);

    const res = await fetch(
      'https://us-central1-hiveinspector-613f8.cloudfunctions.net/generateTasksHttp',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({inspections}),
      },
    );

    if (!res.ok) {
      throw new Error(`HTTP ERROR: ${res.status}`);
    }

    const data = await res.json();

    console.log('✅ AI RESPONSE:', data);

    return data; // { tasks: [...] }
  } catch (e) {
    console.error('💥 AI FETCH ERROR:', e);
    throw e;
  }
};

export const generateTasksForApiary = async (uid: string) => {
  const tasks = await taskRepository.getAll();
  const inspections = await loadInspections(uid);

  const hives = [...new Set(inspections.map((i) => i.hiveNumber))];

  const inspectionsToSend: Inspection[] = [];

  for (const hiveNumber of hives) {
    const hasActive = tasks.some(
      (t) => t.hiveNumber === hiveNumber && !t.completed,
    );

    if (hasActive) continue;

    const latest = inspections
      .filter((i) => i.hiveNumber === hiveNumber)
      .sort((a, b) => b.date - a.date)[0];

    if (!latest) continue;

    inspectionsToSend.push(latest);
  }

  if (inspectionsToSend.length === 0) {
    console.log('✅ NO NEED TO GENERATE TASKS');
    return [];
  }

  console.log('🤖 GENERATING TASKS...', inspectionsToSend);

  const result = await generateTasks(inspectionsToSend);

  // 🔥 ВАЖЛИВО — ЗБЕРІГАЄМО ЧЕРЕЗ REPOSITORY
  // const merged = await taskRepository.mergeFromAI(uid, result.tasks);

  console.log('🔥 RAW AI RESULT:', result);
  console.log('🔥 TASKS:', result?.tasks);
  const mappedTasks = mapLLMTasksToDomain(result);

  const merged = await taskRepository.mergeFromAI(uid, mappedTasks);

  return merged;
};

export const generateTasksForHive = async (uid: string, hiveNumber: number) => {
  const inspections = await loadInspections(uid);

  const latest = inspections
    .filter((i) => i.hiveNumber === hiveNumber)
    .sort((a, b) => b.date - a.date)[0];

  if (!latest) {
    console.log('❌ NO INSPECTION FOR HIVE');
    return [];
  }

  console.log('🤖 GENERATING TASKS FOR HIVE...', latest);

  const result = await generateTasks([latest]); // 👈 КЛЮЧ

  const mappedTasks = mapLLMTasksToDomain(result);

  const merged = await taskRepository.mergeFromAI(uid, mappedTasks);

  return merged;
};
