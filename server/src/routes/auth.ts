import express from "express";
import {
  CheckCreadential,
  LoginInUser,
  SignInUser,
  signToken,
} from "../service/service.auth";

const AuthRouter = express.Router();

//signin
AuthRouter.post("/signin", async (req, res) => {
  const { userdetails } = req.body;
  console.log("sign : ", userdetails);
  const isCredentialExisted = await CheckCreadential(userdetails);

  if (!isCredentialExisted.success) {
    res.status(404).json({ message: isCredentialExisted.error });
    return;
  }
  if (isCredentialExisted.isUserExist && isCredentialExisted.isEmailExisted) {
    res.status(401).json({ message: "email is already exist" });
    return;
  }
  if (
    isCredentialExisted.isUserExist &&
    isCredentialExisted.isUsernameExisted
  ) {
    res.status(401).json({ message: "username is already exist" });
    return;
  }

  const createdUser = await SignInUser(userdetails);

  if (!createdUser.success) {
    res.status(401).json({ message: createdUser.error });
    return;
  }

  if (!createdUser.user) {

    return;
  }
  const currentToken = await signToken({
    username: createdUser.user?.username,
    id: createdUser.user?.id,
  });

  if (!currentToken) {
    res.status(404).json({ messgae: "failed during generating token" });
    return;
  }

  res.status(200).json({ message: createdUser.message, token: currentToken });
});

//login
AuthRouter.post("/login", async (req, res) => {
  if (!req.body) {
    res.status(400).json({ message: "Invalide request" });
    return;
  }
  const { userdetails } = req.body;
  //zod
  console.log("login : ", userdetails);
  const loguser = await LoginInUser(userdetails);
  if (!loguser.success) {
    res.status(401).json({ message: loguser.error });
    return;
  }
  if (!loguser.user) {
    res.status(501).json({ message: "Internal server error" });
    return;
  }
  const currentToken = await signToken({
    username: loguser.user.username,
    id: loguser.user.id,
  });
  if (!currentToken) {
    res.status(404).json({ messgae: "failed during generating token" });
    return;
  }
  console.log("token generated : ", currentToken);
  res.status(200).json({ token: currentToken, message: "user logged" });
  return;
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
