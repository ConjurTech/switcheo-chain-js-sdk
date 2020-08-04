import * as types from '../types'
import { Wallet, SignMessageOptions }  from '../wallet'
import { TransactionOptions } from '../containers/Transaction'
import { getNetwork } from '../config'

interface Options extends SignMessageOptions, TransactionOptions {}

export interface UpdateProfileMsg {
  Username: string,
  Twitter: string,
  Originator?: string,
}


export async function updateProfile(wallet: Wallet, msg: UpdateProfileMsg, options?: Options) {
	if(!msg.Originator) {
    msg.Originator = wallet.pubKeyBech32
  }
  return wallet.signAndBroadcast([msg], [types.UPDATE_PROFILE_MSG_TYPE], options)
}

export function getProfile(net: string, address: string) {
  const network = getNetwork(net)
  return fetch(`${network.REST_URL}/get_profile?account=${address}`)
    .then(res => res.json()) // expecting a json response
}

export function getUsernameIsTaken(net: string, username: string) {
  const network = getNetwork(net)
  return fetch(`${network.REST_URL}/username_check?username=${username}`)
    .then(res => res.json()) // expecting a json response
}
