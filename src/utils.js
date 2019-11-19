function makeCreateBroadcastTxBody({
  signatures,
  address,
  gas,
  memo,
  orderParams,
  mode = 'sync',
}) {
  return {
    tx: {
      msg: [
        {
          type: 'broker/PlaceOrder',
          value: {
            // orderParams
            Originator: address,
            OrderParams: orderParams.OrderParams,
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

function makeCancelBroadcastTxBody({
  signatures,
  address,
  gas,
  memo,
  id,
  mode = 'sync',
}) {
  return {
    tx: {
      msg: [
        {
          type: 'broker/CancelOrder',
          value: {
            Originator: address,
            ID: id,
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
  makeCreateBroadcastTxBody,
  makeCancelBroadcastTxBody,
}
