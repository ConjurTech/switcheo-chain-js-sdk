/*
  WsWrapper is a wrapper that helps to manage the socket connection with the server.
  Manages IDs for messages

  Methods:
    connect
    disconnect
    request
    subscribe
    unsubscribe
    resubscribe
*/

export interface IParams {
  eventType: string,
  market: string,
  otherParams: any,
}

export class WsWrapper {
  serverWsUrl: string
  socket: any
  currMsgIdNum: number
  isConnected: boolean = false
  onMsgCallback: any

  subscriptions: string[] = [] // List of subscribed channelIds

  constructor(serverWsUrl: string, onMsgCallback: any) {
    this.serverWsUrl = serverWsUrl
    this.onMsgCallback = onMsgCallback
    this.currMsgIdNum = 0
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
  public request(p: IParams) {
    try {
      switch (p.eventType) {
        case 'candlesticks':
          // Guard for valid candlestick request
          if (p.otherParams.hasOwnProperty('resolution')
            && p.otherParams.hasOwnProperty('from') && p.otherParams.hasOwnProperty('to')) {
            let id: string = `${(this.currMsgIdNum++).toString()}.get_candlesticks`
            const msg = JSON.stringify({
              id: id,
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
          let id: string = `${(this.currMsgIdNum++).toString()}.get_recent_trades`
          const msg = JSON.stringify({
            id: id,
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
  public subscribe(params: IParams[]) { // List of params
    try {
      let channelIds: string[] = params.map((p) => this.generateChannelId(p))
      let messageId: string = `${(this.currMsgIdNum++).toString()}.sub.${channelIds.join('.')}` // Generate messageId
      console.log("Subscribing to " + channelIds)
      const msg = JSON.stringify({
        id: messageId,
        method: 'subscribe',
        params: { "channels": [...channelIds] }
      })
      this.socket.send(msg)
      // Add subscription
      this.subscriptions.push(...channelIds)
    } catch (e) { console.log(e.message) }
  }

  public unsubscribe(params: IParams[]) {
    try {
      let channelIds: string[] = params.map((p) => this.generateChannelId(p))
      let messageId: string = `${(this.currMsgIdNum++).toString()}.unsub.${channelIds.join('.')}`
      console.log("Unsubscribing to " + channelIds)
      const msg = JSON.stringify({
        id: messageId,
        method: 'unsubscribe',
        params: { "channels": [...channelIds] }
      })
      this.socket.send(msg)
      this.subscriptions = this.subscriptions.filter((sub) => !channelIds.includes(sub))
    } catch (e) { console.log(e.message) }
  }

  public resubscribe(params: IParams[]) {
    this.unsubscribe(params)
    setTimeout(() => { }, 1000)
    this.subscribe(params)
  }

  private generateChannelId(p: IParams): string {
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
