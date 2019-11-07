// const SDK = require('switcheo-chain-js-sdk') // use this instead if running this sdk as a library
const SDK = require('../index')
const { wallet } = SDK

const net = 'LOCALHOST'
// const net = 'DEVNET'
const mnemonic = 'myself cross give glue viable suggest satisfy warrior also brass kitten merge arrive index swap evidence baby return armed grunt legend manage term diary'
const privateKey = wallet.getPrivKeyFromMnemonic(mnemonic)
const privateKeyWallet = wallet.connect(privateKey, net)
console.log(privateKeyWallet)
