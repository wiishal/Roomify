import express from "express";
import { tokenVerification } from "../middleware/tokenVerification";
import {
  CreateDefaultChannels,
  CreateServer,
  GetServers,
} from "../service/service.server";
const server = [
  {
    roomid: "1",
    name: "cipher",
    upvote: 1231,
    channel: [
      { channelid: 1, name: "rule", category: "default" },
      { channelid: 2, name: "join", category: "default" },
      { channelid: 3, name: "general", category: "general" },
    ],
  },
  {
    roomid: "2",
    name: "contra",
    upvote: 231,
    channel: [
      { channelid: 1, name: "rule", category: "default" },
      { channelid: 2, name: "join", category: "default" },
    ],
  },
];

const ServerRouter = express.Router();
ServerRouter.use(tokenVerification);

ServerRouter.get("/", async (req, res) => {
  const user = req.user;
  const servers = await GetServers();
  console.log(servers);
  if (!servers.success) {
    res.status(404).json({ message: servers.message });
    return;
  }
  res.json({
    servers: servers.servers,
    message: "servers fetched successfully",
    user: user,
  });
});

ServerRouter.get("/serverinfo/:id", (req, res) => {
  const params = req.params as { id: string };
  console.log(params);
  const currentServer = server.find((room) => room.roomid === params.id);

  if (!currentServer) {
    res.status(401).json({ message: "room not exist" });
    return;
  }
  res.status(200).json({
    server: currentServer,
    message: "channel fetch successfully",
  });
});

ServerRouter.post("/create", async (req, res) => {
  if (!req.body) {
    res.status(400).json({ message: "Invalide request" });
    return;
  }
  const { server } = req.body;
  const user = req.user;

  if (!user) {
    res.status(500).json({ message: "failed during auth decode" });
    console.log("error : user decode missing ");
    return;
  }
  console.log(user);
  const createdServer = await CreateServer({
    serverName: server.name,
    userid: user.id,
    serverDes: server.description,
  });

  if (!createdServer.success) {
    res.status(401).json({ message: createdServer.message });
    return;
  }
  if (!createdServer.server) {
    return;
  }
  const createchannels = await CreateDefaultChannels(createdServer.server?.id);
  if (!createchannels.success) {
    res.status(403).json({ message: createchannels.message });
    return;
  }
  res.status(200).json({ message: "server Created Successfully" });
});
export default ServerRouter;
