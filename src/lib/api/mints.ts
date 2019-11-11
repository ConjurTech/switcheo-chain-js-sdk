import * as containers from '../containers'
import * as msgs from '../msgs'
import * as types from '../types'
import { Wallet } from '../wallet'

export interface MintTokenParams {
  toAddress: string,
  amount: string,
  denom: string,
}
export async function mintToken(wallet: Wallet, params: MintTokenParams) {
  const address = wallet.pubKeyBech32
  const msg = new msgs.MintTokenMsg({
    ...params,
    originator: address,
  })

  const signature = await wallet.signMessage(msg)
  const broadcastTxBody = new containers.Transaction(
    types.MINT_TOKEN_MSG_TYPE,
    msg,
    signature,
  )
  return wallet.broadcast(broadcastTxBody)
}
