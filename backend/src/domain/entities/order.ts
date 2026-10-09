import { DeliveryTooSoonError } from '../errors/delivery-too-soon.error';
import { DuplicateProductError } from '../errors/duplicate-product.error';
import { InvalidLineCountError } from '../errors/invalid-line-count.error';
import { MaximumGallonsError } from '../errors/maximum-gallons.error';
import { SundayDeliveryError } from '../errors/sunday-delivery.error';
import { OrderLine } from './order-line';
import { OrderStatus } from './order-status';

export const MAXIMUM_LINES_PER_ORDER = 4;
export const MAXIMUM_GALLONS_PER_ORDER = 9000;
export const MINIMUM_HOURS_BEFORE_DELIVERY = 24;

const DOMINICAN_HOURS_BEHIND_UTC = 4;
const MILLISECONDS_PER_HOUR = 60 * 60 * 1000;
const SUNDAY = 0;

export class Order {
  readonly id: string;
  readonly distributor: string;
  readonly lines: OrderLine[];
  readonly deliveryDate: Date;
  readonly createdAt: Date;
  readonly status: OrderStatus;

  constructor(
    id: string,
    distributor: string,
    lines: OrderLine[], //Recip a array of Line
    deliveryDate: Date,
    createdAt: Date,
  ) {
    if (lines.length === 0 || lines.length > MAXIMUM_LINES_PER_ORDER) {
      throw new InvalidLineCountError(lines.length, MAXIMUM_LINES_PER_ORDER);
    }

    //1. Un pedido tiene entre 1 y 4 líneas, sin productos repetidos.
    const productsAlreadySeen: string[] = [];
    for (const line of lines) {
      const isRepeated = productsAlreadySeen.includes(line.productId);
      if (isRepeated) {
        throw new DuplicateProductError(line.productId);
      }
      productsAlreadySeen.push(line.productId);
    }

    //2. El pedido completo no puede superar 9,000 galones (capacidad de un camión).
    let totalGallons = 0;
    for (const line of lines) {
      totalGallons = totalGallons + line.gallons;
    }
    if (totalGallons > MAXIMUM_GALLONS_PER_ORDER) {
      throw new MaximumGallonsError(totalGallons, MAXIMUM_GALLONS_PER_ORDER);
    }

    //3. La fecha de entrega debe ser al menos 24 horas después de la creación
    const millisecondsUntilDelivery =
      deliveryDate.getTime() - createdAt.getTime();
    const hoursUntilDelivery =
      millisecondsUntilDelivery / MILLISECONDS_PER_HOUR;
    if (hoursUntilDelivery < MINIMUM_HOURS_BEFORE_DELIVERY) {
      throw new DeliveryTooSoonError(MINIMUM_HOURS_BEFORE_DELIVERY);
    }

    // 4. no puede ser domingo.
    const deliveryInDominicanTime = new Date(
      deliveryDate.getTime() -
        DOMINICAN_HOURS_BEHIND_UTC * MILLISECONDS_PER_HOUR,
    );
    const dayOfWeek = deliveryInDominicanTime.getUTCDay();
    if (dayOfWeek === SUNDAY) {
      throw new SundayDeliveryError();
    }

    this.id = id;
    this.distributor = distributor;
    this.lines = lines;
    this.deliveryDate = deliveryDate;
    this.createdAt = createdAt;

    this.status = OrderStatus.Pending;
  }

  getTotalGallons(): number {
    let totalGallons = 0;
    for (const line of this.lines) {
      totalGallons = totalGallons + line.gallons;
    }
    return totalGallons;
  }

  getTotalPay(): number {
    let totalPay = 0;
    for (const line of this.lines) {
      totalPay = totalPay + line.getSubtotalPay();
    }
    return totalPay;
  }
}
