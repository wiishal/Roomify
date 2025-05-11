import express from "express";
import { tokenVerification } from "../middleware/tokenVerification";
import {
  CreateChannel,
  CreateDefaultChannels,
  CreateServer,
  GetChannels,
  GetServerInfo,
  GetServers,
} from "../service/service.server";

const ServerRouter = express.Router();
ServerRouter.use(tokenVerification);

ServerRouter.get("/", async (req, res) => {
  const user = req.user;
  const servers = await GetServers();
  if (!servers.success) {
    res.status(404).json({ message: servers.error });
    return;
  }
  res.json({
    servers: servers.servers,
    message: "servers fetched successfully",
    user: user,
  });
});

ServerRouter.get("/channels/:id", async (req, res) => {
  const id: number = Number(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ message: "Invalid ID" });
    return;
  }
  const currentServer = await GetChannels(id);
  const serverInfo = await GetServerInfo(id);

  if (!currentServer.success) {
    res.status(401).json({ message: currentServer.error });
    return;
  }
  if (!serverInfo.success) {
    res.status(401).json({ message: serverInfo.error });
    return;
  }
  res.status(200).json({
    channels: currentServer.channels,
    serverInfo: serverInfo.server,
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
  const createdServer = await CreateServer({
    serverName: server.name,
    userid: user.id,
    serverDes: server.description,
  });

  if (!createdServer.success) {
    res.status(401).json({ message: createdServer.error });
    return;
  }
  if (!createdServer.server) {
    return;
  }
  const createchannels = await CreateDefaultChannels(createdServer.server?.id);
  if (!createchannels.success) {
    res.status(403).json({ message: createchannels.error });
    return;
  }
  res.status(200).json({ message: "server Created Successfully" });
});

ServerRouter.post("/createChannel", async (req, res) => {
  if (!req.body) {
    res.status(400).json({ message: "Invalide request" });
    return;
  }

  const { channelInfo } = req.body;

  const createdChannel = await CreateChannel(channelInfo);
  if (!createdChannel.success) {
    res.status(404).json({ message: createdChannel.error });
    return;
  }
  res.status(200).json({ channel: createdChannel.channel });
});
export default ServerRouter;
