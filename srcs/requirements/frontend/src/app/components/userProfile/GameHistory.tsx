import Card from "./Card";
import { RiChatHistoryFill } from "react-icons/ri"
import FriendAvatar from "../FriendAvatar";

const GameHistory = () => {
    return (
          <Card header="game history" icon={<RiChatHistoryFill className="text-[#6C61A4] w-5 h-5" />}>
            <div className="flex gap-6">
            {/* <FriendAvatar/>
            <FriendAvatar/>
            <FriendAvatar/>
            <FriendAvatar/> */}
            </div>
          </Card>
        )
}

export default GameHistory;