import { CoolActionCategory } from '../entities/CoolAction.js';

export interface CreateCoolActionDTO {
  title: string;
  category: CoolActionCategory;
  points: number;
}
