// const SDK = require('switcheo-chain-js-sdk') // use this instead if running this sdk as a library
const SDK = require('../index')
const { wallet, msgs, containers, types } = SDK

const mnemonic = 'myself cross give glue viable suggest satisfy warrior also brass kitten merge arrive index swap evidence baby return armed grunt legend manage term diary'
const privateKey = wallet.getPrivKeyFromMnemonic(mnemonic)

const net = 'LOCALHOST'
// const net = 'DEVNET'

const privateKeyWallet = wallet.connect(privateKey)
const address = privateKeyWallet.pubKeyBech32

const msg = new msgs.CreateOrderMsg({
  originator: address,
  pair: 'swth_eth',
  side: 'buy',
  quantity: '100',
  price: '0.01',
})
privateKeyWallet.signMessage(msg)
  .then(signature => {
    const broadcastTxBody = new containers.Transaction(
      types.PLACE_ORDER_MSG_TYPE,
      msg,
      signature,
    )
    privateKeyWallet.broadcast(broadcastTxBody).then(console.log)
  })
