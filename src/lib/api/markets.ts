import * as types from '../types'
import { Wallet, SignMessageOptions }  from '../wallet'
import { TransactionOptions } from '../containers/Transaction'
import { BigNumber } from 'bignumber.js'

interface Options extends SignMessageOptions, TransactionOptions {}

export interface AddMarketParams {
  Name: string,
  Description: string,
  Base: string,
  Quote: string,
  LotSize: string,
  TickSize: string,
  MinQuantity: string,
  MarketType: string,
}
export async function addMarket(wallet: Wallet, params: AddMarketParams, options?: Options) {
  params.TickSize = new BigNumber(params.TickSize).toFixed(18)
  const address = wallet.pubKeyBech32
  const msg = {
    ...params,
    Originator: address,
  }
  return wallet.signAndBroadcast(msg, types.ADD_MARKET_MSG_TYPE, options)
}

