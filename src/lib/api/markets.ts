import * as types from '../types'
import { Wallet, SignMessageOptions }  from '../wallet'
import { TransactionOptions } from '../containers/Transaction'
import { BigNumber } from 'bignumber.js'
import { getNetwork } from '../config'
import fetch from '../utils/fetch'

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


export interface InitiateSettlementMsg {
  Market: string,
  Originator?: string,
}

export async function initiateSettlement(wallet: Wallet, msg: InitiateSettlementMsg, options?: Options) {
  return initiateSettlements(wallet, [msg], options)
}

export async function initiateSettlements(wallet: Wallet, msgs: InitiateSettlementMsg[], options?: Options) {
  const address = wallet.pubKeyBech32
  msgs = msgs.map(msg => {
    if (!msg.Originator) msg.Originator = address
    return msg
  })

  return wallet.signAndBroadcast(msgs, Array(msgs.length).fill(types.INITIATE_SETTLEMENT_MSG_TYPE), options)
}

export function getTokens(net: string): Promise<any> {
  const network = getNetwork(net)
  return fetch(`${network.REST_URL}/get_tokens`)
    .then(res => res.json()) // expecting a json response
}
