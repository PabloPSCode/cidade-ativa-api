import { CoolActionCategory } from '../entities/CoolAction.js';

export interface UpdateCoolActionDTO {
  title?: string;
  category?: CoolActionCategory;
  points?: number;
}
