import { Neighborhood } from '../entities/Neighborhood.js';

export interface INeighborhoodRepository {
  list(cityName?: string): Promise<Neighborhood[]>;
}
