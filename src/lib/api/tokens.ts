import * as types from '../types'
import { Wallet, SignMessageOptions }  from '../wallet'
import { TransactionOptions } from '../containers/Transaction'
import { BigNumber } from 'bignumber.js'

interface Options extends SignMessageOptions, TransactionOptions {}

export interface CreateTokenMsg {
  Name: string,
  Symbol: string,
  Denom: string,
  Decimals: string,
  Blockchain: string,
  ChainID: string,
  AssetID: string,
  USDValue: string,
  IsCollateral: boolean,
  Originator?: string,
}
export async function createToken(wallet: Wallet, msg: CreateTokenMsg, options?: Options) {
  return createTokens(wallet, [msg], options)
}

export async function createTokens(wallet: Wallet, msgs: CreateTokenMsg[], options?: Options) {
  const address = wallet.pubKeyBech32
  msgs = msgs.map(msg => {
    if (!msg.Originator) msg.Originator = address
    msg.USDValue = new BigNumber(msg.USDValue).toFixed(18)
    return msg
  })

  return wallet.signAndBroadcast(msgs, Array(msgs.length).fill(types.CREATE_TOKEN_MSG_TYPE), options)
}

export interface MintTokenMsg {
  Originator?: string
  ToAddress:  string
  Amount:     string
  Denom:      string
}

export async function mintTestnetTokens(wallet: Wallet, msg: MintTokenMsg, options?: Options) {
  if(!msg.Originator) msg.Originator = wallet.pubKeyBech32
  return wallet.signAndBroadcast([msg], [types.MINT_TOKEN_MSG_TYPE], options)
}