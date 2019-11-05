const { LocalWalletProvider } = require('@node-a-team/cosmosjs/core/walletProvider')
const fetch = require('node-fetch')
const { GaiaApi } = require('@node-a-team/cosmosjs/gaia/api')
const { CHAIN_ID, RPC_URL, REST_URL } = require('./config')
const { Fee, StdSignDoc } = require('./StdSignDoc')
const { marshalJSON } = require('./encoder')
// const { Fee, Msg, StdSignMsg } = require('./StdSignMsg')

// default properties
const memo = ''

class Wallet {
  constructor(api, account) {
    this.api = api

    this.address = account.address
    this.pubKeySecp256k1 = account.pubKey
    this.pubKeyBase64 = this.pubKeySecp256k1.pubKey.toString('base64')
    this.pubKeyBech32 = this.pubKeySecp256k1.toAddress().toBech32('cosmos')
    this.gas = '1000000000000'
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
    return fetch(`${REST_URL}/txs`, { method: 'POST', body: JSON.stringify(body) })
      .then(res => res.json()) // expecting a json response
  }

  getAccount() {
    return fetch(`${REST_URL}/auth/accounts/${this.pubKeyBech32}`)
      .then(res => res.json()) // expecting a json response
  }

  signMessage(msg, accountNumber, sequence) {
    const stdSignMsg = new StdSignDoc({
      chainId: CHAIN_ID,
      accountNumber,
      sequence,
      fee: new Fee([], this.gas),
      msgs: [
        msg,
      ],
      memo,
    })
    return this.sign(marshalJSON(stdSignMsg))
  }

  getTransferMsg(toAddress, body) {
    return fetch(`${REST_URL}/bank/accounts/${toAddress}/transfers`, { method: 'POST', body: JSON.stringify(body) })
      .then(res => res.json()) // expecting a json response
  }
}

function getWallet(mnemonic) {
  const wallet = new LocalWalletProvider(mnemonic)

  const api = new GaiaApi({
    chainId: CHAIN_ID,
    walletProvider: wallet,
    rpc: RPC_URL,
    rest: REST_URL,
  })

  return new Promise((resolve, reject) => {
    api.signIn(0)
      .then(() => {
        api.wallet.getSignerAccounts(api.context)
          .then(wallets => {
            const account = wallets[0]
            const wallet = new Wallet(api, account)

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
