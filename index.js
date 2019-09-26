const mnemonics = require('./mnemonics')
const { start } = require('./examples/signAndBroadcast');

setInterval(() => {
  console.log('starting....')
  mnemonics.forEach((mnemonic, i) => {
    start(mnemonic, i + 1)
  })
}, 5000);

// start(mnemonics[0], 1)