import * as types from '../types'
import { Wallet, SignMessageOptions }  from '../wallet'
import { TransactionOptions } from '../containers/Transaction'
import { BigNumber } from 'bignumber.js'

interface Options extends SignMessageOptions, TransactionOptions {}

export interface AddMarketMsg {
  Name: string,
  Description: string,
  Base: string,
  Quote: string,
  LotSize: string,
  TickSize: string,
  MinQuantity: string,
  MarketType: string,
  Originator?: string,
}

export async function addMarket(wallet: Wallet, msg: AddMarketMsg, options?: Options) {
  return addMarkets(wallet, [msg], options)
}

export async function addMarkets(wallet: Wallet, msgs: AddMarketMsg[], options?: Options) {
  const address = wallet.pubKeyBech32
  msgs = msgs.map(msg => {
    msg.TickSize = new BigNumber(msg.TickSize).toFixed(18)
    if (!msg.Originator) msg.Originator = address
    return msg
  })
  return wallet.signAndBroadcast(msgs, Array(msgs.length).fill(types.ADD_MARKET_MSG_TYPE), options)
}

