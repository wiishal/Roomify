export interface BaseResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export interface AuthUser {
  id: number;
  username: string;
}
export interface AuthUserWS {
  userId: number;
  username: string;
}
