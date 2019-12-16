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

export interface SubmitOracleResultParams {
  OracleName: string,
  Time: string,
	Data: string,
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
    types.CREATE_ORACLE,
    msg,
    signature,
    options,
  )
  return wallet.broadcast(broadcastTxBody)
}

export async function submitOracleResult(wallet: Wallet, params: SubmitOracleResultParams, options?: Options) {
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