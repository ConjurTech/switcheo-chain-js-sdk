/*
  WsWrapper is a wrapper that helps to manage the socket connection with the server.
  Manages IDs for messages

  Methods:
    connect
    disconnect
    request
    subscribe
    unsubscribe
*/

export interface IParams {
  eventType: string,
  market: string,
  otherParams: any,
}

export class WsWrapper {
  serverWsUrl: string
  socket: any
  msgNum: number
  isConnected: boolean = false
  onMsgCallback: any

  constructor(serverWsUrl: string, onMsgCallback: any) {
    this.serverWsUrl = serverWsUrl
    this.onMsgCallback = onMsgCallback
  }

  public connect() {
    this.socket = new WebSocket(this.serverWsUrl)

    // Config socket 
    this.socket.onopen = () => {
      this.isConnected = true
      console.log('socket is connected')
      this.onMsgCallback("connected")
    }

    this.socket.onmessage = (msg: any) => {
      this.onMsgCallback(msg)
    }

    this.socket.onclose = () => {
      this.isConnected = false
      console.log('socket off')
    }
  }

  public disconnect() {
    console.log("closing socket...")
    this.socket.close()
  }

  public checkIsConnected(): boolean {
    return this.isConnected
  }

  // Request one at a time
  public request(msgId: string, p: IParams) {
    try {
      switch (p.eventType) {
        case 'candlesticks':
          // Guard for valid candlestick request
          if (p.otherParams.hasOwnProperty('resolution')
            && p.otherParams.hasOwnProperty('from') && p.otherParams.hasOwnProperty('to')) {
            const msg = JSON.stringify({
              id: msgId,
              method: 'get_candlesticks',
              params: {
                market: p.market, resolution: p.otherParams.resolution,
                from: p.otherParams.from, to: p.otherParams.to
              }
            })
            // Add candlestick request
            console.log(msg)
            this.socket.send(msg)
          }
          else {
            throw new Error("Invalid candlesticks params")
          }
          break
        case 'recent_trades':
          const msg = JSON.stringify({
            id: msgId,
            method: 'get_recent_trades',
            params: { market: p.market }
          })
          console.log(msg)
          this.socket.send(msg)
          break
        default:
          throw new Error("Invalid request")
      }
    } catch (e) { console.log(e.message) }
  }

  // Events are either "recent_trades", "books" or "candlesticks"
  public subscribe(msgId: string, params: IParams[]) { // List of params
    try {
      let channelIds: string[] = params.map((p) => this.generateChannelId(p))
      console.log("Subscribing to " + msgId)
      const msg = JSON.stringify({
        id: msgId,
        method: 'subscribe',
        params: { "channels": [...channelIds] }
      })
      this.socket.send(msg)
    } catch (e) { console.log(e.message) }
  }

  public unsubscribe(msgId: string, params: IParams[]) {
    try {
      let channelIds: string[] = params.map((p) => this.generateChannelId(p))
      console.log("Unsubscribing to " + channelIds)
      const msg = JSON.stringify({
        id: msgId,
        method: 'unsubscribe',
        params: { "channels": [...channelIds] }
      })
      this.socket.send(msg)
    } catch (e) { console.log(e.message) }
  }

  public generateChannelId(p: IParams): string {
    switch (p.eventType) {
      case 'candlesticks':
        if (!p.otherParams.hasOwnProperty("resolution")) { // Ensure resolution given
          throw new Error("Missing resolution")
        }
        return [p.eventType, p.market, p.otherParams.resolution].join('.')
      case 'books':
      case 'recent_trades':
        return [p.eventType, p.market].join('.')
      default:
        throw new Error("Invalid subscription")
    }
  }
}
