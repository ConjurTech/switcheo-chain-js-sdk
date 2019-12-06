import * as containers from '../containers'
import * as msgs from '../msgs'
import * as types from '../types'
import { Wallet, SignMessageOptions }  from '../wallet'
import { TransactionOptions } from '../containers/Transaction'

interface Options extends SignMessageOptions, TransactionOptions {}

export interface SubmitOracleResultParams {
  OracleName: string,
  Time: number,
	Data: string,
}

export async function submitOracleResult(wallet: Wallet, params: SubmitOracleResultParams, options?: Options) {
  const address = wallet.pubKeyBech32
  const msg = new msgs.AddOracleResultMsg({
    oracleName: params.OracleName,
    time: params.Time,
    data: params.Data,
    originator: address,
  })
  const signature = await wallet.signMessage(msg, options)
  const broadcastTxBody = new containers.Transaction(
    types.ADD_ORACLE_RESULT_TYPE,
    msg,
    signature,
    options,
  )
  return wallet.broadcast(broadcastTxBody)
}
