export interface Channel {
  id: number;
  name: String;
  createdAt: string;
  serverid: number;
  category: string;
}

export interface Server {
  id: number;
  profile: string;
  description: string;
  name: string;
  createdAt: string;
  upvote: number;
  adminid: number;
}
