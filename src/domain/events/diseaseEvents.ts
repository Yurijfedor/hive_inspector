export type DiseaseEvent =
  | {
      type: 'UPDATE_DISEASE';
      hiveNumber: number;
      payload: {
        disease?:
          | 'NOSEMA'
          | 'VARROA'
          | 'VARROA_OR_DWV'
          | 'BROOD_DISEASE'
          | 'NONE'; // 👈 ДОДАТИ
        diarrhea?: boolean;
        deformedWings?: boolean;
        mitesVisible?: boolean;
        weakBrood?: boolean;
      };
    }
  | {
      type: 'STOP_DISEASE';
      hiveNumber: number;
    };
