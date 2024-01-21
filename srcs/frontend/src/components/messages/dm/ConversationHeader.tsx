import BlockUser from "../../svgAssets/BlockUser"
import GameInvitation from "../../svgAssets/GameInvitation"
import { User } from "../data"

const ConversationHeader = (receiver: User) => {
    return (
        <div 
        className="absolute w-full h-16 top-0 z-10 rounded-t-[3rem] border-b-4 border-b-[#4b4b79c6]
        shadow-[0_6px_7px_0_rgba(0,0,0,0.25)]
        flex justify-between p-6
        bg-[#25244E]">
        <div className="p-2 flex gap-2 self-center">
            <img src={`http://localhost:3000/api/users/${receiver.username}/avatar`} alt="receiver" width={100} height={100}
            className="w-10 h-10 rounded-full self-center"/>
            <div className="flex flex-col self-center">
                <h6 className="font-semibold text-sm ">
                    {receiver.username}
                </h6>
                <p className="font-light text-xs text-white/30 ">
                    {receiver.status.toLocaleLowerCase()}
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
    )
}

export default ConversationHeader