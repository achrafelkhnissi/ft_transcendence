import { Message, UserStatuses } from "./data";

interface MessagesPreviewProps{
    messages: Message[],
    statuses: UserStatuses,
}
const MessagesPreview: React.FC<MessagesPreviewProps> = ({messages, statuses}) => {
    return (<div>

    </div>)
}

export default MessagesPreview;