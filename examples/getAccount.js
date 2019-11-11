// const SDK = require('switcheo-chain-js-sdk') // use this instead if running this sdk as a library
const SDK = require('../.')
const { wallet } = SDK

const net = 'LOCALHOST'
// const net = 'DEVNET'
const mnemonic = 'fan clump antique answer height room onion choose afraid need spring pumpkin between burger unit vague love peace lend salmon trophy quit staff mix'
const privateKey = wallet.getPrivKeyFromMnemonic(mnemonic)
wallet.Wallet.connect(privateKey, net).then((_wallet) => {
  _wallet.getAccount().then(console.log)
})
