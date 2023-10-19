import FriendAvatar from "../FriendAvatar";
import Card from "./Card";
import {MdEmojiPeople} from "react-icons/md"

const Friends = () => {
    return ( 
        <Card header="friends" icon= {<MdEmojiPeople className="text-[#6C61A4] w-6 h-6"/>}>
        <div className="w-full flex gap-4 flex-wrap  justify-start py-2 max-h-[280px] pl-4">
            <FriendAvatar/>
            <FriendAvatar/>
            <FriendAvatar/>
            <FriendAvatar/>
            <FriendAvatar/>
            <FriendAvatar/>
            <FriendAvatar/>
            <FriendAvatar/>
            <FriendAvatar/>
            <FriendAvatar/>
            <FriendAvatar/>
            <FriendAvatar/>
            <FriendAvatar/>
            <FriendAvatar/>
            <FriendAvatar/>
            <FriendAvatar/>
            <FriendAvatar/>
            <FriendAvatar/>
            <FriendAvatar/>
            <FriendAvatar/>
        </div>

      </Card>
    )
}

export default Friends;