import * as types from '../types'
import { Wallet, SignMessageOptions }  from '../wallet'
import { TransactionOptions } from '../containers/Transaction'

interface Options extends SignMessageOptions, TransactionOptions {}

export interface CreateOrderParams {
  OrderType?: string,
  StopPrice?: string,
  TriggerType?: string,
  Market: string,
  Side: string,
  Quantity: string,
  Price: string,
}

export async function createOrder(wallet: Wallet, params: CreateOrderParams, options?: Options) {
  return createOrders(wallet, [params], options)
}

export async function createOrders(wallet: Wallet, paramsList: CreateOrderParams[], options?: Options) {
  const address = wallet.pubKeyBech32
  const msgs = paramsList.map(params => ({
    OrderParams: JSON.stringify(params),
    Originator: address,
  }))
  return wallet.signAndBroadcast(msgs, Array(msgs.length).fill(types.CREATE_ORDER_MSG_TYPE), options)
}

export interface CancelOrderParams {
  OrderID: string,
  Originator?: string,
}

export async function cancelOrder(wallet: Wallet, params: CancelOrderParams, options?: Options) {
  return cancelOrders(wallet, [params], options)
}

export async function cancelOrders(wallet: Wallet, paramsList: CancelOrderParams[], options?: Options) {
  const address = wallet.pubKeyBech32
  const msgs = paramsList.map(params => ({
    OrderID: params.OrderID,
    Originator: address,
  }))
  return wallet.signAndBroadcast(msgs, Array(msgs.length).fill(types.CANCEL_ORDER_MSG_TYPE), options)
}

export interface EditOrderParams {
  StopPrice?: string,
  Quantity?: string,
  Price?: string,
}

export async function editOrder(wallet: Wallet, orderID: string, params: EditOrderParams, options?: Options) {
  return editOrders(wallet, [orderID], [params], options)
}

export async function editOrders(wallet: Wallet, orderIDs: string[], paramsList: EditOrderParams[], options?: Options) {
  if (orderIDs.length != paramsList.length) throw new Error("orderIDs.length != paramsList.length")
  const address = wallet.pubKeyBech32
  const msgs = paramsList.map((params, i) => ({
    OrderID: orderIDs[i],
    EditOrderParams: JSON.stringify(params),
    Originator: address,
  }))
  return wallet.signAndBroadcast(msgs, Array(msgs.length).fill(types.EDIT_ORDER_MSG_TYPE), options)
}

export interface CancelOrderParams {
  OrderID: string,
  Originator?: string,
}

export interface EditMarginParams {
  Market: string,
  Margin: string,
}

export async function editMargin(wallet: Wallet, params: EditMarginParams, options?: Options) {
  return editMargins(wallet, [params], options)
}

export async function editMargins(wallet: Wallet, paramsList: EditMarginParams[], options?: Options) {
  const address = wallet.pubKeyBech32
  const msgs = paramsList.map(params => ({
    Market: params.Market,
    Margin: params.Margin,
    Originator: address,
  }))
  return wallet.signAndBroadcast(msgs, Array(msgs.length).fill(types.EDIT_MARGIN_MSG_TYPE), options)
}
