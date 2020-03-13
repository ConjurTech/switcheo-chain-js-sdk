import * as containers from '../containers'
import * as types from '../types'
import { Wallet, SignMessageOptions }  from '../wallet'
import { TransactionOptions } from '../containers/Transaction'

interface Options extends SignMessageOptions, TransactionOptions {}

export interface SetLeverageParams {
  Market: string,
  Leverage: string,
  Originator?: string,
}

export async function setLeverage(wallet: Wallet, paramsList: SetLeverageParams[], options?: Options) {
  const address = wallet.pubKeyBech32
  const msgs = paramsList.map(params => ({
    Market: params.Market,
    Leverage: params.Leverage,
    Originator: params.Originator || address,
  }))
  return wallet.signAndBroadcast(msgs, Array(msgs.length).fill(types.SET_LEVERAGE_MSG_TYPE), options)
}
