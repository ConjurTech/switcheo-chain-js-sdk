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
    orderParams,
  }) {
    this.Originator = originator
    this.OrderParams = orderParams
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
