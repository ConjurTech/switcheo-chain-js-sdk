import * as types from '../types'
import { Wallet, SignMessageOptions }  from '../wallet'
import { TransactionOptions } from '../containers/Transaction'

interface Options extends SignMessageOptions, TransactionOptions {}

export interface CreateOracleMsg {
	Name: string,
	Description: string,
	MinConsensusThreshold: string,
	SecurityType: string,
	ResultStrategy: string,
	Config: string,
	Resolution: string,
	Spec: string,
	Originator?: string,
}

export interface CreatePropositionMsg {
	OracleName: string,
	Timestamp: string,
	Data: string,
	Originator?: string,
}

export async function createOracle(wallet: Wallet, msg: CreateOracleMsg, options?: Options) {
	if(!msg.Originator) msg.Originator = wallet.pubKeyBech32

  return wallet.signAndBroadcast([msg], [types.CREATE_ORACLE_TYPE], options)
}

export async function createProposition(wallet: Wallet, msg: CreatePropositionMsg, options?: Options) {
	if(!msg.Originator) msg.Originator = wallet.pubKeyBech32

	return wallet.signAndBroadcast([msg], [types.CREATE_VOTE_TYPE], options)
}
