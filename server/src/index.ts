import express from "express";
import { WebSocketServer } from "ws";
import cors from "cors";
import "dotenv/config";
import http from "http";
import cookieParser from "cookie-parser";
import AuthRouter from "./routes/auth";
import ServerRouter from "./routes/server";

import { loadRooms } from "./utils/serverConfig";
import { Msg, MsgType } from "./types/message.type";
import { broadcastToRoom, cleanupOnClose } from "./service/service.message";
import { msgHandler } from "./ws/msgHandler";
import { onMessageBroker } from "./utils/redis";
import passport from "./utils/googleAuthPassort";

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN_URI,
    credentials: true,
  })
);
app.use(passport.initialize());
app.use(cookieParser());

app.use("/api/v1/auth", AuthRouter);
app.use("/api/v1/server", ServerRouter);

const server = http.createServer(app);
loadRooms();

onMessageBroker.onRedisMessage = (msg) => {
  broadcastToRoom(msg);
};

const wss = new WebSocketServer({
  server,
  path: "/ws",
});

wss.on("connection", (ws, request) => {
  let token = request.headers.cookie?.split("=")[1];
  ws.on("message", (data) => {
    let msg: Msg;
    try {
      msg = JSON.parse(data.toString());
    } catch (err) {
      ws.send(JSON.stringify({ type: "error", msg: "Invalid message format" }));
      return;
    }
    if (!msg.type || !(msg.type as MsgType)) {
      ws.send(JSON.stringify({ type: "error", msg: "Invalid message format" }));
      return;
    }
    const handler = msgHandler[msg.type];
    if (!handler) {
      console.warn("unknown type msg");
      return;
    }
    if (msg.type == MsgType.auth) {
      msg = { ...msg, auth_token: token || "" };
    }
    handler(ws, msg);
  });

  ws.on("close", () => {
    cleanupOnClose(ws); // cleanup
    console.log("Client disconnected");
  });
});

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}`);
  console.log(`websocket available on ws://localhost:${PORT}/ws`);
});
