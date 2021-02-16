import { w3cwebsocket as W3CWebSocket } from "websocket";
export const client = new W3CWebSocket("ws://127.0.0.1:8000");

const heartbeat = (ws) => {
  clearTimeout(ws.pingTimeout);

  ws.pingTimeout = setTimeout(() => {
    ws.terminate();
    // Delay should be equal to the interval at which your server
    // sends out pings plus a conservative assumption of the latency.
  }, 10000 + 1000);
};

client.onmessage = (e) => {
  // console.log("E============>>>   ", e);
  if (typeof e.data === "string") {
    console.log("Received: '" + e.data + "'");
  }
};
