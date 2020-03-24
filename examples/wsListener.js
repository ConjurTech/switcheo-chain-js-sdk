let SDK = require('../.')
let WebSocket =  require('ws')
ws = new SDK.api.WsWrapper("http://localhost:5000/ws", msg => console.log("received msg:", msg.data))
// ws = new SDK.api.WsWrapper("ws://13.251.218.38:5000/ws", msg => console.log("received msg:", msg.data))

ws.socket = new WebSocket(ws.serverWsUrl)
ws.socket.onopen = () => {
  ws.isConnected = true
  console.log('socket is connected')
  ws.onMsgCallback("connected")

  msg = JSON.stringify({ id: '1', method: 'subscribe', params: { channels: ["market_stats"] } })
  ws.socket.send(msg)
}

ws.socket.onmessage = (msg) => {ws.onMsgCallback(msg)}

ws.socket.onclose = () => {ws.isConnected = false,console.log('socket off')}
