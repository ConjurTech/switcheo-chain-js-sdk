// const SDK = require('switcheo-chain-js-sdk') // use this instead if running this sdk as a library
const SDK = require('../.')
const { wallet, api } = SDK
const { Wallet } = wallet
const mnemonics = require('../mnemonics.json')

const privateKey = wallet.getPrivKeyFromMnemonic(mnemonics[1])

async function addToken() {
  const wallet = await Wallet.connect(privateKey)
  const params = {
    symbol: 'LAYWC',
    name: 'jiarong coin',
    decimals: '10',
    nativeBlockchain: 'eos',
    usdValue: '0.01',
  }
  api.addToken(wallet, params).then(console.log)
}

addToken()
