const { BigNumber } = require('bignumber.js')

class StdSignDoc {
  constructor({
    chainId,
    accountNumber,
    sequence,
    fee,
    msgs,
    memo,
  }) {
    this.chain_id = chainId
    this.account_number = accountNumber
    this.sequence = sequence
    this.fee = fee
    this.msgs = msgs
    this.memo = memo
  }
}

class Fee {
  constructor(amount, gas) {
    this.amount = amount
    this.gas = gas
  }
}

class CreateMsg {
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

class CancelMsg {
  constructor({
    originator,
    id,
  }) {
    this.Originator = originator
    this.ID = id
  }
}

module.exports = {
  Fee,
  CancelMsg,
  CreateMsg,
  StdSignDoc,
}
