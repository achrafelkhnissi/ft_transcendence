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
            {conversationId >= 0 && <div 
            className="absolute w-full h-16 top-0  rounded-t-[3rem] border-b-4 border-b-[#4b4b79c6]
            shadow-[0_6px_7px_0_rgba(0,0,0,0.25)]
            flex justify-between p-6">
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
                    <div className="w-16 border-2 h-10 self-center">

                    </div>
            </div>
            }
            {/* <p>{conversationId}</p> */}
    </div>
    )
}

export default ViewConversations;