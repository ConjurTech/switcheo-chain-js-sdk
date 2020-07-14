import * as types from '../types'
import { Wallet, SignMessageOptions }  from '../wallet'
import { TransactionOptions } from '../containers/Transaction'
import { getNetwork } from '../config'
import fetch from '../utils/fetch'

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
  return wallet.signAndBroadcast([msg], [types.CREATE_VALIDATOR_MSG_TYPE], options)
}

export async function delegateTokens(wallet: Wallet, msg: DelegateTokensMsg, options?: Options) {
  return wallet.signAndBroadcast([msg], [types.DELEGATE_TOKENS_MSG_TYPE], options)
}

export async function getStakingValidators(net: string): Promise<any> {
	const network = getNetwork(net)
	return fetch(`${network.COSMOS_URL}/staking/validators`)
		.then(res => res.json()) // expecting a json response
}

interface GetValidatorDelegationsParams {
	address: string
}
export async function getValidatorDelegations(net: string,
																							params: GetValidatorDelegationsParams): Promise<any> {
	const network = getNetwork(net)
	const { address } = params
	return fetch(`${network.COSMOS_URL}/staking/validators/${address}/delegations`)
		.then(res => res.json()) // expecting a json response
}


interface GetDelegatorDelegationsParams {
	address: string
}
export async function getDelegatorDelegations(net: string,
																							params: GetDelegatorDelegationsParams): Promise<any> {
	const network = getNetwork(net)
	const { address } = params
	return fetch(`${network.COSMOS_URL}/delegators/${address}/delegations`)
		.then(res => res.json()) // expecting a json response
}
