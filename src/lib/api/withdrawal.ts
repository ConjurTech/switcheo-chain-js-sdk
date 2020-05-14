import * as types from '../types'
import { Wallet, SignMessageOptions }  from '../wallet'
import { TransactionOptions } from '../containers/Transaction'

interface Options extends SignMessageOptions, TransactionOptions {}

export interface CreateWithdrawalMsg {
  ReceivingAddress: string,
  Blockchain: string,
  ChainID: string,
  AssetID: string,
  Amount: string,
	Originator?: string,
}

export async function createWithdrawal(wallet: Wallet, msg: CreateWithdrawalMsg, options?: Options) {
	if(!msg.Originator) msg.Originator = wallet.pubKeyBech32

  const formattedMsg = {
    Params: JSON.stringify({
      ReceivingAddress: msg.ReceivingAddress,
      Blockchain: msg.Blockchain,
      ChainID: msg.ChainID,
      AssetID: msg.AssetID,
      Amount: msg.Amount,
    }),
    Originator: msg.Originator,
  }

  return wallet.signAndBroadcast([formattedMsg], [types.CREATE_WITHDRAWAL_TYPE], options)
}
