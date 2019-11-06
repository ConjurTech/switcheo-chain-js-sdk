// const SDK = require('switcheo-chain-js-sdk') // use this instead if running this sdk as a library
const SDK = require('../index')

const mnemonic = 'myself cross give glue viable suggest satisfy warrior also brass kitten merge arrive index swap evidence baby return armed grunt legend manage term diary'

// const network = 'LOCALHOST'
const network = 'DEVNET'
const newMnemonic = SDK.newAccount()
console.log(newMnemonic)

SDK.connect(newMnemonic, network)
  .then(newWallet => {
    const newAddress = newWallet.pubKeyBech32
    console.log(newAddress)
    SDK.connect(mnemonic, network)
      .then((wallet) => {
        const address = wallet.pubKeyBech32
        const toAddress = newAddress

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

      }) // connect wallet
  }) // connect new wallet
