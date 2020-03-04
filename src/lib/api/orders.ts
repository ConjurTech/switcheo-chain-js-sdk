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
  const msg = {
    OrderParams: JSON.stringify(params),
    Originator: address,
  }
  return wallet.signAndBroadcast(msg, types.CREATE_ORDER_MSG_TYPE, options)
}

export interface CancelOrderParams {
  OrderID: string,
}

export async function cancelOrder(wallet: Wallet, params: CancelOrderParams, options?: Options) {
  const address = wallet.pubKeyBech32
  const msg = {
    OrderID: params.OrderID,
    Originator: address,
  }
  return wallet.signAndBroadcast(msg, types.CANCEL_ORDER_MSG_TYPE, options)
}

export interface EditOrderParams {
  StopPrice?: string,
  Quantity?: string,
  Price?: string,
}
export async function editOrder(wallet: Wallet, orderID: string, params: EditOrderParams, options?: Options) {
  const address = wallet.pubKeyBech32
  const msg = {
    Originator: address,
    OrderID: orderID,
    EditOrderParams: JSON.stringify(params),
  }
  return wallet.signAndBroadcast(msg, types.EDIT_ORDER_MSG_TYPE, options)
}
