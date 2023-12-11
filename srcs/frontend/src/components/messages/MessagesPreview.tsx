import { RiH6 } from "react-icons/ri";
import { Message, UserStatuses } from "./data";
import Image from "next/image";

interface MessagesPreviewProps{
    messages: Message[],
    statuses: UserStatuses,
}
const MessagesPreview: React.FC<MessagesPreviewProps> = ({messages, statuses}) => {
    return (<div className="flex flex-col gap-2 text-white p-2 ">
        {messages.map((message) => {
            return (
            <div className="flex justify-between w-full h-[5.5rem] border-2 px-2">
                <div className="self-center">
                    <Image src={"/images/fathjami.jpeg"} alt="" width={100} height={100} 
                    className="w-12 h-12 rounded-full "/>
                </div>
                <div className="flex flex-col self-center">
                    <h6 className="">
                        {message.senderName}
                    </h6>
                    <p className="text-white/70 text-sm font-light">
                        {message.content}
                    </p>
                </div>
            </div>)
        })}
    </div>)
}

export default MessagesPreview;