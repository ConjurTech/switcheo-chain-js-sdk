import * as types from '../types'
import { Wallet, SignMessageOptions }  from '../wallet'
import { TransactionOptions } from '../containers/Transaction'
import { BigNumber } from 'bignumber.js'

interface Options extends SignMessageOptions, TransactionOptions {}

export interface SendTokensMsg {
  from_address: string,
  to_address: string,
  amount: Array<{
    denom: string,
    amount: string,
  }>
}

export async function sendTokens(wallet: Wallet, msg: SendTokensMsg, options?: Options) {
  return wallet.signAndBroadcast([msg], [types.SEND_TOKENS_TYPE], options)
}

export interface CreateTokenMsg {
  Name: string,
  Symbol: string,
  Denom: string,
  Decimals: string,
  Blockchain: string,
  ChainID: string,
  AssetID: string,
  USDValue: string,
  IsCollateral: boolean,
  Originator?: string,
}
export async function createToken(wallet: Wallet, msg: CreateTokenMsg, options?: Options) {
  return createTokens(wallet, [msg], options)
}

export async function createTokens(wallet: Wallet, msgs: CreateTokenMsg[], options?: Options) {
  const address = wallet.pubKeyBech32
  msgs = msgs.map(msg => {
    if (!msg.Originator) msg.Originator = address
    msg.USDValue = new BigNumber(msg.USDValue).toFixed(18)
    return msg
  })

  return wallet.signAndBroadcast(msgs, Array(msgs.length).fill(types.CREATE_TOKEN_MSG_TYPE), options)
}

export interface MintParams {
  toAddress: string
  mint: Array<{denom: string, amount: string}>
}

export async function mintMultipleTestnetTokens(minterWallet: Wallet, params: MintParams) {
  console.log('HELP!!!!')
  const { toAddress, mint } = params
  const promises = mint.map((v: {denom: string, amount: string}) => {
    return mintTestnetTokens(minterWallet, {
      ToAddress: toAddress,
      Amount: new BigNumber(v.amount).toFixed(18),
      Denom: v.denom,
    })
  })
  return Promise.all(promises)
}

export interface MintTokenMsg {
  Originator?: string
  ToAddress:  string
  Amount:     string
  Denom:      string // must have 18 decimal places e.g. 1.000000000000000000
}

export async function mintTestnetTokens(minterWallet: Wallet, msg: MintTokenMsg, options?: Options) {
  // console.log('msg', msg)
  // console.log('minterWallet', minterWallet)
  if(!msg.Originator) msg.Originator = minterWallet.pubKeyBech32
  return minterWallet.signAndBroadcast([msg], [types.MINT_TOKEN_MSG_TYPE], options)
}