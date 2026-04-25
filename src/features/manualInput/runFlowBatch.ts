import {ConversationDriver} from '../../conversation/driver/conversationDriver';
import {runSingleFlow} from './runSingleFlow';
import {InspectionFormUI} from './types';

export async function runFlowBatch(
  driver: ConversationDriver,
  hiveNumber: number,
  data: InspectionFormUI,
) {
  // -------------------------------
  // 🔥 NORMALIZE DATA
  // -------------------------------
  const normalized = mapFormToFlowData(data);

  // -------------------------------
  // 🔥 INSPECTION (always)
  // -------------------------------
  await runSingleFlow(driver, 'inspection', hiveNumber, normalized);

  // -------------------------------
  // 🔥 SWARM
  // -------------------------------
  if (data.swarm) {
    await runSingleFlow(driver, 'swarm', hiveNumber, normalized);
  }

  // -------------------------------
  // 🔥 DISEASE
  // -------------------------------
  if (data.disease) {
    await runSingleFlow(driver, 'disease', hiveNumber, normalized);
  }

  // -------------------------------
  // 🔥 SPLIT
  // -------------------------------
  if (data.split) {
    await runSingleFlow(driver, 'split', hiveNumber, normalized);
  }

  // -------------------------------
  // 🔥 FINALIZE (як driver)
  // -------------------------------
  (driver as any).state = {mode: 'IDLE'};
  await (driver as any).persistence.clear();

  (driver as any).bus.emit({
    type: 'SYSTEM_SPEAK',
    text: 'Готовий до нової команди.',
  });

  (driver as any).bus.emit({type: 'CONVERSATION_FINISHED'});
}

function mapFormToFlowData(data: InspectionFormUI) {
  const inspection = data.inspection;
  const swarm = data.swarm;
  const disease = data.disease;
  const split = data.split;

  return {
    // -------------------------
    // 🟢 INSPECTION
    // -------------------------
    STRENGTH: inspection?.strength,
    BROOD: inspection?.broodFrames,
    HONEY: inspection?.honeyKg,

    QUEEN: inspection?.queen,
    QUEEN_BREED: inspection?.queenBreed,
    QUEEN_YEAR: inspection?.queenYear,

    // -------------------------
    // 🟡 SWARM (розкладаємо!)
    // -------------------------
    QUEEN_EMERGENCE: swarm?.queenEmergence,
    SEALED_CELLS: swarm?.sealedCells,
    OPEN_CELLS: swarm?.openCells,
    EGGS_IN_CELLS: swarm?.eggsInCells,

    // -------------------------
    // 🟡 DISEASE
    // -------------------------
    DIARRHEA: disease?.diarrhea,
    DEFORMED_WINGS: disease?.deformedWings,
    MITES_VISIBLE: disease?.mitesVisible,
    WEAK_BROOD: disease?.weakBrood,

    // -------------------------
    // 🟡 SPLIT
    // -------------------------
    IS_SPLIT: split?.isSplit,
    USED_FOR_SPLITS: split?.usedForSplits,
    SPLIT_BROOD_FRAMES: split?.broodFrames,
    SPLIT_FOOD_FRAMES: split?.foodFrames,
  };
}
