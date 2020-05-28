// const SDK = require('switcheo-chain-js-sdk') // use this instead if running this sdk as a library
const SDK = require('../.')
const { wallet, api } = SDK
const { Wallet } = wallet

async function signalDeposit() {
  const userAccount = wallet.newAccount()

  const helperAccount = wallet.newAccount()
  console.log('helperAccount', helperAccount.pubKeyBech32)
  const tokenMsg = {
    address: helperAccount.pubKeyBech32,
    amount: '1000',
    denom: 'swth',
  }
  const mintResult = await api.mintTokens(tokenMsg)
  console.log('mintResult', mintResult)

  const accountWallet = await Wallet.connect(helperAccount.mnemonic)
  const signalDepositMsg = {
    AccAddress: userAccount.pubKeyBech32,
    DepositInfo: {
      Address: '0x45b6991975f1B5e428E31eA51817371b931Db892',
      Blockchain: 'eth',
      AssetID: '0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2',
    }
  }
  const signupResult = await api.signalDeposit(accountWallet, signalDepositMsg)
  console.log('signupResult', signupResult)
}

signalDeposit()
