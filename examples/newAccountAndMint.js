// const SDK = require('switcheo-chain-js-sdk') // use this instead if running this sdk as a library
const SDK = require('../.')
const { wallet, api } = SDK

const mnemonic = 'fan clump antique answer height room onion choose afraid need spring pumpkin between burger unit vague love peace lend salmon trophy quit staff mix'
const privateKey = wallet.getPrivKeyFromMnemonic(mnemonic)

const net = 'LOCALHOST'
// const net = 'DEVNET'

const newAccount = wallet.newAccount()
const newPrivateKey = newAccount.privateKey
wallet.Wallet.connect(newPrivateKey).then((newPrivateKeyWallet) => {
  const newAddress = newPrivateKeyWallet.pubKeyBech32
  const toAddress = newAddress
  console.log(newAccount, toAddress)

  wallet.Wallet.connect(privateKey).then((_wallet) => {
    const params = {
      toAddress,
      amount: '1000',
      denom: 'swth',
    }
    api.mintToken(_wallet, params)
      .then(console.log)
  })
})
