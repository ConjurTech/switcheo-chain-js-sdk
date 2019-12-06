// const SDK = require('switcheo-chain-js-sdk') // use this instead if running this sdk as a library
const SDK = require('../build/main')
const { wallet, api } = SDK

const mnemonic = 'amazing cake include draft pool frame valid cup screen used poet nominee cage clarify edge early job magnet april suspect super lonely space fire'
const privateKey = wallet.getPrivKeyFromMnemonic(mnemonic)

const net = 'LOCALHOST'
// const net = 'DEVNET'

wallet.Wallet.connect(privateKey).then((_wallet) => {
  const params = {
    symbol: 'JRC',
    name: 'jiarong coin',
    decimals: '10',
    nativeBlockchain: 'eos',
    usdValue: '0.01',
  }
  api.addToken(_wallet, params)
    .then(console.log)
})
