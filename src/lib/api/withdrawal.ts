import * as types from '../types'
import { Wallet, SignMessageOptions }  from '../wallet'
import { TransactionOptions } from '../containers/Transaction'

interface Options extends SignMessageOptions, TransactionOptions {}

export interface CreateWithdrawalMsg {
  ToAddress: string,
  Denom: string,
  Amount: string,
  FeeAmount: string,
  FeeAddress: string,
	Originator?: string,
}

export async function createWithdrawal(wallet: Wallet, msg: CreateWithdrawalMsg, options?: Options) {
	if(!msg.Originator) msg.Originator = wallet.pubKeyBech32
  return wallet.signAndBroadcast([msg], [types.CREATE_WITHDRAWAL_TYPE], options)
}
