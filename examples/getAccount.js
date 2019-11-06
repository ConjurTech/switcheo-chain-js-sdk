// const SDK = require('switcheo-chain-js-sdk') // use this instead if running this sdk as a library
const SDK = require('../index')

const mnemonic = 'myself cross give glue viable suggest satisfy warrior also brass kitten merge arrive index swap evidence baby return armed grunt legend manage term diary'

SDK.connect(mnemonic)
  .then((wallet) => {
    wallet.getAccount().then(({ result: { value } }) => {
      console.log(value.account_number) // signed messages includes this. this is unique and incremental for every new account.
      console.log(value.sequence) // txn nonce
      console.log(value.address) // this address can be empty if account does not exist
      console.log(wallet.pubKeyBech32) // this address is derived offline from mnemonic
    })
  })
