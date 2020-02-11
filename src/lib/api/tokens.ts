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
  Originator: string,
}
export async function createToken(wallet: Wallet, msg: CreateTokenMsg, options?: Options) {
  if(!msg.Originator) msg.Originator = wallet.pubKeyBech32
  msg.USDValue = new BigNumber(msg.USDValue).toFixed(18)

  return wallet.signAndBroadcast(msg, types.CREATE_TOKEN_MSG_TYPE, options)
}
