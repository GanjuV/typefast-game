const webSocketsServerPort = 8000;
const express = require("express");
const cors = require("cors");
const WebSocket = require("ws");
const http = require("http");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({ origin: true }));

// Routes
require("./routes")(app);

// Creating HTTP server
const server = http.createServer(app);

//initialize the WebSocket server instance
const wss = new WebSocket.Server({ server });

// Setting up socket
wss.on("connection", (ws) => {
  ws.isAlive = true;
  ws.on("pong", heartbeat);

  //connection is up, let's add a simple event
  ws.on("message", (msg) => {
    const message = JSON.parse(msg);

    setTimeout(() => {
      if (message.isBroadcast) {
        //send back the message to the other clients
        wss.clients.forEach((client) => {
          if (client != ws) {
            client.send(createMessage(message.content, true, message.sender));
          }
        });
      }

      ws.send(createMessage(message.content, message.isBroadcast));
    }, 1000);
  });

  // Send immediatly a feedback to the incoming connection
  ws.send(createMessage("Hi there, I am a WebSocket server"));

  ws.on("error", (err) => {
    console.warn(`Client disconnected - reason: ${err}`);
  });
});

// Handle broken connections

function heartbeat() {
  this.isAlive = true;
}

function createMessage(content, isBroadcast = false, sender = "NS") {
  return JSON.stringify({ content, isBroadcast, sender });
}

const interval = setInterval(function ping() {
  wss.clients.forEach(function each(ws) {
    if (ws.isAlive === false) return ws.terminate();
    ws.isAlive = false;
    ws.ping(null, undefined);
  });
}, 10000);

wss.on("close", function close() {
  clearInterval(interval);
  storage = { participants: [], winner: {} };
});

//start our server
server.listen(webSocketsServerPort, () => {
  console.log(`Server started on port ${server.address().port} :)`);
});
