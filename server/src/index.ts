import express from "express";
import { WebSocketServer } from "ws";
import cors from "cors"
import AuthRouter from "./routes/auth.js";
import ServerRouter from "./routes/server.js";
import "dotenv/config";

const app = express();
app.use(express.json());
app.use(cors());
app.use("/api/v1/auth", AuthRouter);
app.use("/api/v1/server", ServerRouter);



const httpserver = app.listen(4000);

const wss = new WebSocketServer({ server: httpserver });

wss.on("connection", (ws) => {
  ws.send(
    JSON.stringify({ type: "broadcast", msg: "you are connected too server" })
  );
  ws.send("hey welcome");
});
