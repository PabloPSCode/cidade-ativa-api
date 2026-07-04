import { Neighborhood } from '../entities/Neighborhood.js';

export interface INeighborhoodRepository {
  list(cityName?: string, cityId?: string): Promise<Neighborhood[]>;
}
