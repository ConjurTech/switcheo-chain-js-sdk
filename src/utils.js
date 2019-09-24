function makeBroadcastTxBody({
  signatures,
  address,
  gas,
  memo,
  pair,
  side,
  quantity,
  price,
  mode = 'sync',
}) {
  return {
    tx: {
      msg: [
        {
          type: 'broker/PlaceOrder',
          value: {
            Originator: address,
            Pair: pair,
            Side: side,
            Quantity: quantity,
            Price: price,
          }
        }
      ],
      fee: {
        amount: [],
        gas,
      },
      signatures,
      memo,
    },
    mode: mode, // sync, async, block
  }
}

module.exports = {
  makeBroadcastTxBody,
}
