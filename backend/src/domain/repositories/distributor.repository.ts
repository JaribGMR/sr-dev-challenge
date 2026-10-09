import { Distributor } from '../entities/distributor';

export const DISTRIBUTOR_REPOSITORY = 'DistributorRepository';

export interface DistributorRepository {
  findById(id: string): Promise<Distributor | null>;
}
