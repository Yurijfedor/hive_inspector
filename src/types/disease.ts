import {DISEASE_TYPES} from '../domain/constants/disease';

export type DiseaseType = (typeof DISEASE_TYPES)[keyof typeof DISEASE_TYPES];
