const bip39 = require('bip39')
const bip32 = require('bip32')
const fetch = require('node-fetch')
const { NETWORK, CONFIG } = require('./config')
const { Fee, StdSignDoc } = require('./containers/StdSignDoc')
const { marshalJSON } = require('./utils/encoder')
const { BIP44, PrivKeySecp256k1 } = require('./utils/wallet')

class PrivateKeyWallet {
  constructor(privateKey, network) {
    const privKey = new PrivKeySecp256k1(Buffer.from(privateKey, 'hex'))

    this.privKey = privKey
    this.address = privKey.toPubKey().toAddress().toBytes()
    this.pubKeySecp256k1 = privKey.toPubKey()
    this.pubKeyBase64 = this.pubKeySecp256k1.pubKey.toString('base64')
    this.pubKeyBech32 = this.pubKeySecp256k1.toAddress().toBech32('cosmos')
    this.gas = CONFIG.DEFAULT_GAS
    this.network = network
  }

  sign(message) {
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

  broadcast(body) {
    return fetch(`${this.network.REST_URL}/txs`, { method: 'POST', body: JSON.stringify(body) })
      .then(res => res.json()) // expecting a json response
  }

  getAccount() {
    return fetch(`${this.network.REST_URL}/auth/accounts/${this.pubKeyBech32}`)
      .then(res => res.json()) // expecting a json response
  }

  signMessage(msg, options = {}) {
    return this.getAccount().then(({ result: { value } }) => {
      const memo = options.memo || ''
      const stdSignMsg = new StdSignDoc({
        chainId: CONFIG.CHAIN_ID,
        accountNumber: value.account_number,
        sequence: value.sequence,
        fee: new Fee([], this.gas),
        msgs: [
          msg,
        ],
        memo,
      })
      return this.sign(marshalJSON(stdSignMsg))
    })
  }
}

function connect(privateKey, net = 'LOCALHOST') {
  const network = NETWORK[net]
  if (!network) throw new Error('network must be LOCALHOST/DEVNET')

  return new PrivateKeyWallet(privateKey, network)
}

function getPath() {
  const bip44 = new BIP44(44, 118, 0)
  const index = 0
  const change = 0
  return bip44.pathString(index, change)
}

function newAccount() {
  const mnemonic = bip39.generateMnemonic()
  return {
    mnemonic,
    privateKey: getPrivKeyFromMnemonic(mnemonic),
  }
}

function getPrivKeyFromMnemonic(mnemonic) {
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

module.exports = {
  connect,
  newAccount,
  getPrivKeyFromMnemonic,
}
