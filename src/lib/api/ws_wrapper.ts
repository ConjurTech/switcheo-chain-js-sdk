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

export interface GetOrderHistoryByMarketParams {
  eventType: string,
  market: string,
  address: string,
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

  public getOrderHistoryByMarket(msgId: string, params: GetOrderHistoryByMarketParams) {
    try {
      const msg = JSON.stringify({
        id: msgId,
        method: 'get_order_history_by_market',
        params: { market: params.market, address: params.address }
      })
      this.socket.send(msg)
    } catch (e) { console.log(e.message) }
  }

  // Request one at a time
  public request(msgId: string, p: IParams) {
    try {
      let msg
      switch (p.eventType) {
        case 'candlesticks':
          // Guard for valid candlestick request
          if (p.otherParams.hasOwnProperty('resolution')
            && p.otherParams.hasOwnProperty('from') && p.otherParams.hasOwnProperty('to')) {
            msg = JSON.stringify({
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
          msg = JSON.stringify({
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

  public parseChannelId = (rawChannelId: string): IParams => {
    const [eventType, market, ...otherParams] = rawChannelId.split(".")
    switch (eventType) {
      case 'candlesticks':
        return {
          eventType: eventType,
          market: market,
          otherParams: { resolution: otherParams[0] } // Resolution
        }
      case 'books':
      case 'recent_trades':
        return {
          eventType: eventType,
          market: market,
          otherParams: {}
        }
      default:
        throw new Error("Error parsing channelId")
    }
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
