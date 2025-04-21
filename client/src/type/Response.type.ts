export interface BaseResponce {
  success: boolean;
  message?: string;
  status?: number;
}

export interface loginResponce extends BaseResponce {
  token?: string;
}
