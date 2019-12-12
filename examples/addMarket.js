// const SDK = require('switcheo-chain-js-sdk') // use this instead if running this sdk as a library
const SDK = require('../build/main')
const { wallet, api } = SDK

const mnemonic = 'item join cruel state fall stick sword stem punch lava next jewel waste now clock interest end measure gentle boost ignore profit near unlock'
const privateKey = wallet.getPrivKeyFromMnemonic(mnemonic)

const net = 'LOCALHOST'
// const net = 'DEVNET'

wallet.Wallet.connect(privateKey).then((_wallet) => {
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
  console.log(params)
  api.addMarket(_wallet, params)
    .then(console.log)
})
