// const SDK = require('switcheo-chain-js-sdk') // use this instead if running this sdk as a library
const { wallet, api } = require('../.')
const { Wallet } = wallet;
const mnemonics = require('../mnemonics.json')

const privateKey = wallet.getPrivKeyFromMnemonic(mnemonics[1])
const voterKey = wallet.getPrivKeyFromMnemonic(mnemonics[2])

Promise.all([ Wallet.connect(privateKey), Wallet.connect(voterKey) ]).then(([ wallet, voterWallet ]) => {

	const params = {
		OracleName: 'BTC_USD',
		Voter: voterWallet.pubKeyBech32
	}

	api.createOracleVoter(wallet, params).then(console.log)
})


