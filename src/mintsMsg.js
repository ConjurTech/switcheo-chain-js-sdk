class MintTokenMsg {
  constructor({
    originator,
    toAddress,
    amount,
    denom,
  }) {
    this.Originator = originator
    this.ToAddress = toAddress
    this.Amount = amount
    this.Denom = denom
  }
}

module.exports = {
  MintTokenMsg,
}
