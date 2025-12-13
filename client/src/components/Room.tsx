import { useParams } from "react-router-dom";
import { useWebsocket } from "../hooks/useSocket";
import { useState } from "react";

export default function Room() {
  const params = useParams();
  const socket = useWebsocket()
  const [msg,setMessages] = useState<string[]>([])
  console.log( "room params",params);
  function sendMessage(){
    console.log('from room')
    console.log(socket)
  }

  return (
    <div className="w-full h-full flex flex-col ">
      <div className="flex gap-4">room-id: {params.roomid}

      <button className="border rounded-sm bg-blue-600 px-2 text-white" onClick={()=> sendMessage()}>send message</button>
      <p>msg: {msg}</p>
      </div>
    </div>
  );
}
