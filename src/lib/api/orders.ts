import * as containers from '../containers'
import * as msgs from '../msgs'
import * as types from '../types'
import { Wallet, SignMessageOptions }  from '../wallet'
import { TransactionOptions } from '../containers/Transaction'

interface Options extends SignMessageOptions, TransactionOptions {}

export interface CreateOrderParams {
  OrderType?: string,
  StopPrice?: string,
  Market: string,
  Side: string,
  Quantity: string,
  Price: string,
}
export async function createOrder(wallet: Wallet, params: CreateOrderParams, options?: Options) {
  const address = wallet.pubKeyBech32
  const msg = new msgs.CreateOrderMsg({
    originator: address,
    orderParams: JSON.stringify(params),
  })
  const signature = await wallet.signMessage(msg, options)
  const broadcastTxBody = new containers.Transaction(
    types.CREATE_ORDER_MSG_TYPE,
    msg,
    signature,
    options,
  )
  return wallet.broadcast(broadcastTxBody)
}

export interface CancelOrderParams {
  orderID: string,
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

export interface EditOrderParams {
  StopPrice?: string,
  Quantity?: string,
  Price?: string,
}
export async function editOrder(wallet: Wallet, orderID: string, params: EditOrderParams, options?: Options) {
  const address = wallet.pubKeyBech32
  const msg = new msgs.EditOrderMsg({
    originator: address,
    orderID,
    editOrderParams: JSON.stringify(params),
  })
  const signature = await wallet.signMessage(msg, options)
  const broadcastTxBody = new containers.Transaction(
    types.EDIT_ORDER_MSG_TYPE,
    msg,
    signature,
    options,
  )
  return wallet.broadcast(broadcastTxBody)
}
