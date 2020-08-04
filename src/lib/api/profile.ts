import * as types from '../types'
import { Wallet, SignMessageOptions }  from '../wallet'
import { TransactionOptions } from '../containers/Transaction'

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

export function getProfile() {
  return fetch(`${this.network.REST_URL}/get_profile?account=${this.pubKeyBech32}`)
    .then(res => res.json()) // expecting a json response
}

export function getUsernameIsTaken(username: string) {
  return fetch(`${this.network.REST_URL}/username_check?username=${username}`)
    .then(res => res.json()) // expecting a json response
}
