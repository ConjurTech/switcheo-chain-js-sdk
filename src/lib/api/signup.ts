import * as types from '../types'
import { Wallet, SignMessageOptions }  from '../wallet'
import { TransactionOptions } from '../containers/Transaction'

interface Options extends SignMessageOptions, TransactionOptions {}

export interface SignalDepositMsg {
  AccAddress: string,
  Originator?: string,
  DepositInfo: {
    Address: string,
    Blockchain: string,
    AssetID: string,
  },
}

export async function signalDeposit(wallet: Wallet, msg: SignalDepositMsg, options?: Options) {
  if (msg.Originator === undefined) {
    msg.Originator = wallet.pubKeyBech32
  }

  return wallet.signAndBroadcast([msg], [types.SIGNAL_DEPOSIT_TYPE], options)
}
