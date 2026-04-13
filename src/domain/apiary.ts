export interface ApiarySummary {
  totalHives: number;
  noInspectionCount: number;
  needsFeedingCount: number;
  problemHivesCount: number;
}

export type ApiaryCategory = 'ALL' | 'NO_INSPECTION' | 'FEEDING' | 'PROBLEMS';
