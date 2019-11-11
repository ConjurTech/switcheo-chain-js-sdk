import * as containers from '../containers'
import * as msgs from '../msgs'
import * as types from '../types'
import { Wallet, SignMessageOptions }  from '../wallet'
import { TransactionOptions } from '../containers/Transaction'

interface Options extends SignMessageOptions, TransactionOptions {}

export interface PlaceOrderParams {
  pair: string,
  side: string,
  quantity: string,
  price: string,
}
export async function placeOrder(wallet: Wallet, params: PlaceOrderParams, options?: Options) {
  const address = wallet.pubKeyBech32
  const msg = new msgs.CreateOrderMsg({
    ...params,
    originator: address,
  })
  const signature = await wallet.signMessage(msg, options)
  const broadcastTxBody = new containers.Transaction(
    types.PLACE_ORDER_MSG_TYPE,
    msg,
    signature,
    options,
  )
  return wallet.broadcast(broadcastTxBody)
}

export interface CancelOrderParams {
  id: string,
}

export async function cancelOrder(wallet: Wallet, params: CancelOrderParams, options?: Options) {
  const address = wallet.pubKeyBech32
  const msg = new msgs.CancelOrderMsg({
    ...params,
    originator: address,
  })
  const signature = await wallet.signMessage(msg, options)
  const broadcastTxBody = new containers.Transaction(
    types.CANCEL_ORDER_MSG_TYPE,
    msg,
    signature,
    options,
  )
  return wallet.broadcast(broadcastTxBody)
}
