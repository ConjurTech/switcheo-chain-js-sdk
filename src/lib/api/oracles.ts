import * as types from '../types'
import { Wallet, SignMessageOptions }  from '../wallet'
import { TransactionOptions } from '../containers/Transaction'

interface Options extends SignMessageOptions, TransactionOptions {}

export interface CreateOracleMsg {
	OracleName: string,
	Description: string,
	MinConsensusThreshold: string,
	SecurityType: string,
	Resolution: string,
	Spec: string,
	Originator: string,
}

export interface CreatePropositionMsg {
	OracleName: string,
	Timestamp: string,
	Data: string,
	Originator: string,
}
/*
export interface CreateOracleResultParams {
	OracleName: string,
	Time: string,
	Data: string,
}

export interface CreateOracleVoterParams {
	OracleName: string,
	Voter: string
}
*/
export async function createOracle(wallet: Wallet, msg: CreateOracleMsg, options?: Options) {
	if(msg.Originator === "") msg.Originator = wallet.pubKeyBech32

  return wallet.signAndBroadcast(msg, types.CREATE_ORACLE_TYPE, options)
}

export async function createProposition(wallet: Wallet, msg: CreatePropositionMsg, options?: Options) {
	if(msg.Originator === "") msg.Originator = wallet.pubKeyBech32

	return wallet.signAndBroadcast(msg, types.CREATE_PROPOSTION_TYPE, options)
}

/*
export async function createOracleResult(wallet: Wallet, params: CreateOracleResultParams, options?: Options) {
	const address = wallet.pubKeyBech32
	const msg = new msgs.CreateOracleResultMsg({
		oracleName: params.OracleName,
		time: params.Time,
		data: params.Data,
		originator: address,
	})
	const signature = await wallet.signMessage(msg, options)
	const broadcastTxBody = new containers.Transaction(
		types.CREATE_ORACLE_RESULT_TYPE,
		msg,
		signature,
		options,
	)
	return wallet.broadcast(broadcastTxBody)
}

export async function createOracleVoter(wallet: Wallet, params: CreateOracleVoterParams, options?: Options) {
	const address = wallet.pubKeyBech32

	const msg = new msgs.CreateOracleVoterMsg({
		oracleName: params.OracleName,
		voter: params.Voter,
		originator: address,
	})

	return wallet.signAndBroadcast(msg, types.CREATE_ORACLE_VOTER_TYPE, options)
}
*/
