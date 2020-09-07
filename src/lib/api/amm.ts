import * as types from '../types'
import { Wallet, SignMessageOptions }  from '../wallet'
import { TransactionOptions } from '../containers/Transaction'

interface Options extends SignMessageOptions, TransactionOptions {}

export interface AddLiquidityMsg {
  Market: string,
  QuoteAmount: string,
  MaxBaseAmount?: string,
  Originator?: string,
}

export interface RemoveLiquidityMsg {
  Market: string,
  Shares: string,
  Originator?: string,
}

export async function addLiquidity(wallet: Wallet, msg: AddLiquidityMsg, options?: Options) {
	if(!msg.Originator) {
    msg.Originator = wallet.pubKeyBech32
  }
  if (!msg.MaxBaseAmount) {
    msg.MaxBaseAmount = ''
  }
    
  return wallet.signAndBroadcast([msg], [types.ADD_LIQUIDITY_MSG_TYPE], options)
}

export async function removeLiquidity(wallet: Wallet, msg: RemoveLiquidityMsg, options?: Options) {
	if(!msg.Originator) {
    msg.Originator = wallet.pubKeyBech32
  }
  return wallet.signAndBroadcast([msg], [types.REMOVE_LIQUIDITY_MSG_TYPE], options)
}
