const fetch = require('node-fetch')
const { getWallet } = require('../src/wallet')
const { REST_URL } = require('../src/config')
const { start } = require('../examples/signAndBroadcast');

const { AccAddress } = require('@node-a-team/cosmosjs/common/address')

const mnemonic = 'level lesson remember acquire dog margin labor mesh private unveil ancient another chest organ finish sing juice venture minute narrow bean pilot require proof'
// getWallet(mnemonic).then(wallet => {
//   console.log(wallet.pubKeyBech32 === 'cosmos1f5yy80ckws7uaapt2fsxr3f76r9ydqc9w7hkvr')
//   fetch(`${REST_URL}/auth/accounts/${wallet.pubKeyBech32}`)
//     .then(res => res.json()) // expecting a json response
//     .then(res => {
//       const { account_number: accountNumber } = res.result.value
//       console.log(accountNumber)
//       start(mnemonic, accountNumber)
//     })
// })

// jack02
const jack02Mnemonic = 'mimic reduce combine question weird earn interest where mule certain music twist whip theme tenant phone member manual loop trim program web fiscal pattern'
// console.log(AccAddress.fromBech32('cosmos1a4wt4ppsyvjmha747s59h2h3rte2tnrpe2w80e'))

getWallet(jack02Mnemonic)
  .then(jack02Wallet => {

    getWallet(mnemonic).then(wallet => {
    // console.log(wallet.pubKeyBech32)

    fetch(`${REST_URL}/auth/accounts/${wallet.pubKeyBech32}`)
      .then(res => res.json()) // expecting a json response
      .then(res => {
        const { account_number: accountNumber } = res.result.value
        console.log(accountNumber)

        // wallet.sendToken(new AccAddress(wallet.address)).then(res => {
        //   console.log(res)
        // })
      })
    })
  })

// getWallet(mnemonic).then(wallet => {
//   console.log(wallet.pubKeyBech32)
//   fetch(`${REST_URL}/auth/accounts/${wallet.pubKeyBech32}`)
//     .then(res => res.json()) // expecting a json response
//     .then(res => {
//       const { account_number: accountNumber } = res.result.value
//       console.log(accountNumber)
//       wallet.sendToken('cosmos1f5yy80ckws7uaapt2fsxr3f76r9ydqc9w7hkvr').then(res => {
//         console.log(res)
//       })
//     })
// })
