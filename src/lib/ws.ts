import ReconnectingWebSocket from 'reconnecting-websocket'

const ws = new ReconnectingWebSocket('wss://api-ws.geolonia.com/dev');

export default ws
