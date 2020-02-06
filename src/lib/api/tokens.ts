import * as containers from '../containers'
import * as msgs from '../msgs'
import * as types from '../types'
import { Wallet, SignMessageOptions }  from '../wallet'
import { TransactionOptions } from '../containers/Transaction'

interface Options extends SignMessageOptions, TransactionOptions {}

export interface AddTokenParams {
  symbol: string,
  name: string,
  decimals: string,
  nativeBlockchain: string,
  usdValue: string,
}
export async function addToken(wallet: Wallet, params: AddTokenParams, options?: Options) {
  const address = wallet.pubKeyBech32
  const msg = new msgs.AddTokenMsg({
    ...params,
    originator: address,
  })
  const signature = await wallet.signMessage(msg, options)
  const broadcastTxBody = new containers.Transaction(
    types.CREATE_TOKEN_MSG_TYPE,
    msg,
    signature,
    options,
  )
  return wallet.broadcast(broadcastTxBody)
}
