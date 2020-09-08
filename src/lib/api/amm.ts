import * as types from '../types'
import { Wallet, SignMessageOptions }  from '../wallet'
import { TransactionOptions } from '../containers/Transaction'

interface Options extends SignMessageOptions, TransactionOptions {}

export interface AddLiquidityMsg {
  PoolID: string,
  ADenom?: string,
  AAmount?: string,
  AMaxAmount?: string,
  BDenom?: string,
  BAmount?: string,
  BMaxAmount?: string,
  Originator?: string,
}

export interface RemoveLiquidityMsg {
  PoolID: string,
  Shares: string,
  Originator?: string,
}

export async function addLiquidity(wallet: Wallet, msg: AddLiquidityMsg, options?: Options) {
	if(!msg.Originator) {
    msg.Originator = wallet.pubKeyBech32
  }
  if (!msg.ADenom) {
    msg.ADenom = ''
  }
  if (!msg.AAmount) {
    msg.AAmount = ''
  }
  if (!msg.AMaxAmount) {
    msg.AMaxAmount = ''
  }
  if (!msg.BDenom) {
    msg.BDenom = ''
  }
  if (!msg.BAmount) {
    msg.BAmount = ''
  }
  if (!msg.BMaxAmount) {
    msg.BMaxAmount = ''
  }
    
  return wallet.signAndBroadcast([msg], [types.ADD_LIQUIDITY_MSG_TYPE], options)
}

export async function removeLiquidity(wallet: Wallet, msg: RemoveLiquidityMsg, options?: Options) {
	if(!msg.Originator) {
    msg.Originator = wallet.pubKeyBech32
  }
  return wallet.signAndBroadcast([msg], [types.REMOVE_LIQUIDITY_MSG_TYPE], options)
}
