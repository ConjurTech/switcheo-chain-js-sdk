import { CONFIG } from '../config'
import { Fee } from './StdSignDoc'

export interface TransactionOptions {
  fee?: Fee
  mode?: string
}

interface Msg {
  type: string
  value: any
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

  constructor(type, msg, signature, options: TransactionOptions = {}) {
    const fee = options.fee || new Fee([], CONFIG.DEFAULT_GAS)
    const mode = options.mode || 'block'
    this.tx = {
      fee,
      msg: [{
        type,
        value: msg,
      }],
      signatures: [signature],
    }
    this.mode = mode
  }
}
