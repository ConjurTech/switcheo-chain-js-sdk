// const SDK = require('switcheo-chain-js-sdk') // use this instead if running this sdk as a library
const SDK = require('../index')

const net = 'LOCALHOST'
// const net = 'DEVNET'
const mnemonic = 'myself cross give glue viable suggest satisfy warrior also brass kitten merge arrive index swap evidence baby return armed grunt legend manage term diary'
const privateKey = SDK.getPrivKey(mnemonic)
const privateKeyWallet = SDK.connectWithPrivKey(privateKey, net)
console.log(privateKeyWallet)

// SDK.connect(mnemonic, net)
//   .then((wallet) => {
//     wallet.getAccount().then(({ result: { value } }) => {
//       console.log(value.account_number) // signed messages includes this. this is unique and incremental for every new account.
//       console.log(value.sequence) // txn nonce
//       console.log(value.address) // this address can be empty if account does not exist
//       console.log(wallet.pubKeyBech32) // this address is derived offline from mnemonic
//     })
//   })

// const privateKeyWallet = SDK.connectWithPrivKey(privateKey)
// const msg = new SDK.CreateOrderMsg({
//   originator: privateKeyWallet.pubKeyBech32,
//   pair: 'swth_eth',
//   side: 'buy',
//   quantity: '100',
//   price: '0.01',
// })
// privateKeyWallet.signMessage(msg)
//   .then(signature => {
//     console.log(signature)
//   })


// SDK.connect(mnemonic, net).then((wallet) => {
//   // console.log(wallet)
//   const address = wallet.pubKeyBech32
//   // console.log(address)
//   wallet.getAccount().then(({ result: { value } }) => {
//     const msg = new SDK.CreateOrderMsg({
//       originator: address,
//       pair: 'swth_eth',
//       side: 'buy',
//       quantity: '100',
//       price: '0.01',
//     })

//     // const stdSignMsg = new SDK.StdSignDoc({
//     //   chainId: 'switcheochain',
//     //   accountNumber: value.account_number,
//     //   sequence: value.sequence,
//     //   fee: {
//     //     amount: [],
//     //     gas: '1000000000000'
//     //   },
//     //   msgs: [
//     //     msg,
//     //   ],
//     //   memo: '',
//     // })

//     // SDK.sign(account.privateKey, SDK.marshalJSON(stdSignMsg)).then(res => {
//     //   const signature = {
//     //     pub_key: {
//     //       type: 'tendermint/PubKeySecp256k1',
//     //       value: wallet.pubKeyBase64,
//     //     },
//     //     signature: res.toString('base64'),
//     //   }
//     // })

//     // SDK.signWithMnemonic(account.mnemonic, SDK.marshalJSON(stdSignMsg)).then(res => {
//     //   const signature = {
//     //     pub_key: {
//     //       type: 'tendermint/PubKeySecp256k1',
//     //       value: wallet.pubKeyBase64,
//     //     },
//     //     signature: res.toString('base64'),
//     //   }
//     //   // const broadcastTxBody = new SDK.Transaction(
//     //   //   SDK.types.PLACE_ORDER_MSG_TYPE,
//     //   //   msg,
//     //   //   signature,
//     //   // )
//     //   // wallet.broadcast(broadcastTxBody).then(console.log)
//     // })

//     wallet.signMessage(msg)
//       .then(signature => {
//         const broadcastTxBody = new SDK.Transaction(
//           SDK.types.PLACE_ORDER_MSG_TYPE,
//           msg,
//           signature,
//         )
//         // wallet.broadcast(broadcastTxBody).then(console.log)
//         console.log(signature)
//       }) // signMessage


//   })
// })
