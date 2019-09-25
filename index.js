const mnemonics = require('./mnemonics')
const { start } = require('./examples/signAndBroadcast');

mnemonics.forEach((mnemonic, i) => {
  start(mnemonic, i + 1)
})
