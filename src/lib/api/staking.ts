import * as types from '../types'
import { Wallet, SignMessageOptions }  from '../wallet'
import { TransactionOptions } from '../containers/Transaction'

interface Options extends SignMessageOptions, TransactionOptions {}

export interface DelegateTokensMsg {
	typs: string,
	value: {
		delegator_address: string,
		validator_address: string,
		amount: {
			amount: string,
			denom: string,
		},
	},
}

export async function delegateTokens(wallet: Wallet, msg: DelegateTokensMsg, options?: Options) {
	if (options === undefined) { options = {} }
	options.useCosmosFormat = true
  return wallet.signAndBroadcast(msg, types.DELEGATE_TOKENS_MSG_TYPE, options)
}
