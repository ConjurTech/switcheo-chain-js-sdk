// const SDK = require('switcheo-chain-js-sdk') // use this instead if running this sdk as a library
const SDK = require('../.')
const { wallet, msgs, containers, types } = SDK

const mnemonic = 'myself cross give glue viable suggest satisfy warrior also brass kitten merge arrive index swap evidence baby return armed grunt legend manage term diary'
const privateKey = wallet.getPrivKeyFromMnemonic(mnemonic)

const net = 'LOCALHOST'
// const net = 'DEVNET'

const privateKeyWallet = wallet.Wallet.connect(privateKey)
const address = privateKeyWallet.pubKeyBech32
const toAddress = 'cosmos1rzdwrr33z5pxw2ndtsdluxhce9p26emfs0f5dm'

const msg = new msgs.MintTokenMsg({
  originator: address,
  toAddress,
  amount: '1000',
  denom: 'swth',
})
privateKeyWallet.signMessage(msg)
  .then(signature => {
    const broadcastTxBody = new containers.Transaction(
      types.MINT_TOKEN_MSG_TYPE,
      msg,
      signature,
    )
    privateKeyWallet.broadcast(broadcastTxBody).then(console.log)
  })
