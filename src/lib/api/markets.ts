import * as containers from '../containers'
import * as msgs from '../msgs'
import * as types from '../types'
import { Wallet, SignMessageOptions }  from '../wallet'
import { TransactionOptions } from '../containers/Transaction'

interface Options extends SignMessageOptions, TransactionOptions {}

export interface AddMarketParams {
  name: string,
  description: string,
  base: string,
  quote: string,
  lotSize: string,
  tickSize: string,
  minQuantity: string,
  marketType: string,
}
export async function addMarket(wallet: Wallet, params: AddMarketParams, options?: Options) {
  const address = wallet.pubKeyBech32
  const msg = new msgs.AddMarketMsg({
    ...params,
    originator: address,
  })
  const signature = await wallet.signMessage(msg, options)
  const broadcastTxBody = new containers.Transaction(
    types.ADD_MARKET_MSG_TYPE,
    msg,
    signature,
    options,
  )
  return wallet.broadcast(broadcastTxBody)
}
