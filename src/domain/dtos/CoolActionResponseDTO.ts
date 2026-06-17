import { CoolActionCategory } from '../entities/CoolAction.js';

export interface CoolActionResponseDTO {
  id: string;
  title: string;
  category: CoolActionCategory;
  points: number;
  createdAt: Date;
}
