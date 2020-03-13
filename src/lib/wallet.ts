import * as bip32 from 'bip32'
import * as bip39 from 'bip39'
import fetch from 'node-fetch'
import { CONFIG, NETWORK, Network } from './config'
import { Fee, StdSignDoc, Transaction } from './containers'
import { EthWallet } from './ethWallet'
import { marshalJSON } from './utils/encoder'
import { getPath, PrivKeySecp256k1, PubKeySecp256k1 } from './utils/wallet'
import { ConcreteMsg } from './containers/Transaction'

export interface SignMessageOptions { memo?: string, sequence?: string, useCosmosFormat?: boolean }

export class Wallet {
  public static async connect(privateKey: string, net = 'LOCALHOST') {
    const network = NETWORK[net]
    if (!network) {
      throw new Error('network must be LOCALHOST/DEVNET')
    }
    const pubKeyBech32 = new PrivKeySecp256k1(Buffer.from(privateKey, 'hex')).toPubKey().toAddress().toBech32('cosmos')
    const { result: { value }} = await fetch(`${network.REST_URL}/get_account?account=${pubKeyBech32}`)
      .then(res => res.json())
    return new Wallet(privateKey, value.account_number.toString(), network)
  }

  public readonly privKey: PrivKeySecp256k1
  public readonly address: Uint8Array
  public readonly pubKeySecp256k1: PubKeySecp256k1
  public readonly pubKeyBase64: string
  public readonly pubKeyBech32: string
  public readonly validatorBech32: string
  public readonly consensusBech32: string
  public readonly gas: string
  public readonly network: Network
  public readonly accountNumber: string
  public eth: EthWallet
  public broadcastMode: string

  constructor(privateKey, accountNumber, network) {
    const privKey = new PrivKeySecp256k1(Buffer.from(privateKey, 'hex'))

    this.privKey = privKey
    this.address = privKey.toPubKey().toAddress().toBytes()
    this.pubKeySecp256k1 = privKey.toPubKey()
    this.pubKeyBase64 = this.pubKeySecp256k1.pubKey.toString('base64')
    this.pubKeyBech32 = this.pubKeySecp256k1.toAddress().toBech32('cosmos')
    this.validatorBech32 = this.pubKeySecp256k1.toAddress().toBech32('cosmosvaloper')
    this.consensusBech32 = this.pubKeySecp256k1.toAddress().toBech32('cosmosvalconspub')
    this.gas = CONFIG.DEFAULT_GAS
    this.accountNumber = accountNumber
    this.network = network
  }

  public connectEthWallet(web3) {
    this.eth = new EthWallet(web3)
  }

  public sign(message) {
    const privKey = this.privKey
    const data = privKey.sign(message)
    const signatureBase64 = data.toString('base64')
    return {
      pub_key: {
        type: 'tendermint/PubKeySecp256k1',
        value: this.pubKeyBase64,
      },
      signature: signatureBase64,
    }
  }

  public broadcast(body) {
    return fetch(`${this.network.REST_URL}/txs`, { method: 'POST', body: JSON.stringify(body) })
      .then(res => res.json()) // expecting a json response
  }

  public getValidators() {
    return fetch(`${this.network.REST_URL}/get_validators`)
      .then(res => res.json()) // expecting a json response
  }

  public getAccount() {
    return fetch(`${this.network.REST_URL}/get_account?account=${this.pubKeyBech32}`)
      .then(res => res.json()) // expecting a json response
  }

  public getTokens() {
    return fetch(`${this.network.REST_URL}/get_tokens`)
      .then(res => res.json()) // expecting a json response
  }

  public getToken(token: string) {
    return fetch(`${this.network.REST_URL}/token?token=${token}`)
      .then(res => res.json()) // expecting a json response
  }

  public getMarkets() {
    return fetch(`${this.network.REST_URL}/get_markets`)
      .then(res => res.json()) // expecting a json response
  }

  public getMarket(market: string) {
    return fetch(`${this.network.REST_URL}/get_market?market=${market}`)
      .then(res => res.json()) // expecting a json response
  }

  public getOrderbook(market: string) {
    return fetch(`${this.network.REST_URL}/get_orderbook?market=${market}`)
      .then(res => res.json()) // expecting a json response
  }

  public getOrder(orderID: string) {
    return fetch(`${this.network.REST_URL}/get_order?order_id=${orderID}`)
      .then(res => res.json()) // expecting a json response
  }

  public getOrders(account: string) {
    return fetch(`${this.network.REST_URL}/get_orders?account=${account}`)
      .then(res => res.json()) // expecting a json response
  }

  public getOpenOrders(account: string) {
    return fetch(`${this.network.REST_URL}/get_orders?account=${account}&order_status=open`)
      .then(res => res.json()) // expecting a json response
  }

  public getWalletBalance(account: string) {
    return fetch(`${this.network.REST_URL}/get_balance?account=${account}`)
      .then(res => res.json()) // expecting a json response
  }

  public async signMessage(msgs: ConcreteMsg[], options: SignMessageOptions = {}) {
    let sequence: string = options.sequence

    if (sequence === undefined || sequence === null) { // no sequence override, we get latest from blockchain
      const { result } = await this.getAccount()
      sequence = result.value.sequence
    }

    const memo = options.memo || ''
    const stdSignMsg = new StdSignDoc({
      accountNumber: this.accountNumber,
      chainId: CONFIG.CHAIN_ID,
      fee: new Fee([], this.gas),
      memo,
      msgs,
      sequence: sequence.toString(),
    })
    return this.sign(marshalJSON(stdSignMsg))
  }

  public async signAndBroadcast(msgs: object[], types: string[], options) {
    if (msgs.length != types.length) throw new Error("Msg length is not equal to types length")
    let concreteMsgs: ConcreteMsg[] = []
    // format message with concrete codec type
    for (let i = 0; i < msgs.length; i++) {
      concreteMsgs[i] = {
        type: types[i],
        value: msgs[i],
      }
    }
    const signature = await this.signMessage(concreteMsgs, options)
    const broadcastTxBody = new Transaction(concreteMsgs, [signature], options)

    return this.broadcast(broadcastTxBody)
  }
}

export function newAccount() {
  const mnemonic = bip39.generateMnemonic()
  const privateKey = getPrivKeyFromMnemonic(mnemonic)
  const pubKeyBech32 = new PrivKeySecp256k1(Buffer.from(privateKey, 'hex')).toPubKey().toAddress().toBech32('cosmos')
  return {
    mnemonic,
    privateKey,
    pubKeyBech32,
  }
}

export function getPrivKeyFromMnemonic(mnemonic) {
  const path = getPath()
  const seed = bip39.mnemonicToSeedSync(mnemonic, '')
  const masterKey = bip32.fromSeed(seed)
  const hd = masterKey.derivePath(path)

  const privateKey = hd.privateKey
  if (!privateKey) {
    throw new Error("null hd key")
  }
  return privateKey.toString('hex')
}
