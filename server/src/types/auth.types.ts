import { User } from "@prisma/client";
import { BaseResponse } from "./Responce";

export interface CheckCreadentialResponse extends BaseResponse {
  isUserExist?: boolean;
  isEmailExisted?: boolean;
  isUsernameExisted?: boolean;
}
export interface LoginInUserResponse extends BaseResponse {
  user?: User;
}
interface SignInUserResponse extends BaseResponse {
  user?: User;
}