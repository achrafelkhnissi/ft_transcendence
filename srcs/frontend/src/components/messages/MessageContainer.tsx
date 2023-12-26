import formatChatTimestamp from "./tools/formatTime";

 interface MessageContainerProps {
    isCurrentUser: boolean;
    content: string;
    date: string;
}

const MessageContainer: React.FC <MessageContainerProps> = ({isCurrentUser, content, date}) => {
    return (
    <div className={` max-w-[300px] rounded-t-[2rem] p-4 text-sm text-white/90 relative
        ${isCurrentUser? "bg-[#3A386A] self-start rounded-br-[2rem]" : 
                        "bg-[#59598E] self-end rounded-bl-[2rem]"}`}>
        <p className="mb-4">
            {content}
        </p>
        <p className={`absolute bottom-1 text-xs text-white/50
        ${isCurrentUser? "left-4" : "right-4"}`}> 
            {formatChatTimestamp(date)}
        </p>
    </div>)
}

export default MessageContainer;