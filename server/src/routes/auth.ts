import express from "express";
import {
  CheckCreadential,
  SignInUser,
  signToken,
} from "../service/service.auth";

const users = [{ username: "v", password: "1" }];

const AuthRouter = express.Router();

//signin

AuthRouter.post("/signin", async (req, res) => {
  const { userdetails } = req.body;

  const isCredentialExisted = await CheckCreadential(userdetails);

  if (!isCredentialExisted.success) {
    res.status(404).json({ message: isCredentialExisted.message });
    return;
  }
  if (isCredentialExisted.isEmailExisted) {
    res.status(404).json({ message: "email is already exist" });
    return;
  }
  if (!isCredentialExisted.isUsernameExisted) {
    res.status(404).json({ message: "username is already exist" });
    return;
  }

  const createdUser = await SignInUser(userdetails);

  if (!createdUser.success) {
    res.status(401).json({ message: createdUser.message });
    return;
  }
  res.status(200).json({ message: createdUser.message });
});

//login
AuthRouter.post("/login", async (req, res) => {
  const { userdetails } = req.body;
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
