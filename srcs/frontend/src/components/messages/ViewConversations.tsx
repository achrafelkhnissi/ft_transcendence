import { UserStatuses, ConversationsMap } from "./data";


interface ViewConversationsProps{
    conversationId: number,
    conversationsMap : ConversationsMap,
    orderedConversations: number[],
    statuses: UserStatuses,
}

const ViewConversations : React.FC<ViewConversationsProps>= ({conversationId, conversationsMap, orderedConversations, statuses}) =>{
    return (
    <div
        className="w-4/6 bg-[#25244E] rounded-[3rem] max-[900px]:w-full
        shadow-[0_10px_20px_15px_rgba(0,0,0,0.2)]">
            <p>{conversationId}</p>
    </div>)
}

export default ViewConversations;