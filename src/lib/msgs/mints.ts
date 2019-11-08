export class MintTokenMsg {
  public readonly Originator: string
  public readonly ToAddress: string
  public readonly Amount: string
  public readonly Denom: string

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
