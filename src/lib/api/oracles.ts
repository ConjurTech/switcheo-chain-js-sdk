import * as containers from '../containers'
import * as msgs from '../msgs'
import * as types from '../types'
import { Wallet, SignMessageOptions }  from '../wallet'
import { TransactionOptions } from '../containers/Transaction'

interface Options extends SignMessageOptions, TransactionOptions {}

export interface CreateOracleParams {
	OracleName: string,
	Description: string,
	MinConsensusThreshold: string,
}

export interface CreateOracleResultParams {
  OracleName: string,
  Time: string,
	Data: string,
}

export interface CreateOracleVoterParams {
  OracleName: string,
  Voter: string
}

export interface CreateOraclePropositionParams {
	OracleName: string,
	Voter: string,
	Timestamp: string,
	Data: string
}

export async function createOracle(wallet: Wallet, params: CreateOracleParams, options?: Options) {
  const address = wallet.pubKeyBech32
  const msg = new msgs.CreateOracleMsg({
    oracleName: params.OracleName,
    description: params.Description,
		minConsensusThreshold: params.MinConsensusThreshold,
    originator: address,
  })
  const signature = await wallet.signMessage(msg, options)
  const broadcastTxBody = new containers.Transaction(
    types.CREATE_ORACLE_TYPE,
    msg,
    signature,
    options,
  )
  return wallet.broadcast(broadcastTxBody)
}

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
    originator: address
  })

  return wallet.signAndBroadcast(msg, types.CREATE_ORACLE_VOTER_TYPE, options)
}

export async function createOracleProposition(wallet: Wallet, params: CreateOraclePropositionParams, options?: Options) {
	const address = wallet.pubKeyBech32

	const msg = new msgs.CreateOraclePropositionMsg({
		oracleName: params.OracleName,
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
		timestamp: params.Timestamp,
||||||| constructed merge base
		voter: params.Voter,
		time: params.Time,
=======
		time: params.Time,
>>>>>>> remove voter field in CreatePropositionMsg
||||||| constructed merge base
		time: params.Time,
=======
		timestamp: params.Timestamp,
>>>>>>> naming
||||||| 4bc461f
		voter: params.Voter,
		time: params.Time,
=======
		timestamp: params.Timestamp,
>>>>>>> 5fe5bab725f30871c5b4a7a63a72cc74c6d3eb38
		data: params.Data,
		originator: address
	})

	return wallet.signAndBroadcast(msg, types.CREATE_ORACLE_PROPOSTION_TYPE, options)
}
