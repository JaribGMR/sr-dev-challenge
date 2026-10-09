import { Order } from '../entities/order';

export const ORDER_REPOSITORY = 'OrderRepository';

export interface OrderRepository {
  findById(id: string): Promise<Order | null>;
  findByDistributor(distributorId: string): Promise<Order[]>;
  save(order: Order): Promise<void>;
}
