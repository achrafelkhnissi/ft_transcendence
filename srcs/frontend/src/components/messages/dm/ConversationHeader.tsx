/* eslint-disable @next/next/no-img-element */
import blockUser from '@/services/blockUser';
import BlockUser from '../../svgAssets/BlockUser';
import GameInvitation from '../../svgAssets/GameInvitation';
import { User, UserStatuses } from '../data';
import { IoIosArrowBack } from 'react-icons/io';
import { useSocket } from '@/contexts/socketContext';

interface props {
  receiver: User;
  updateConversations: Function;
  statuses: UserStatuses;
  removeConversation: Function;
  conversationId: number;
}

const ConversationHeader: React.FC<props> = ({
  receiver,
  updateConversations,
  statuses,
  removeConversation,
  conversationId,
}) => {

  const {socket} = useSocket();

  const handleBlockUser = () => {
    blockUser(receiver.id).then((res) => {
      if (res) {
        removeConversation(conversationId);
      }
    });
  };

  const handleGameInvitation = () => {
    if (socket){
      console.log('emit invite');
      socket.emit('game-invite', {inviterId: receiver.id});
    }
  }

  return (
    <div
      className="absolute w-full h-16 top-0 rounded-t-[3rem] border-b-4 border-b-[#4b4b79c6]
        shadow-[0_6px_7px_0_rgba(0,0,0,0.25)]
        flex justify-between p-6
        bg-[#25244E] "
    >
      <div className="p-2 flex gap-2 self-center">
        <img
          src={process.env.BACKEND + `/api/users/${receiver.id}/avatar`}
          alt="receiver"
          width={100}
          height={100}
          className="w-10 h-10 rounded-full self-center"
        />
        <div className="flex flex-col self-center">
          <h6 className="font-semibold text-sm ">{receiver.username}</h6>
          <p className="font-light text-xs text-white/30 ">
            {receiver?.id && statuses[receiver?.id]?.toLocaleLowerCase()}
          </p>
        </div>
      </div>
      <div className="self-center flex gap-4 justify-center">
        <div
          className="self-center hover:cursor-pointer
                drop-shadow-[0_4px_8px_rgba(255,255,255,0.21)]"
          onClick={handleGameInvitation}
        >
          <GameInvitation color={'#59598E'} width={'29px'} height={'29px'} />
        </div>
        <div className="w-[2px] h-[30px] bg-[#6C61A480]"></div>
        <div
          className="self-center hover:cursor-pointer 
                "
          onClick={handleBlockUser}
        >
          <BlockUser color={'#59598E'} width={'29px'} height={'29px'} />
        </div>
      </div>
      <IoIosArrowBack
        className="absolute left-2 text-[#6C61A4] w-6 h-6 bottom-4 cursor-pointer 
      hover:drop-shadow-[0_0px_8px_rgba(255,255,255,0.9)] md:hidden"
        onClick={() => {
          updateConversations(false);
        }}
      />
    </div>
  );
};

export default ConversationHeader;
