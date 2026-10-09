import { InvalidGallonsError } from '../errors/invalid-gallons.error';
import { MinimumGallonsError } from '../errors/minimum-gallons.error';

export const MINIMUM_GALLONS_PER_LINE = 500;
export class OrderLine {
  readonly product: string;
  readonly gallons: number;
  readonly unitPriceCents: number;

  constructor(product: string, gallons: number, unitPriceCents: number) {
    const hasDecimals = !Number.isInteger(gallons);
    if (hasDecimals) {
      throw new InvalidGallonsError(gallons);
    }

    const isBelowMinimum = gallons < MINIMUM_GALLONS_PER_LINE;
    if (isBelowMinimum) {
      throw new MinimumGallonsError(gallons, MINIMUM_GALLONS_PER_LINE);
    }

    this.product = product;
    this.gallons = gallons;
    this.unitPriceCents = unitPriceCents;
  }

  getSubtotalPay(): number {
    return this.gallons * this.unitPriceCents;
  }
}
