import * as bip32 from 'bip32'
import * as bip39 from 'bip39'
import fetch from 'node-fetch'
import Dagger from '@maticnetwork/eth-dagger'
import { ethers } from 'ethers'
import { CONFIG, NETWORK, Network } from './config'
import { Fee, StdSignDoc, Transaction } from './containers'
import { marshalJSON } from './utils/encoder'
import { getPath, PrivKeySecp256k1, PubKeySecp256k1 } from './utils/wallet'
import { ConcreteMsg } from './containers/Transaction'
import { HDWallet } from './utils/hdwallet'
import BALANCE_READER_ABI from './eth/abis/balanceReader.json'

export interface SignMessageOptions { memo?: string, sequence?: string }
export interface WalletOptions { useSequenceCounter?: boolean, broadcastQueueIntervalTime?: number }
export interface BroadcastQueueItem { id: string, concreteMsgs: ConcreteMsg[], options: any }
export interface BroadcastResults {
  [id: string]: any
}

export class Wallet {
  public static async connect(mnemonic: string, net = 'LOCALHOST', walletOptions?: WalletOptions) {
    const network = NETWORK[net]
    if (!network) {
      throw new Error('network must be LOCALHOST/DEVNET/TESTNET')
    }
    const privateKey = getPrivKeyFromMnemonic(mnemonic)
    const pubKeyBech32 = new PrivKeySecp256k1(Buffer.from(privateKey, 'hex')).toPubKey().toAddress().toBech32('swth')
    const { result: { value }} = await fetch(`${network.REST_URL}/get_account?account=${pubKeyBech32}`)
      .then(res => res.json())
    return new Wallet(mnemonic, value.account_number.toString(), network, walletOptions)
  }

  public readonly mnemonic: string
  public readonly hdWallet: HDWallet
  public readonly privKey: PrivKeySecp256k1
  public readonly address: Uint8Array
  public readonly pubKeySecp256k1: PubKeySecp256k1
  public readonly pubKeyBase64: string
  public readonly pubKeyBech32: string
  public readonly validatorBech32: string
  public readonly consensusBech32: string
  public readonly gas: string
  public readonly network: Network
  public accountNumber: string
  public broadcastMode: string

  private useSequenceCounter: boolean
  private sequenceCounter?: number
  private broadcastQueueIntervalTime: number
  private broadcastQueueIntervalId: number
  private broadcastQueue: BroadcastQueueItem[]
  private broadcastResults: BroadcastResults
  private isBroadcastQueuePaused: boolean

  constructor(mnemonic, accountNumber, network, walletOptions?: WalletOptions) {
    const privateKey = getPrivKeyFromMnemonic(mnemonic)
    const privKey = new PrivKeySecp256k1(Buffer.from(privateKey, 'hex'))

    this.mnemonic = mnemonic
    this.privKey = privKey
    this.address = privKey.toPubKey().toAddress().toBytes()
    this.pubKeySecp256k1 = privKey.toPubKey()
    this.pubKeyBase64 = this.pubKeySecp256k1.pubKey.toString('base64')
    this.pubKeyBech32 = this.pubKeySecp256k1.toAddress().toBech32('swth')
    this.validatorBech32 = this.pubKeySecp256k1.toAddress().toBech32('swthvaloper')
    this.consensusBech32 = this.pubKeySecp256k1.toAddress().toBech32('swthvalconspub')
    this.gas = CONFIG.DEFAULT_GAS
    this.accountNumber = accountNumber
    this.network = network
    this.hdWallet = HDWallet.getWallet(mnemonic)

    if (walletOptions === undefined) {
      walletOptions = {}
    }

    this.useSequenceCounter = true
    if (walletOptions.useSequenceCounter !== undefined) {
      this.useSequenceCounter = walletOptions.useSequenceCounter
    }

    this.broadcastQueueIntervalTime = 100
    if (walletOptions.broadcastQueueIntervalTime !== undefined) {
      this.broadcastQueueIntervalTime = walletOptions.broadcastQueueIntervalTime
    }

    this.broadcastQueue = []
    this.broadcastResults = {}

    this.broadcastQueueIntervalId = <any>setInterval(() => {
      this.processBroadcastQueue()
    }, this.broadcastQueueIntervalTime)
  }

