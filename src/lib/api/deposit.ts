import * as types from '../types'
import { ETH_VAULT_ADDRESS } from '../constants/addresses'
import { Wallet, SignMessageOptions }  from '../wallet'
import { TransactionOptions } from '../containers/Transaction'
import { ETH_BLOCKCHAIN } from '../constants/blockchains'
import { ETH_ASSET_ID } from '../constants/addresses'
import { bn } from '../utils'

interface Options extends SignMessageOptions, TransactionOptions {}

// max allowance is 2^256
const MAX_ALLOWANCE = "115792089237316195423570985008687907853269984665640564039457584007913129639935"

export interface ProposeDepositMsg {
  Blockchain: string,
	ChainID: string,
	ExtAddress: string,
	AccAddress: string,
	AssetID: string,
	Token: string,
	ExtTxID: string,
	Amount: string,
	Originator?: string,
}

export interface DepositParams {
  Blockchain: string,
  AssetID: string,
  Amount: string,
}

export async function proposeDeposit(wallet: Wallet, msg: ProposeDepositMsg, options?: Options) {
	if(!msg.Originator) msg.Originator = wallet.pubKeyBech32

  return wallet.signAndBroadcast([msg], [types.PROPOSE_DEPOSIT_TYPE], options)
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
  const { web3 } = wallet.eth

  const amount = bn(params.Amount)
  const sender = await wallet.eth.getAddress()
  const balance = bn(await web3.eth.getBalance(sender))

  if (amount.isGreaterThan(balance)) {
    throw new Error('Insufficient ETH balance for deposit')
  }

  const depositMethod = vault.methods.deposit(
    web3.utils.asciiToHex(wallet.pubKeyBech32),
    web3.utils.asciiToHex('cosmos_sig')
  )

  return wallet.eth.sendTransaction({
    to: vault.options.address,
    value: amount.toString(),
    method: depositMethod
  })
}

async function depositEthToken(wallet: Wallet, params: DepositParams) {
  const { web3 } = wallet.eth
  const token = wallet.eth.getErc20(params.AssetID)
  const sender = await wallet.eth.getAddress()

  const amount = bn(params.Amount)
  const balance = bn(await token.methods.balanceOf(sender).call())

  if (amount.isGreaterThan(balance)) {
    throw new Error('Insufficient token balance for deposit')
  }

  const allowance = bn(await token.methods.allowance(sender, ETH_VAULT_ADDRESS).call())

  if (amount.isGreaterThan(allowance)) {
    const approveMethod = token.methods.approve(ETH_VAULT_ADDRESS, MAX_ALLOWANCE)
    const result = wallet.eth.sendTransaction({
      to: token.options.address,
      method: approveMethod
    })
    return { complete: false, result }
  }

  // TODO: handle custom expected amounts
  const expectedAmount = amount

  const vault = wallet.eth.getVault()
  const depositTokenMethod = vault.methods.depositToken(
    params.AssetID,
    amount.toString(),
    expectedAmount.toString(),
    web3.utils.asciiToHex(wallet.pubKeyBech32),
    web3.utils.asciiToHex('cosmos_sig')
  )

  const result = wallet.eth.sendTransaction({
    to: vault.options.address,
    method: depositTokenMethod
  })

  return { complete: true, result }
}
