// const SDK = require('switcheo-chain-js-sdk') // use this instead if running this sdk as a library
const SDK = require('../index')

const mnemonic = 'myself cross give glue viable suggest satisfy warrior also brass kitten merge arrive index swap evidence baby return armed grunt legend manage term diary'

SDK.connect(mnemonic)
  .then((wallet) => {
    const address = wallet.pubKeyBech32
    const toAddress = 'cosmos1rzdwrr33z5pxw2ndtsdluxhce9p26emfs0f5dm'

    const msg = new SDK.MintTokenMsg({
      originator: address,
      toAddress,
      amount: '1000',
      denom: 'swth',
    })
    wallet.signMessage(msg)
      .then(signature => {
        const broadcastTxBody = new SDK.Transaction(
          SDK.types.MINT_TOKEN_MSG_TYPE,
          msg,
          signature,
        )

        wallet.broadcast(broadcastTxBody).then(console.log)
      }) // signMessage

  }) // connect
