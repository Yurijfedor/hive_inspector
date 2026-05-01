import {Inspection} from '../../types/inspection';

export type ApiaryPoint = {
  date: string;
  avgStrength: number;
  avgHoney: number;
  avgBroodFrames: number;
};

const groupByHive = (inspections: Inspection[]) => {
  const map: Record<number, Inspection[]> = {};

  for (const i of inspections) {
    if (!map[i.hiveNumber]) {
      map[i.hiveNumber] = [];
    }
    map[i.hiveNumber].push(i);
  }

  for (const hive in map) {
    map[hive].sort((a, b) => a.date - b.date);
  }

  return map;
};

const getAllDates = (inspections: Inspection[]) => {
  const set = new Set<string>();

  inspections.forEach((i) => {
    set.add(new Date(i.date).toDateString());
  });

  return Array.from(set).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime(),
  );
};

export const buildApiaryDynamics = (
  inspections: Inspection[],
): ApiaryPoint[] => {
  const byHive = groupByHive(inspections);
  const dates = getAllDates(inspections);

  const result: ApiaryPoint[] = [];

  for (const dateStr of dates) {
    const date = new Date(dateStr).getTime();

    let totalStrength = 0;
    let totalHoney = 0;
    let totalBrood = 0;

    let count = 0;
    let broodCount = 0;

    for (const hive in byHive) {
      const hiveInspections = byHive[hive];

      const last = hiveInspections.filter((i) => i.date <= date).pop();

      if (!last) continue;

      totalStrength += last.strength ?? 0;
      totalHoney += last.honeyKg ?? 0;

      if (last.broodFrames !== undefined && last.broodFrames !== null) {
        totalBrood += last.broodFrames;
        broodCount++;
      }

      count++;
    }

    if (count === 0) continue;

    result.push({
      date: dateStr,
      avgStrength: Math.round(totalStrength / count),
      avgHoney: Math.round(totalHoney / count),
      avgBroodFrames: broodCount > 0 ? Math.round(totalBrood / broodCount) : 0,
    });
  }

  return result;
};

export type ApiaryStatus = 'good' | 'warning' | 'critical';

export const getApiaryStatus = (points: ApiaryPoint[]): ApiaryStatus => {
  if (points.length < 2) return 'good';

  const last = points[points.length - 1];
  const prev = points[points.length - 2];

  const diff = last.avgStrength - prev.avgStrength;

  if (diff <= -3) return 'critical';
  if (diff < 0) return 'warning';

  return 'good';
};
