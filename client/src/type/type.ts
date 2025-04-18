export interface Channel {
  channelid: number;
  name: string;
  category:string
}

export interface Server {
  roomid: number;
  name: string;
  upvote?: number;
  channel: Channel[];
}
 