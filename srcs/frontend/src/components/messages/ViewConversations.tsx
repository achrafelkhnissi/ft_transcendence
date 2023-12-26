import BlockUser from "../svgAssets/BlockUser";
import GameInvitation from "../svgAssets/GameInvitation";
import MessageContainer from "./MessageContainer";
import { UserStatuses, ConversationsMap, User } from "./data";
import Image from "next/image";

interface ViewConversationsProps{
    conversationId: number,
    conversationsMap : ConversationsMap,
    orderedConversations: number[],
    statuses: UserStatuses,
    currentUser: string,
}

const ViewConversations : React.FC<ViewConversationsProps>= (
    {   conversationId, 
        conversationsMap, 
        orderedConversations, 
        statuses,
        currentUser,
    }) =>{
        let sender: User = {
            username: "",
            avatar: "",
            status: ""
        };
        if (conversationId >= 0){
            sender = conversationsMap[conversationId].participants[0].username === currentUser?
                        conversationsMap[conversationId].participants[1]: 
                        conversationsMap[conversationId].participants[0]; 
        }
    return (
        <div
        className="w-4/6 bg-[#25244E] rounded-[3rem] max-[900px]:w-full
        shadow-[0_10px_20px_15px_rgba(0,0,0,0.2)] relative text-white">
            {/* Header */}
            {conversationId >= 0 && 
            <>
            <div 
                className="absolute w-full h-16 top-0 z-10 rounded-t-[3rem] border-b-4 border-b-[#4b4b79c6]
                shadow-[0_6px_7px_0_rgba(0,0,0,0.25)]
                flex justify-between p-6
                bg-[#25244E]">
                <div className="p-2 flex gap-2 self-center">
                    <Image src={sender.avatar} alt="sender" width={100} height={100}
                    className="w-10 h-10 rounded-full self-center"/>
                    <div className="flex flex-col self-center">
                        <h6 className="font-semibold text-sm ">
                            {sender.username}
                        </h6>
                        <p className="font-light text-xs text-white/30 ">
                            {sender.status.toLocaleLowerCase()}
                        </p>
                    </div>
                </div> 
                <div className="self-center flex gap-4 justify-center">
                    <div 
                        className="self-center hover:cursor-pointer
                        drop-shadow-[0_4px_8px_rgba(255,255,255,0.21)]">
                        <GameInvitation color={"#59598E"} width={"29px"} height={"29px"} />
                    </div>
                    <div className="w-[2px] h-[30px] bg-[#6C61A480]"></div>
                    <div 
                        className="self-center hover:cursor-pointer 
                        ">
                        <BlockUser color={"#59598E"} width={"29px"} height={"29px"} />
                    </div>
                </div>
            </div>
            {/* Messages */}
            <div className="w-full h-full overflow-hidden py-6 ">
                <div className="flex flex-col gap-2 h-full overflow-y-scroll px-6">
                    {conversationsMap[conversationId].messages.map((message) => {
                    return (
                        <MessageContainer 
                        isCurrentUser={currentUser === message.sender.username} 
                        content={message.content} 
                        date={message.createdAt}/>
                        )
                    })}
                </div>
            </div>
            </>
            }
            {/* <p>{conversationId}</p> */}
    </div>
    )
}

export default ViewConversations;