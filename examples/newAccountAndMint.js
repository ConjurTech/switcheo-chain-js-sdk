// const SDK = require('switcheo-chain-js-sdk') // use this instead if running this sdk as a library
const SDK = require('../index')

const mnemonic = 'myself cross give glue viable suggest satisfy warrior also brass kitten merge arrive index swap evidence baby return armed grunt legend manage term diary'
const privateKey = SDK.getPrivKeyFromMnemonic(mnemonic)

const net = 'LOCALHOST'
// const net = 'DEVNET'
const newAccount = SDK.newAccount()
const newPrivateKey = newAccount.privateKey
const newPrivateKeyWallet = SDK.connect(newPrivateKey)
console.log(newAccount)

const privateKeyWallet = SDK.connect(privateKey)
const address = privateKeyWallet.pubKeyBech32
const newAddress = newPrivateKeyWallet.pubKeyBech32
const toAddress = newAddress
console.log(toAddress)

const msg = new SDK.MintTokenMsg({
  originator: address,
  toAddress,
  amount: '1000',
  denom: 'swth',
})
privateKeyWallet.signMessage(msg)
  .then(signature => {
    const broadcastTxBody = new SDK.Transaction(
      SDK.types.MINT_TOKEN_MSG_TYPE,
      msg,
      signature,
    )
    privateKeyWallet.broadcast(broadcastTxBody).then(console.log)
  })
