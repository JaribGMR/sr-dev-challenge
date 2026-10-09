import { Order } from '../../../domain/entities/order';
import { OrderRepository } from '../../../domain/repositories/order.repository';

export class InMemoryOrderRepository implements OrderRepository {
  orders: Order[] = [];

  findById(id: string): Promise<Order | null> {
    for (const order of this.orders) {
      if (order.id === id) {
        return Promise.resolve(order);
      }
    }
    return Promise.resolve(null);
  }

  findByDistributor(distributorId: string): Promise<Order[]> {
    const ordersOfDistributor: Order[] = [];
    for (const order of this.orders) {
      if (order.distributor === distributorId) {
        ordersOfDistributor.push(order);
      }
    }
    return Promise.resolve(ordersOfDistributor);
  }

  save(order: Order): Promise<void> {
    // Replace the order if it is already in the list, otherwise add it
    const ordersWithoutThisOne: Order[] = [];
    for (const savedOrder of this.orders) {
      if (savedOrder.id !== order.id) {
        ordersWithoutThisOne.push(savedOrder);
      }
    }
    ordersWithoutThisOne.push(order);
    this.orders = ordersWithoutThisOne;

    return Promise.resolve();
  }
}
