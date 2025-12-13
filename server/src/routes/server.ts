import express from "express";
import { tokenVerification } from "../middleware/tokenVerification";
import {
  addMemberToServer,
  CreateChannel,
  CreateDefaultChannels,
  createJoinRequest,
  CreateServer,
  getAllServers,
  GetChannels,
  getJoinRequestEntry,
  GetServerInfo,
  GetServers,
  updateJoinRequestEntry,
} from "../service/service.server";
import { JoinStatus } from "../types/server.types";
import { checkAdmin, checkMember } from "../service/service.server";

const ServerRouter = express.Router();

//token verification
ServerRouter.use(tokenVerification);

//get all servers

ServerRouter.post("/joinRequest", async (req, res) => {
  const user = req.user;
  const { joinrequestInfo } = req.body;
  if (!user) {
    res.status(500).json({ message: "failed during auth decode" });
    console.log("error : user decode missing ");
    return;
  }
  if (!joinrequestInfo.serverId) {
    res
      .status(404)
      .json({ message: "failed to process request(body not received)" });
    return;
  }
  const createJoinreq = await createJoinRequest(
    user.id,
    joinrequestInfo.serverId
  );
  if (!createJoinreq.success) {
    res.status(404).json({ message: createJoinreq.error });
    return;
  }
  res.status(200).json({ message: "req stored successfully" });
});

ServerRouter.get("/allservers", async (req, res) => {
  const user = req.user;

  if (!user) {
    res.status(500).json({ message: "failed during auth decode" });
    console.log("error : user decode missing ");
    return;
  }
  const response = await getAllServers(user.id);
  if (!response.success) {
    res.status(404).json({ message: response.error });
    return;
  }
  // console.log(response.servers,"all servers")
  res.json({
    servers: response.servers,
    message: "servers fetched successfully",
  });
});

ServerRouter.get("/", async (req, res) => {
  const user = req.user;
  // console.log("req.user :", user);
  if (!user) return;

  const servers = await GetServers(user.id);
  if (!servers.success) {
    res.status(404).json({ message: servers.error });
    return;
  }
  // console.log(servers.servers)
  res.json({
    servers: servers.servers,
    message: "servers fetched successfully",
    user: user,
  });
});

//get serverinfo
ServerRouter.get("/serverInfo/:id", async (req, res) => {
  const serverId: number = Number(req.params.id);
  if (isNaN(serverId)) {
    res.status(400).json({ message: "invalid url", redirect: "/" });
    return;
  }
  const user = req.user;

  if (!user) {
    res.status(500).json({ message: "failed during auth decode" });
    console.log("error : user decode missing ");
    return;
  }
  // const isMember = rooms.get(serverId)?.has(user.id);
  const isMember = await checkMember(serverId, user.id);
  if (!isMember) {
    res.status(400).json({ message: "restricted for members", redirect: "/" });
    return;
  }
  const serverInfo = await GetServerInfo(serverId);
  if (!serverInfo.success) {
    res.status(401).json({ message: serverInfo.error });
    return;
  }
  res.status(200).json({
    serverInfo: serverInfo.server,
    message: "serverInfo fetch successfully",
  });
});

// get channel info
ServerRouter.get("/channels/:id", async (req, res) => {
  const id: number = Number(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ message: "Invalid ID" });
    return;
  }
  const currentServer = await GetChannels(id);

  if (!currentServer.success) {
    res.status(401).json({ message: currentServer.error });
    return;
  }

  res.status(200).json({
    channels: currentServer.channels,
    message: "channel fetch successfully",
  });
});

//create server
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

//create channel
ServerRouter.post("/createChannel", async (req, res) => {
  if (!req.body) {
    res.status(400).json({ message: "Invalide request" });
    return;
  }
  const user = req.user;
  if (!user) {
    return;
  }
  const { channelInfo } = req.body;
  const isMember = await checkAdmin(channelInfo.serverid, user.id);
  if (!isMember) {
    res.status(400).json({ message: "", redirect: "/" });
    return;
  }
  const createdChannel = await CreateChannel(channelInfo);
  if (!createdChannel.success) {
    res.status(404).json({ message: createdChannel.error });
    return;
  }
  res.status(200).json({ channel: createdChannel.channel });
});

ServerRouter.get("/getjoinrequests", async (req, res) => {
  const user = req.user;
  if (!user) {
    return;
  }
  const joinRequest = await getJoinRequestEntry(user.id);
  if (!joinRequest.success) {
    res.status(404).json({ message: "failed to get join requests" });
    return;
  }
  res.status(200).json({
    joinRequest: joinRequest.joinRequests,
    message: "join req fetch successful",
  });
});

ServerRouter.post("/joinrquestresponce", async (req, res) => {
  const { joinRequest, responseOfAdmin } = req.body;
  const user = req.user;

  if (!user) {
    res.status(500).json({ message: "failed during auth decode" });
    console.log("error : user decode missing ");
    return;
  }
  if (!joinRequest || responseOfAdmin === "undefined") {
    res.status(400).json({ message: "failed to update request" });
    return;
  }
  const updateStatus = responseOfAdmin
    ? JoinStatus.accepted
    : JoinStatus.rejected;
  console.log(updateStatus);

  const updatedEntry = await updateJoinRequestEntry(joinRequest, updateStatus);

  if (!updatedEntry.success || !updatedEntry.joinRequests) {
    res.status(404).json({ message: "failed to update join request" });
    return;
  }

  if (updatedEntry.joinRequests.status === JoinStatus.accepted) {
    const addingMemberResponse = await addMemberToServer(
      updatedEntry.joinRequests.serverId,
      updatedEntry.joinRequests.userId
    );

    if (!addingMemberResponse.success) {
      res.status(404).json({ message: "failed to update join request" });
      return;
    }
    console.log("adding member", addingMemberResponse.message);
  }

  res.status(200).json({
    joinRequestStatus: updatedEntry.joinRequests?.status,
    message: "join req fetch successful",
  });
});

export default ServerRouter;
