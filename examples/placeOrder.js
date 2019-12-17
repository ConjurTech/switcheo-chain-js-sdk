// const SDK = require('switcheo-chain-js-sdk') // use this instead if running this sdk as a library
const SDK = require('../.')
const { wallet, api } = SDK
const { Wallet } = wallet
const { BigNumber } = require('bignumber.js')
// const mnemonics = require('../mnemonics.json')

const privateKey = wallet.getPrivKeyFromMnemonic(mnemonics[1])

async function placeOrder() {
  const wallet = await Wallet.connect(privateKey)
  const params = {
    Market: 'swth_eth',
    Side: 'sell',
    Quantity: '0.987',
    Price: new BigNumber(1.01).toString(),
  }
  api.placeOrder(wallet, params).then(console.log)
}
placeOrder()
