import {NotificationsType} from "./Notifications"

const FriendRequest: React.FC<NotificationsType> = (notif) => {

    return (
        <div className="bordder bg-[#6257FE]/80 text-white w-full h-16 text-sm p-2 text-center">
            {notif.content}
        </div>
    )
}

export default FriendRequest