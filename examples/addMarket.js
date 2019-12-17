// const SDK = require('switcheo-chain-js-sdk') // use this instead if running this sdk as a library
const SDK = require('../.')
const { wallet, api } = SDK
const { Wallet } = wallet
const mnemonics = require('../mnemonics.json')

const privateKey = wallet.getPrivKeyFromMnemonic(mnemonics[1])

async function addMarket() {
  const wallet = await Wallet.connect(privateKey)
  const params = {
    name: 'LIBRA',
    description: 'libra is the best coin',
    base: 'eth',
    quote: 'btc',
    lotSize: '1000',
    tickSize: '0.01',
    minQuantity: '1000',
    marketType: 'spot',
  }
  api.addMarket(wallet, params).then(console.log)
}

addMarket()
