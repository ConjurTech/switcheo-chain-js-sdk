// const SDK = require('switcheo-chain-js-sdk') // use this instead if running this sdk as a library
const SDK = require('../.')
const { wallet, api } = SDK
const { BigNumber } = require('bignumber.js')
const mnemonics = require('../mnemonics.json')

const mnemonic = mnemonics[1]
const privateKey = wallet.getPrivKeyFromMnemonic(mnemonic)

const net = 'LOCALHOST'
// const net = 'DEVNET'

wallet.Wallet.connect(privateKey).then((_wallet) => {
  const params = {
    Market: 'swth_eth',
    Side: 'buy',
    Quantity: '0.987',
    Price: new BigNumber(1.01).toString(),
  }
  console.log(params)
  api.placeOrder(_wallet, params)
    .then(console.log)
})
