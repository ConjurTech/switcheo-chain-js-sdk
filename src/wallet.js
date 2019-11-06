const { LocalWalletProvider } = require('@node-a-team/cosmosjs/core/walletProvider')
const fetch = require('node-fetch')
const { GaiaApi } = require('@node-a-team/cosmosjs/gaia/api')
const { NETWORK, CONFIG } = require('./config')
const { Fee, StdSignDoc } = require('./containers/StdSignDoc')
const { marshalJSON } = require('./utils/encoder')

class Wallet {
  constructor(api, account, network) {
    this.api = api

    this.address = account.address
    this.pubKeySecp256k1 = account.pubKey
    this.pubKeyBase64 = this.pubKeySecp256k1.pubKey.toString('base64')
    this.pubKeyBech32 = this.pubKeySecp256k1.toAddress().toBech32('cosmos')
    this.gas = CONFIG.DEFAULT_GAS
    this.network = network
  }

  sign(message) {
    return new Promise((resolve, reject) => {
      const { context } = this.api

      this.api.wallet.sign(context, this.address, message)
        .then((data) => {
          const signatureBase64 = data.toString('base64')

          resolve({
            pub_key: {
              type: 'tendermint/PubKeySecp256k1',
              value: this.pubKeyBase64,
            },
            signature: signatureBase64,
          })

        })
      .catch(err => reject(err))
    })
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

function getWallet(mnemonic, net = 'LOCALHOST') {
  const wallet = new LocalWalletProvider(mnemonic)
  const network = NETWORK[net]
  if (!network) throw new Error('network must be LOCALHOST/DEVNET')

  const api = new GaiaApi({
    chainId: CONFIG.CHAIN_ID,
    walletProvider: wallet,
    rpc: network.RPC_URL,
    rest: network.REST_URL,
  })

  return new Promise((resolve, reject) => {
    api.signIn(0)
      .then(() => {
        api.wallet.getSignerAccounts(api.context)
          .then(wallets => {
            const account = wallets[0]
            const wallet = new Wallet(api, account, network)

            resolve(wallet)
          })
          .catch(err => reject(err))
      })
      .catch(err => reject(err))
  })
}

module.exports = {
  getWallet,
}
