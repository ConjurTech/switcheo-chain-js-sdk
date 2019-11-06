// const SDK = require('switcheo-chain-js-sdk') // use this instead if running this sdk as a library
const SDK = require('../index')

const mnemonic = 'myself cross give glue viable suggest satisfy warrior also brass kitten merge arrive index swap evidence baby return armed grunt legend manage term diary'

SDK.connect(mnemonic)
  .then((wallet) => {
    const address = wallet.pubKeyBech32
    const msg = new SDK.CreateOrderMsg({
      originator: address,
      pair: 'swth_eth',
      side: 'buy',
      quantity: '100',
      price: '0.01',
    })
    wallet.signMessage(msg)
      .then(signature => {
        const broadcastTxBody = new SDK.Transaction(
          SDK.types.PLACE_ORDER_MSG_TYPE,
          msg,
          signature,
        )
        wallet.broadcast(broadcastTxBody).then(console.log)
      }) // signMessage

  }) // connect
