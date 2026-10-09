import { Distributor } from '../../../domain/entities/distributor';
import { DistributorRepository } from '../../../domain/repositories/distributor.repository';

export class InMemoryDistributorRepository implements DistributorRepository {
  distributors: Distributor[] = [];

  findById(id: string): Promise<Distributor | null> {
    for (const distributor of this.distributors) {
      if (distributor.id === id) {
        return Promise.resolve(distributor);
      }
    }
    return Promise.resolve(null);
  }
}
