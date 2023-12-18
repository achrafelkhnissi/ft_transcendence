import { RiH6 } from "react-icons/ri";
import { Message, UserStatuses, Conversation } from "./data";
import Image from "next/image";

interface MessagesPreviewProps{
    conversartions : Conversation[],
    statuses: UserStatuses,
}
const MessagesPreview: React.FC<MessagesPreviewProps> = ({conversartions, statuses}) => {
    return (<div className="flex flex-col w-full  text-white overflow-y-auto justify-center scroll-smooth px-2">
        {conversartions.map((conversartion) => {
            const lastMessage = conversartion.messages[conversartion.messages.length - 1];
            return (
            <div className="flex justify-center  gap-2 h-[5.55rem] px-1 py-3 border-b-[3px] border-b-[#59598ec6] relative hover:cursor-pointer
                            hover:bg-white/[0.04] hover:shadow-[0_4px_11px_2px_rgba(0,0,0,0.35)] ">
                <div className="self-center ">
                    <Image src={"/images/fathjami.jpeg"} alt="" width={100} height={100} 
                    className="w-12 h-12 rounded-full "/>
                </div>
                <div className="flex flex-col self-center w-4/6 gap-[0.1rem] justify-start">
                    <h6 className="font-normal text-sm">
                        {lastMessage.senderName}
                    </h6>
                    <p className="text-white/70 text-xs font-light">
                        {lastMessage.content.slice(0, 80)}
                    </p>
                </div>
                    <p className="text-[0.6rem] font-light text-white/60 mt-1">
                        {lastMessage.createdAt}
                    </p>
               {
                !lastMessage.isRead && 
                <div className="absolute w-[0.45rem] h-[0.45rem] rounded-full bg-[#6257FE] -left-2 z-10 top-1/2"></div>
               }
            </div>)
        })}
    </div>)
}

export default MessagesPreview;