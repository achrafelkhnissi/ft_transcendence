import React from 'react';
import { Message, User } from '../data';
import formatChatTimestamp from '../tools/formatTime';

interface ChannelMessageContainerProps {
  message: Message;
  isCurrentUser: boolean;
  displayAvatr: boolean;
}

const ChannelMessageContainer: React.FC<ChannelMessageContainerProps> = ({
  message,
  isCurrentUser,
  displayAvatr,
}) => {
  return (
    <div
      className={`${isCurrentUser ? ' self-end' : 'self-start '}
    `}
    >
      <div className="flex gap-2 ">
        {!isCurrentUser && displayAvatr && (
          <img
            src={message.sender.avatar}
            alt=""
            className="w-8 h-8 rounded-full"
          />
        )}
        <div className="felx flex-col ">
          {!isCurrentUser && (
            <p className="text-xs self-center"> {message.sender.username}</p>
          )}
          <div
            className={`max-w-[300px] rounded-b-[1.9rem] p-4 text-sm text-white/90 relative min-w-[80px] mt-1
    ${
      isCurrentUser
        ? 'bg-[#59598E] self-end rounded-tl-[1.9rem]'
        : 'bg-[#3A386A] self-start rounded-tr-[1.9rem]'
    }
                    `}
          >
            <p className="mb-4 break-words">{message.content}</p>
            <p
              className={`absolute bottom-3 text-xs text-white/50
    ${isCurrentUser ? 'right-4' : 'left-4'}`}
            >
              {formatChatTimestamp(message.createdAt)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChannelMessageContainer;
