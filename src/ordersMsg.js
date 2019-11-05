const { BigNumber } = require('bignumber.js')

class CreateOrderMsg {
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

class CancelOrderMsg {
  constructor({
    originator,
    id,
  }) {
    this.Originator = originator
    this.ID = id
  }
}

module.exports = {
  CancelOrderMsg,
  CreateOrderMsg,
}
