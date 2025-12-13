import { Message } from "../type/type";

interface MessageBlockProps {
  message: Message;
  showUsername: boolean;
}

export const MessageBlock = ({ message, showUsername }: MessageBlockProps) => {
    // Simple Avatar Placeholder
    const Avatar = () => (
        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {message.senderUsername.charAt(0).toUpperCase()}
        </div>
    );

    return (
        // Apply vertical padding based on whether it's a new group
        <div className={`flex items-start px-4 ${showUsername ? 'pt-4' : 'pt-0'}`}>
            
            {/* Avatar Column */}
            <div className={`w-10 flex-shrink-0 ${showUsername ? 'mt-0' : 'mt-0 opacity-0 h-4'}`}>
                {showUsername && <Avatar />}
            </div>

            {/* Content Column */}
            <div className="flex flex-col flex-grow min-w-0">
                {/* Username and Time (Only visible on the first message of a group) */}
                {showUsername && (
                    <div className="flex items-baseline mb-0.5">
                        <span className="font-semibold text-gray-900 mr-2 text-sm">
                            {message.senderUsername}
                        </span>
                        {/* Time placeholder */}
                        <span className="text-xs text-gray-500">
                           {/* Replace with actual time if available: new Date(message.timestamp).toLocaleTimeString() */}
                           {/* Or just leave it out if the data isn't there */}
                        </span>
                    </div>
                )}
                
                {/* Message Content */}
                <p className="text-gray-800 text-sm break-words max-w-full">
                    {message.content}
                </p>
            </div>
        </div>
    );
};
