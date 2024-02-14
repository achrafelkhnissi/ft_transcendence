import formatChatTimestamp from '../tools/formatTime';

interface MessageContainerProps {
  isCurrentUser: boolean;
  content: string;
  date: string;
}

const MessageContainer: React.FC<MessageContainerProps> = ({
  isCurrentUser,
  content,
  date,
}) => {
  return (
    <div
      className={` max-w-[300px] rounded-t-[1.9rem] p-4 text-sm text-white/90 relative min-w-[80px]
        ${
          isCurrentUser
            ? 'bg-[#59598E] self-end rounded-bl-[1.9rem]'
            : 'bg-[#3A386A] self-start rounded-br-[1.9rem]'
        }
                        `}
    >
      <p className="mb-4 break-words">{content}</p>
      <p
        className={`absolute bottom-2 text-[0.6rem] text-white/50
        ${isCurrentUser ? 'right-4' : 'left-4'}`}
      >
        {formatChatTimestamp(date)}
      </p>
    </div>
  );
};

export default MessageContainer;
