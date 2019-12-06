import { BigNumber } from 'bignumber.js'

export class AddTokenMsg {
  public readonly Originator: string
  public readonly Symbol: string
  public readonly Name: string
  public readonly Decimals: string
  public readonly NativeBlockchain: string
  public readonly USDValue: string

  constructor({
    originator,
    symbol,
    name,
    decimals,
    nativeBlockchain,
    usdValue,
  }) {
    this.Originator = originator
    this.Symbol = symbol
    this.Name = name
    this.Decimals = decimals
    this.NativeBlockchain = nativeBlockchain
    this.USDValue = new BigNumber(usdValue).toFixed(18)
  }
}