  public disconnect() {
    clearInterval(this.broadcastQueueIntervalId)
  }

  public getWalletOptions(): WalletOptions {
    return {
      useSequenceCounter: this.useSequenceCounter,
      broadcastQueueIntervalTime: this.broadcastQueueIntervalTime,
    }
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

  public getOrders() {
    return fetch(`${this.network.REST_URL}/get_orders?account=${this.pubKeyBech32}`)
      .then(res => res.json()) // expecting a json response
  }

  public getOpenOrders() {
    return fetch(`${this.network.REST_URL}/get_orders?account=${this.pubKeyBech32}&order_status=open`)
      .then(res => res.json()) // expecting a json response
  }

  public getWalletBalance() {
    return fetch(`${this.network.REST_URL}/get_balance?account=${this.pubKeyBech32}`)
      .then(res => res.json()) // expecting a json response
  }

  public getLeverage(market: string) {
    return fetch(`${this.network.REST_URL}/get_leverage?market=${market}&account=${this.pubKeyBech32}`)
      .then(res => res.json()) // expecting a json response
  }

  public getPosition(market: string) {
    return fetch(`${this.network.REST_URL}/get_position?account=${this.pubKeyBech32}&market=${market}`)
      .then(res => res.json()) // expecting a json response
  }

  public async watchDepositAddresses() {
    const address = await this.getDepositAddress('eth')

    // do an initial check
    this.requestDeposits(address, 'eth')

    const dagger = new Dagger(this.network.ETH_WS_URL)
    // watch for ETH transfers
    dagger.on(`latest:addr/${address}/tx/in`, () => {
      this.requestDeposits(address, 'eth')
    })

    // watch for Ethereum token transfers
    const transferId = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'
    dagger.on(`latest:log/+/filter/${transferId}/+/${address}/#`, () => {
      this.requestDeposits(address, 'eth')
    })
  }

  public async requestDeposits(address, blockchain) {
    if (blockchain != 'eth') {
      throw new Error('Unsupported blockchain')
    }

    const tokens = await this.getExternalBalances(address, blockchain)
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i]
      if (token.externalBalance != '0') {
        // TODO: request deposit
      }
    }
  }

  public getDepositAddress(blockchain: string) {
    if (blockchain !== 'eth') {
      return "example address"
    }
    const privateKey = this.hdWallet[blockchain]
    const account = new ethers.Wallet(privateKey)
    return account.address
  }

  public async getExternalBalances(address: string, blockchain: string) {
    if (blockchain !== 'eth') {
      throw new Error('Unsupported blockchain')
    }

    const tokens = (await this.getTokens()).filter(token => token.blockchain == blockchain && token.asset_id.startsWith('0x'))
    const assetIds = tokens.map(token => token.asset_id)
    const abi = BALANCE_READER_ABI
    const provider = ethers.getDefaultProvider(this.network.ETH_ENV)
    const contractAddress = this.network.BALANCE_READER_ADDRESS
    const contract = new ethers.Contract(contractAddress, abi, provider)

    const balances = await contract.getBalances(address, assetIds)
    for (let i = 0; i < tokens.length; i++) {
      tokens[i].externalBalance = balances[i].toString()
    }

    return tokens
  }

  public async signMessage(msgs: ConcreteMsg[], options: SignMessageOptions = {}) {
    let sequence: string = options.sequence

    if (sequence === undefined || sequence === null) { // no sequence override, we get latest from blockchain
      const { result } = await this.getAccount()
      sequence = result.value.sequence
    }

    if (this.accountNumber === "0" || this.accountNumber === undefined || this.accountNumber === null) {
      const { result } = await this.getAccount()
      this.accountNumber = result.value.account_number.toString()
      if (this.accountNumber === "0") {
        throw new Error("Account number still 0 after refetching.")
      }
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
    if (this.useSequenceCounter === true) {
      return await this.seqSignAndBroadcast(msgs, types, options)
    }

    const concreteMsgs = this.constructConcreteMsgs(msgs, types)
    const signature = await this.signMessage(concreteMsgs, options)
    const broadcastTxBody = new Transaction(concreteMsgs, [signature], options)

    return this.broadcast(broadcastTxBody)
  }

  // When doing a direct broadcast there are problems with sequence numbers
  // and blocking requests
  // Problem 1: Cosmos requires that each txn from an address has a sequence
  // number that increases by 1 per txn
  // If the sequence number has been used before or is more than 1 ahead of the
  // last seen sequence number, then the Cosmos server will reject the txn
  // Problem 2: To get the logs of a txn, the txn request needs to be sent with
  // a "block" mode, this makes the request wait for the txn to be included into
  // a block
  // This can the UI/UX to appear slow if a user does multiple actions within 1 second
  //
  // seqSignAndBroadcast solves these issues by enqueueing msgs into a queue
  // the queue is then checked and processed periodically
  // when processing, the msgs are batched into a single txn then signed
  // the sequenceCounter is also used to manually keep track of the correct
  // sequqne number to use for each txn
  public async seqSignAndBroadcast(msgs: object[], types: string[], options) {
    const concreteMsgs = this.constructConcreteMsgs(msgs, types)
    const id = Math.random().toString(36).substr(2, 9)
    this.broadcastQueue.push({ id, concreteMsgs, options })

    while (true) {
      // sleep for broadcastQueueIntervalTime ms
      await new Promise(resolve => setTimeout(resolve, 100))
      const result = this.broadcastResults[id]
      if (result !== undefined) {
        delete this.broadcastResults[id]
        return result
      }
    }
  }

  private async processBroadcastQueue() {
    if (this.broadcastQueue.length === 0) { return }
    if (this.isBroadcastQueuePaused === true) { return }

    this.isBroadcastQueuePaused = true

    if (this.sequenceCounter === undefined) {
      const { result } = await this.getAccount()
      this.sequenceCounter = result.value.sequence
    }

    const ids = []
    let allConcreteMsgs = []

    while (true) {
      if (this.broadcastQueue.length === 0) { break }
      if (allConcreteMsgs.length + this.broadcastQueue[0].concreteMsgs.length > 100) { break }

      const { id, concreteMsgs } = this.broadcastQueue.shift()

      ids.push(id)
      allConcreteMsgs = allConcreteMsgs.concat(concreteMsgs)
    }

    const currSequence = this.sequenceCounter.toString()
    const options = { sequence: currSequence }
    this.sequenceCounter++

    const signature = await this.signMessage(allConcreteMsgs, options)
    const broadcastTxBody = new Transaction(allConcreteMsgs, [signature], { mode: 'block' })

    const response = await this.broadcast(broadcastTxBody)
    response.sequence = currSequence

    let rawLogs
    try {
      rawLogs = JSON.parse(response.raw_log)
    } catch (e) {
      // ignore parsing error
    }

    for (let i = 0; i < ids.length; i++) {
      const id = ids[i]
      const responseCopy = JSON.parse(JSON.stringify(response))
      if (response.logs !== undefined) {
        responseCopy.logs = [response.logs[i]]
      }
      if (rawLogs !== undefined) {
        responseCopy.raw_log = JSON.stringify([rawLogs[i]])
      }
      this.broadcastResults[id] = responseCopy
    }

    const isInvalidSequence = response.raw_log === 'unauthorized: signature verification failed; verify correct account sequence and chain-id'
    if (isInvalidSequence) {
      // reset sequenceCounter
      this.sequenceCounter = undefined
    }

    this.isBroadcastQueuePaused = false
  }

  private constructConcreteMsgs(msgs: object[], types: string[]) {
    if (msgs.length != types.length) throw new Error("Msg length is not equal to types length")
    if (msgs.length > 100) throw new Error("Cannot broadcast more than 100 messages in 1 transaction")

    let concreteMsgs: ConcreteMsg[] = []
    // format message with concrete codec type
    for (let i = 0; i < msgs.length; i++) {
      concreteMsgs[i] = {
        type: types[i],
        value: msgs[i],
      }
    }

    return concreteMsgs
  }
}

export function newAccount() {
  const mnemonic = bip39.generateMnemonic()
  const privateKey = getPrivKeyFromMnemonic(mnemonic)
  const pubKeyBech32 = new PrivKeySecp256k1(Buffer.from(privateKey, 'hex')).toPubKey().toAddress().toBech32('swth')
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
