// tslint:disable:max-classes-per-file
import { BigNumber } from 'bignumber.js'

export class CreateOrderMsg {
  public readonly Originator: string
  public readonly Pair: string
  public readonly Side: string
  public readonly Quantity: string
  public readonly Price: string

  constructor({
    originator,
    pair,
    side,
    quantity,
    price,
  }) {
    this.Originator = originator
    this.Pair = pair
    this.Side = side
    this.Quantity = quantity
    this.Price = new BigNumber(price).toFixed(18)  // decimal is precision 18
  }
}

export class CancelOrderMsg {
  public readonly Originator: string
  public readonly ID: string

  constructor({
    originator,
    id,
  }) {
    this.Originator = originator
    this.ID = id
  }
}
