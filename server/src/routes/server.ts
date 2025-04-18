import express from "express";
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

ServerRouter.get("/", (req, res) => {
  const s = server.map((s) => ({ roomid: s.roomid, name: s.name }));
  console.log(s);
  res.json({ server: s });
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

ServerRouter.post("/create", (req, res) => {
  const { server } = req.body;
  console.log(server);
  res.json({ message: "server is created" });
});
export default ServerRouter;
