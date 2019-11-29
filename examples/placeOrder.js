// const SDK = require('switcheo-chain-js-sdk') // use this instead if running this sdk as a library
const SDK = require('../.')
const { wallet, api } = SDK
const { BigNumber } = require('bignumber.js')

const mnemonic = 'daughter sausage slab waste recall stand same glad stereo else post polar barely happy stumble gift consider bachelor mail network neck interest swim trophy'
const privateKey = wallet.getPrivKeyFromMnemonic(mnemonic)

const net = 'LOCALHOST'
// const net = 'DEVNET'

wallet.Wallet.connect(privateKey).then((_wallet) => {
  const params = {
    Pair: 'swth_eth',
    Side: 'buy',
    Quantity: '100',
    Price: new BigNumber(1.01).toFixed(18),
  }
  api.placeOrder(_wallet, params)
    .then(console.log)
})
