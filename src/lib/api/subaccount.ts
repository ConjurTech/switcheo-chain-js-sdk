import * as types from '../types'
import { Wallet, SignMessageOptions }  from '../wallet'
import { TransactionOptions } from '../containers/Transaction'

interface Options extends SignMessageOptions, TransactionOptions {}

export interface CreateSubAccountMsg {
  SubAddress: string,
  Originator?: string,
}

export interface ActivateSubAccountMsg {
  ExpectedMainAccount: string,
  Originator?: string,
}

export async function createSubAccount(wallet: Wallet, msg: CreateSubAccountMsg, options?: Options) {
	if(!msg.Originator) {
    msg.Originator = wallet.pubKeyBech32
  }
  return wallet.signAndBroadcast([msg], [types.CREATE_SUB_ACCOUNT_MSG_TYPE], options)
}

export async function activateSubAccount(wallet: Wallet, msg: ActivateSubAccountMsg, options?: Options) {
	if(!msg.Originator) {
    msg.Originator = wallet.pubKeyBech32
  }
  return wallet.signAndBroadcast([msg], [types.ACTIVATE_SUB_ACCOUNT_MSG_TYPE], options)
}
