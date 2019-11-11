// const SDK = require('switcheo-chain-js-sdk') // use this instead if running this sdk as a library
const SDK = require('../.')
const { wallet, api } = SDK

const mnemonic = 'myself cross give glue viable suggest satisfy warrior also brass kitten merge arrive index swap evidence baby return armed grunt legend manage term diary'
const privateKey = wallet.getPrivKeyFromMnemonic(mnemonic)

const net = 'LOCALHOST'
// const net = 'DEVNET'

const newAccount = wallet.newAccount()
const newPrivateKey = newAccount.privateKey
const newPrivateKeyWallet = wallet.Wallet.connect(newPrivateKey)
const newAddress = newPrivateKeyWallet.pubKeyBech32
const toAddress = newAddress
console.log(newAccount, toAddress)

const _wallet = wallet.Wallet.connect(privateKey)

const params = {
  toAddress,
  amount: '1000',
  denom: 'swth',
}
api.mintToken(_wallet, params)
  .then(console.log)
