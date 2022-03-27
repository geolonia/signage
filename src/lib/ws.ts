import ReconnectingWebSocket from 'reconnecting-websocket'

const ws = new ReconnectingWebSocket(`wss://demo.piesocket.com/v3/channel_1?api_key=oCdCMcMPQpbvNjUIzqtvF1d2X2okWpDQj4AwARJuAgtjhzKxVEjQU6IdCjwm&notify_self`);

export default ws