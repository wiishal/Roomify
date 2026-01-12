import express from "express";
import {
  CheckCreadential,
  LoginInUser,
  SignInUser,
  signToken,
} from "../service/service.auth";
import passport from "../utils/googleAuthPassort";
import { access_tokenCookieOptions } from "../utils/serverConfig";
import { rateLimiter } from "../middleware/rateLimiter";
const AuthRouter = express.Router();

//signin
AuthRouter.post("/signin",  rateLimiter({maxReq:2,expireWindow:10}),async (req, res) => {
  const { userdetails } = req.body;
  console.log("sign : ", userdetails);
  const isCredentialExisted = await CheckCreadential(userdetails);

  if (!isCredentialExisted.success) {
    res.status(404).json({ message: isCredentialExisted.error });
    return;
  }
  if (isCredentialExisted.isEmailExisted) {
    res.status(401).json({ message: "email is already exist" });
    return;
  }
  if (isCredentialExisted.isUsernameExisted) {
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
  res.cookie("access_token", currentToken, access_tokenCookieOptions);
  res.status(200).json({ message: createdUser.message });
});

//login
AuthRouter.post("/login", async (req, res) => {
  if (!req.body) {
    res.status(400).json({ message: "Invalide request" });
    return;
  }
  const { userdetails } = req.body;
  //zod
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
  res.cookie("access_token", currentToken, access_tokenCookieOptions); // cookies
  res.status(200).json({ message: "user logged" });
  return;
});

AuthRouter.get("/verify", (req, res) => {
  const token = req.cookies.access_token;
  console.log(token);
  if (!token) {
    res.status(401).json({ message: "invalide token" });
    return;
  }
  res.status(200).json({ message: "verify" });
});

//google auth

AuthRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

AuthRouter.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  async (req, res) => {
    const user = req.user as any;
    const token = await signToken({ id: user.id, username: user.username });
    res.cookie("access_token", token, access_tokenCookieOptions);
    res.redirect(`${process.env.CORS_ORIGIN_URI}/oauth-success`);
  }
);

export default AuthRouter;
