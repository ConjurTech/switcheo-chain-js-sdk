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

module.exports = {
  Fee,
  StdSignDoc,
}
