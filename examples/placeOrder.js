// const SDK = require('switcheo-chain-js-sdk') // use this instead if running this sdk as a library
const SDK = require('../.')
const { wallet, api } = SDK

const mnemonic = 'myself cross give glue viable suggest satisfy warrior also brass kitten merge arrive index swap evidence baby return armed grunt legend manage term diary'
const privateKey = wallet.getPrivKeyFromMnemonic(mnemonic)

const net = 'LOCALHOST'
// const net = 'DEVNET'

const _wallet = wallet.Wallet.connect(privateKey)
const params = {
  pair: 'swth_eth',
  side: 'buy',
  quantity: '100',
  price: '0.01',
}
api.placeOrder(_wallet, params)
  .then(console.log)
