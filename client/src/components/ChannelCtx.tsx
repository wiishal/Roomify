import { useParams } from "react-router-dom";
import { useMessages } from "../hooks/useMessage";
import { useState } from "react";
import { useWebsocket } from "../hooks/useSocket";
import { Message, Msg, MsgType } from "../type/type";
import { MessageBlock } from "./MessageBlock";
import { useUser } from "../hooks/useUser";


export default function ChannelCtx() {
  const socket = useWebsocket();
  const { messages } = useMessages();
  const params = useParams();
  const  token = useUser()
  const serverId = Number(params.roomid);
  const channelId = Number(params.channelid);

  const [textMessage, setTextMessage] = useState("");

  if (isNaN(serverId) || isNaN(channelId) || !serverId || !channelId || !token) {
    return (
      <div className="flex items-center justify-center h-full text-xl text-red-500 bg-gray-100">
        <p>Invalid Room or Channel ID in URL.</p>
      </div>
    );
  }

  const channelMsgs: Message[] = messages[serverId]?.[channelId] || [];

  const sendMessage = () => {
    if (textMessage.trim() === "") return;

    const msg: Msg = {
      type: MsgType.sendMsgToChannel,
      send_to_channel_id: channelId,
      send_to_server_id: serverId,
      message_content: textMessage.trim(),
    };

    if (socket) {
      socket.send(JSON.stringify(msg));
      setTextMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      
      <div className="p-4 border-b bg-gray-50 border-gray-200 sticky top-0 z-10 shadow-sm">
        <h2 className="text-lg font-bold text-gray-800">
          <span className="text-gray-400 mr-1 font-sans">#</span>
          <span className="font-sans">Channel {channelId}</span>
        </h2>
        <p className="text-xs text-gray-500">
          Room ID: <span className="font-mono">{serverId}</span>
        </p>
      </div>

      <div className="flex-grow flex flex-col justify-end overflow-y-auto custom-scrollbar pt-2 pb-2 space-y-1">
        
        {channelMsgs.length === 0 ? (
          <div className="text-center pt-8 text-gray-500">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          channelMsgs.map((m, idx) => {
            const showUsername =
              idx === 0 ||
              m.senderUsername !== channelMsgs[idx - 1].senderUsername;

            return (
              <MessageBlock 
                user={token.username}
                key={idx} 
                message={m} 
                showUsername={showUsername} 
              />
            );
          })
        )}
      </div>

      <div className="p-2 border-t border-gray-100 bg-gray-50">
        <div className="flex space-x-1">
          <input
            className="flex-grow p-1 border border-gray-300 rounded-lg bg-white text-gray-800 
                       focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 shadow-inner placeholder:text-sm"
            type="text"
            placeholder={`Message #Channel ${channelId}...`}
            value={textMessage}
            onChange={(e) => setTextMessage(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <button
            className="px-6 py-1 bg-blue-500 text-white font-sm rounded-lg hover:bg-blue-600 disabled:bg-blue-300 transition duration-150"
            onClick={sendMessage}
            disabled={textMessage.trim() === ""}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}