/*
    WsWrapper is a wrapper that helps to manage the socket connection with the server.
    Manages IDs for messages

    Methods:
    connect
    disconnect
    request (get)
    subscribe
    unsubscribe
    resubscribe

    Regarding received message:
    Candlesticks events will be handled differently due to constraints from the charting library
    Candlesticks events will require the callbacks from the charting library which will be called when the WsWrapper receives
    a candlesticks message (Either get or subscription)
    The other events will send messages through the event channel and will be handled by the application
*/

export interface ICandlesticksGetParams {
    market: string,
    resolution: string,
    from: string,
    to: string
  }
  
  export interface ISubParams {
    eventType: string,
    market: string
  }
  
  export interface ICandlesticksSubParams extends ISubParams {
    resolution: string,
  }
  
  interface IChannelId {
    eventType: string,
    market: string,
    params: any
  }
  
  // TODO create interfaces for additional events
  // TODO handle acknowledments for subscritpion and unsubscriptions (TBC)
  // TODO implement unique ID System (Currently is just ++ from 1)
  
  export class WsWrapper {
    serverWsUrl: string
    isConnected: boolean = false
    subscriptions: string[] = [] // List of subscribed channelIds
    candlesticksSubscriptions: { [id: string]: string } = {} // subscribedIds to ChanneId mapping. For storing candlesticks subscription
    candlesticksRequests: string[] = [] // List of requestIds for candlesticks 
  
    socket: any
    eventEmitter: any
    currId: number
    candlesticksOnHistoryCallback: any
    candlesticksOnRealtimeCallback: any
  
    constructor(serverWsUrl: string, eventEmitter: any) {
        this.serverWsUrl = serverWsUrl
        this.eventEmitter = eventEmitter
        this.currId = 0
    }
  
    public connect() {
        this.socket = new WebSocket(this.serverWsUrl)
  
        // Config socket 
        this.socket.onopen = () => {
            this.isConnected = true
            console.log('socket on')
        }
  
        /** Example message
         *  id: 1
         *  event: "candlesticks.swth_eth.1"
         *  sequenceNumber: "100"
         *  result: Candlestick obj
         */
        this.socket.onmessage = (msg: any) => {
            try {
                let parsedMsg: any
                parsedMsg = JSON.parse(msg.data)
                // Check if getCandlesticks response
                if (this.candlesticksRequests.includes(parsedMsg.id)) {
                    if (parsedMsg.result.length) {
                        console.log(parsedMsg)
                        const bars: ReadonlyArray<object> =
                        parsedMsg.result.reverse().map((bar: any) => ({ // Reverse frontend or backend
                          time: bar.time * 1000,
                          close: bar.close,
                          high: bar.high,
                          open: bar.open,
                          low: bar.low,
                          volume: parseFloat(bar.volume)
                        }))
                        try {
                          this.candlesticksOnHistoryCallback(bars, { noData: false })
                        } catch (e) { console.log(e.message) }
                    }
                    else {
                        this.candlesticksOnHistoryCallback(parsedMsg.result, { noData: true })
                    }
                }
                // Check if subscribeCandlestick acknowledgement
                else if (parsedMsg.id && Object.keys(this.candlesticksSubscriptions).includes(parsedMsg.id)) {
                    
                } 
                else { // Subscription messages
                    let dataChannelId: IChannelId = this.parseChannelId(parsedMsg.channel)
                    console.log(dataChannelId)
                    if (dataChannelId.eventType === 'candlesticks') {
                        const lastBar = { ...parsedMsg.result, time: parsedMsg.result.time * 1000 }
                        console.log(lastBar)
                        this.candlesticksOnRealtimeCallback(lastBar)
                    }
                    else {
                        this.eventEmitter({...dataChannelId, ...parsedMsg}) // Pass it along into the original event channel
                      }
                }
            } catch (e) {
                console.error(`Error parsing : ${msg.data}. Error: ${e.message}`)
            }
        }
  
        this.socket.onclose = () => {
            this.isConnected = false
            console.log('socket off')
        }
    }
  
    public disconnect() {
        /*
            // Unsubscribe to all the channels
            let channelId: any
            for (channelId in Object.values(this.subscriptions)) {
                this.unsubscribe(channelId)
            }
        */
        this.socket.close()
    }
    
    public checkIsConnected(): boolean {
        return this.isConnected
    }
  
    // Events are either "recent_trades", "books" or "candlesticks_realtime"
    public subscribe(params: ISubParams[]) { // List of params
        console.log("Subscribing")
        let Id: number = this.currId++
        let channelIds = params.map((p: ISubParams) => this.generateChannelId(p))
        const msg = JSON.stringify({
            id: Id.toString(),
            method: 'subscribe',
            params: { "channels": [...channelIds] }
        })
        this.socket.send(msg)
        // Add subscription
        this.subscriptions.push(...channelIds)
    }
  
    public unsubscribe(params: ISubParams[]) {
        console.log("Unsubscribing")
        let Id: number = this.currId++
        let channelIds: string[] = params.map((p: ISubParams) => this.generateChannelId(p))
        const msg = JSON.stringify({
            id: Id.toString(),
            method: 'unsubscribe',
            params: { "channels": [...channelIds] }
        })
        this.socket.send(msg)
        // Remove subscription
        this.subscriptions = this.subscriptions.filter((sub) => channelIds.includes(sub))
    }
  
    public resubscribe(params: ISubParams[]) {
        this.unsubscribe(params)
        this.subscribe(params)
    }
  
    /** Candlesticks functions */
    
    public getCandlesticks(params: ICandlesticksGetParams, candlesticksOnHistoryCallback: any) {
        let id: number = this.currId++
        const msg = JSON.stringify({
            id: id.toString(),
            method: 'get_candlesticks',
            params: {...params}
        })
        this.candlesticksOnHistoryCallback = candlesticksOnHistoryCallback
        console.log("Sending " + msg)
        // Add candlestick request
        this.candlesticksRequests.push(id.toString())
        this.socket.send(msg)
    }
  
    public subscribeCandlesticks(params: ICandlesticksSubParams, candlesticksOnRealtimeCallback: any, subscribeUID: any) {
        this.candlesticksOnRealtimeCallback = candlesticksOnRealtimeCallback
        let channelId: string = this.generateCandlesticksChannelId(params)
        console.log("subscribing to " + channelId)
        const msg = JSON.stringify({
            id: subscribeUID,
            method: 'subscribe',
            params: { "channels": [channelId] }
        })
        // Add candlestick subscription
        this.candlesticksSubscriptions[subscribeUID] = channelId
        this.socket.send(msg)
    }
  
    public unsubscribeCandlesticks(subscribeUID: any) {
        let channelId: string = this.candlesticksSubscriptions[subscribeUID] // Get channelId from local var
        const msg = JSON.stringify({
            id: subscribeUID,
            method: 'unsubscribe',
            params: { "channels": [channelId] }
        })
        this.socket.send(msg)
        // Remove candlestick subscription
        delete this.candlesticksSubscriptions[subscribeUID]
    }
  
    private parseChannelId(rawChannelId: string): IChannelId {
        let splitChannelId = rawChannelId.split(".")
        let channelId: IChannelId = {
            eventType: splitChannelId[0],
            market: splitChannelId[1],
            params: splitChannelId[2] // TODO fit params to event
        }
        return channelId
    }
  
    private generateChannelId(params: ISubParams): string {
        return [params.eventType, params.market].join('.')
    }
  
    private generateCandlesticksChannelId(params: ICandlesticksSubParams): string {
        console.log(params.market)
        return [params.eventType, params.market, params.resolution].join('.')
    }
  }
  