import * as types from '../types'
import { Wallet, SignMessageOptions }  from '../wallet'
import { TransactionOptions } from '../containers/Transaction'

interface Options extends SignMessageOptions, TransactionOptions {}

export interface ProposeDepositMsg {
  Blockchain: string,
	ChainID: string,
	ExtAddress: string,
	AccAddress: string,
	AssetID: string,
	Token: string,
	ExtTxID: string,
	Amount: string,
	Originator: string,
}

export async function proposeDeposit(wallet: Wallet, msg: ProposeDepositMsg, options?: Options) {
	if(!msg.Originator) msg.Originator = wallet.pubKeyBech32

  return wallet.signAndBroadcast(msg, types.PROPOSE_DEPOSIT_TYPE, options)
}
