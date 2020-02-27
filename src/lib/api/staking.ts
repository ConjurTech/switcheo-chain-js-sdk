import * as types from '../types'
import { Wallet, SignMessageOptions }  from '../wallet'
import { TransactionOptions } from '../containers/Transaction'

interface Options extends SignMessageOptions, TransactionOptions {}

export interface DelegateTokensMsg {
	delegator_address: string,
	validator_address: string,
	amount: {
		amount: string,
		denom: string,
	},
}

export interface CreateValidatorMsg {
	description: {
		moniker: string,
		identity: string,
		website: string,
		details: string,
	},
	commission: {
		rate: string,
		max_rate: string,
		max_rate_change: string,
	},
	min_self_delegation: string,
	delegator_address: string,
	validator_address: string,
	pubkey: string,
	value: {
		amount: string,
		denom: string,
	},
}

export async function createValidator(wallet: Wallet, msg: CreateValidatorMsg, options?: Options) {
	if (options === undefined) { options = {} }
	options.useCosmosFormat = true
  return wallet.signAndBroadcast(msg, types.CREATE_VALIDATOR_MSG_TYPE, options)
}

export async function delegateTokens(wallet: Wallet, msg: DelegateTokensMsg, options?: Options) {
	if (options === undefined) { options = {} }
	options.useCosmosFormat = true
  return wallet.signAndBroadcast(msg, types.DELEGATE_TOKENS_MSG_TYPE, options)
}
