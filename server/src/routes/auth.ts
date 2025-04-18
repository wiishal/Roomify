import express from "express";
import { signToken } from "../service/service.user.js";

const users = [{ username: "v", password: "1" }];

const AuthRouter = express.Router();

AuthRouter.post("/login", async (req, res) => {
  const { userdetails } = req.body;

  const user = users.find(
    (u) =>
      u.username === userdetails.username && u.password === userdetails.password
  );

  if (user) {
    const token = await signToken({ username: user.username, userid: 1 });
    if (!token) {
      res.status(401).json({ message: "server error" });
    }
    res.status(200).json({ message: "Login successful", token });
  } else {
    res.status(401).json({ message: "Invalid username or password" });
  }
});

AuthRouter.post("/verify", (req, res) => {
  if (!req.body) {
    res.status(400).json({ message: "Invalide request" });
    return;
  }
  const { token } = req.body;
  if (!token) {
    res.status(401).json({ message: "invalide token" });
    return;
  }
  res.status(200).json({ message: "verify" });
});
export default AuthRouter;
