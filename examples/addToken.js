// const SDK = require('switcheo-chain-js-sdk') // use this instead if running this sdk as a library
const SDK = require('../build/main')
const { wallet, api } = SDK
const mnemonics = require('../mnemonics.json')

const mnemonic = mnemonics[1]
const privateKey = wallet.getPrivKeyFromMnemonic(mnemonic)

const net = 'LOCALHOST'
// const net = 'DEVNET'

wallet.Wallet.connect(privateKey).then((_wallet) => {
  const params = {
    symbol: 'LAYWC',
    name: 'jiarong coin',
    decimals: '10',
    nativeBlockchain: 'eos',
    usdValue: '0.01',
  }
  api.addToken(_wallet, params)
    .then(console.log)
})
