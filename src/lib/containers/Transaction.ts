import { CONFIG } from '../config'
import { Fee } from './StdSignDoc'

export interface TransactionOptions {
  fee?: Fee
  mode?: string
}
export interface Msg {
  type: string
  value: object
}
interface Tx {
  fee: Fee
  msg: ReadonlyArray<Msg>
  signatures: ReadonlyArray<any> // TODO: fix any
}

export class Transaction {
  public readonly fee: Fee
  public readonly mode: string
  public readonly tx: Tx

  constructor(msgs: Msg[], signatures, options: TransactionOptions = {}) {
    const fee = options.fee || new Fee([], CONFIG.DEFAULT_GAS)
    this.mode = options.mode || 'block'
    this.tx = {
      fee,
      msg: msgs,
      signatures,
    }
  }
}
