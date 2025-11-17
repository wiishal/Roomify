import express from "express";
import { WebSocketServer } from "ws";
import cors from "cors";
import "dotenv/config";

// console.log(process.env.DATABASE_URL);
import AuthRouter from "./routes/auth.js";
import ServerRouter from "./routes/server.js";

import msgHandler, { cleanupOnClose } from "./routes/message.js";
import { loadRooms } from "./utils/serverConfig.js";
//data structure

const app = express();
app.use(express.json());
app.use(cors());
app.use("/api/v1/auth", AuthRouter);
app.use("/api/v1/server", ServerRouter);

const httpserver = app.listen(4000);
loadRooms();

const wss = new WebSocketServer({ server: httpserver });

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
