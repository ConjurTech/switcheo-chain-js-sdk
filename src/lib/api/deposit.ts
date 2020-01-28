import * as types from '../types'
import { Wallet, SignMessageOptions }  from '../wallet'
import { TransactionOptions } from '../containers/Transaction'
import { ETH_BLOCKCHAIN } from '../constants/blockchains'
import { ETH_ASSET_ID } from '../constants/addresses'

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
  if (params.Blockchain === ETH_BLOCKCHAIN) {
    if (wallet.eth === undefined) {
      throw new Error('Ethereum wallet not connected')
    }

    if (params.AssetID === ETH_ASSET_ID) {
      return depositEth(wallet, params)
    } else {
      return depositEthToken(wallet, params)
    }
  }

  throw new Error('Unsupported blockchain')
}

async function depositEth(wallet: Wallet, params: DepositParams) {
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

  return wallet.eth.sendTransaction(transaction)
}

async function depositEthToken(wallet: Wallet, params: DepositParams) {
  // check approved amount
  // approve amount if needed
  // send depositToken transaction
}
