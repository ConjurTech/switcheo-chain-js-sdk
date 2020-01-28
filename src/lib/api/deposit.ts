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

export interface DepositParams {
  Blockchain: string,
  AssetID: string,
  Amount: string,
}

export async function proposeDeposit(wallet: Wallet, msg: ProposeDepositMsg, options?: Options) {
	if(!msg.Originator) msg.Originator = wallet.pubKeyBech32

  return wallet.signAndBroadcast(msg, types.PROPOSE_DEPOSIT_TYPE, options)
}

export async function deposit(wallet: Wallet, params: DepositParams) {
  if (wallet.eth === undefined) {
    throw new Error('Ethereum wallet not connected')
  }

  const vault = wallet.eth.getVault()
  const { utils } = wallet.eth.web3

  const method = vault.methods.deposit(
    utils.asciiToHex(wallet.pubKeyBech32),
    utils.asciiToHex('cosmos_sig')
  )

  const value = utils.toWei(params.Amount, 'ether')

  const transaction = {
    to: vault.options.address,
    value: value,
    data: method.encodeABI()
  }

  return await wallet.eth.sendTransaction(transaction)
}
