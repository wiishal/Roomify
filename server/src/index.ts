import express from "express";
import { WebSocketServer } from "ws";
import cors from "cors";
import "dotenv/config";
import http from "http";

// console.log(process.env.DATABASE_URL);
import AuthRouter from "./routes/auth";
import ServerRouter from "./routes/server";

import msgHandler, { cleanupOnClose } from "./routes/message";
import { loadRooms } from "./utils/serverConfig";
import { Msg, MsgType } from "./types/message.type";
//data structure

const app = express();
app.use(express.json());
app.use(cors());
app.use("/api/v1/auth", AuthRouter);
app.use("/api/v1/server", ServerRouter);

// const httpserver = app.listen(4000);
const server = http.createServer(app);

loadRooms();

// const wss = new WebSocketServer({ server: httpserver });

const wss = new WebSocketServer({
  server,
  path: "/ws"
});

//needed to add notification table to send msg offline users
wss.on("connection", (ws, request) => {
  const clientIp = request.socket.remoteAddress;
  console.log("clientIP", clientIp);
  

  ws.on("message", (data) => {
    let msg: Msg;

    try {
      msg = JSON.parse(data.toString());
    } catch (err) {
      console.error("Invalid JSON received:", data.toString());
      ws.send(JSON.stringify({ type: "error", msg: "Invalid message format" }));
      return;
    }

    // console.log(msg);
    if (!msg.type || !(msg.type as MsgType)) {
      ws.send(JSON.stringify({ type: "error", msg: "Invalid message format" }));
      return;
    }

    const handler = msgHandler[msg.type];
    console.log(handler);

    if (handler) {
      console.log("in handler");
      handler(ws, msg);
    } else {
      console.warn("unknown type msg");
    }
  });

  ws.send("hey welcome");

  ws.on("close", () => {
    cleanupOnClose(ws); // cleanup
    console.log("Client disconnected");
  });
});

const PORT = process.env.PORT || 4000
server.listen(PORT, ()=>{
  console.log(`server is running on http://localhost:${PORT}` )
    console.log(`websocket available on ws://localhost:${PORT}/ws` )
})