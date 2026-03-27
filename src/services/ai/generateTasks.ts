import {getFunctions, httpsCallable} from 'firebase/functions';
import {app} from '../../firebase/firebaseApp';

import {Inspection} from '../../types/inspection';
import {Task} from '../../types/task';
import {loadInspections} from '../../persistence/inspectionRepository';
import {TaskRepository} from '../../domain/repositories/taskRepository';

const functions = getFunctions(app, 'us-central1');

const taskRepository = new TaskRepository();

export const generateTasks = async (
  inspections: Inspection[],
): Promise<{tasks: Task[]}> => {
  const fn = httpsCallable(functions, 'generateTasks');

  const result = await fn({inspections});

  return result.data as {tasks: Task[]};
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
  const merged = await taskRepository.mergeFromAI(uid, result.tasks);

  return merged;
};
