import * as types from '../types'
import { Wallet, SignMessageOptions }  from '../wallet'
import { TransactionOptions } from '../containers/Transaction'

interface Options extends SignMessageOptions, TransactionOptions {}

export interface UpgradeSwthMsg {
  NeoTxHash: string,
  NeoAddress: string,
  AccAddress: string,
  Amount: string,
  ValAddress: string,
  Originator?: string,
}
export async function upgradeSWTH(wallet: Wallet, msg: UpgradeSwthMsg, options?: Options) {
  return upgradeSWTHs(wallet, [msg], options)
}

export async function upgradeSWTHs(wallet: Wallet, msgs: UpgradeSwthMsg[], options?: Options) {
  const address = wallet.pubKeyBech32
  msgs = msgs.map(msg => {
    if (!msg.Originator) msg.Originator = address
    return msg
  })

  return wallet.signAndBroadcast(msgs, Array(msgs.length).fill(types.UPGRADE_SWTH_MSG_TYPE), options)
}
