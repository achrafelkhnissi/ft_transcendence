import { useState, useEffect, useRef } from 'react';
import BlockUser from '../svgAssets/BlockUser';
import Emoji from '../svgAssets/Emoji';
import GameInvitation from '../svgAssets/GameInvitation';
import SendMessage from '../svgAssets/SendMessage';
import MessageContainer from './dm/MessageContainer';
import { UserStatuses, ConversationsMap, User, Message, Mute } from './data';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { useSocket } from '@/contexts/socketContext';
import ConversationHeader from './dm/ConversationHeader';
import ChannelsHeader from './channels/ChannelsHeader';
import ChannelMessageContainer from './channels/ChannelMessageContainer';
import { IoIosArrowBack } from 'react-icons/io';
import ChannelInfo from './channels/ChannelInfo';
import axios from 'axios';
import checkIfMuted from './tools/chaeckIfMuted';
import unmuteUser from '@/services/unmuteUser';

interface ViewConversationsProps {
  conversationId: number;
  conversationsMap: ConversationsMap;
  statuses: UserStatuses;
  currentUser: User | undefined;
  showConversation: boolean;
  updateShowConversation: Function;
  addAdmin: Function;
  updateConversations: Function;
  removeConversation: Function;
}

const ViewConversations: React.FC<ViewConversationsProps> = ({
  conversationId,
  conversationsMap,
  statuses,
  currentUser,
  showConversation,
  updateShowConversation,
  addAdmin,
  updateConversations,
  removeConversation,
}) => {
  const { socket } = useSocket();
  const [newMessage, setNewMessage] = useState<string>('');
  const [showChannelInfo, setShowChannelInfo] = useState<boolean>(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const infoRef = useRef(null);

  const handleEmojiSelect = (
    emojiObject: EmojiClickData,
    event: MouseEvent,
  ) => {
    setNewMessage((prevMessage) => prevMessage + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const messages = conversationsMap[conversationId]?.messages;

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (
      conversationId >= 0 &&
      conversationsMap.hasOwnProperty(conversationId) &&
      conversationsMap[conversationId].type != 'DM'
    ) {
      const muteObject = conversationsMap[conversationId]?.mutedUsers?.filter(
        (mute) => mute.user.id === currentUser?.id,
      )[0];
      if (muteObject !== undefined) {
        let res = checkIfMuted(muteObject);
        if (res) {
          setIsMuted(true);
        } else {
          unmuteUser(currentUser?.id, conversationId).then((res) => {
            if (res) {
              //
            }
          });
          setIsMuted(false);
        }
      } else setIsMuted(false);
    }
  }, [conversationId, conversationsMap, currentUser?.id]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        infoRef.current &&
        !(infoRef.current as any).contains(event.target as Node)
      ) {
        console.log('clicked outside');
        setShowChannelInfo(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  let receiver: User = {
    username: '',
    avatar: '',
    status: '',
  };

  if (
    conversationId >= 0 &&
    conversationsMap.hasOwnProperty(conversationId) &&
    conversationsMap[conversationId].type == 'DM'
  ) {
    const [firstParticipant, secondParticipant] =
      conversationsMap[conversationId].participants;

    receiver =
      firstParticipant.id === currentUser?.id
        ? secondParticipant
        : firstParticipant;
  }

  const handleSend = async () => {
    const onlySpacesRegex = /^\s*$/;

    if (!onlySpacesRegex.test(newMessage)) {
      const { data } = await axios.post(
        process.env.BACKEND + '/api/users/chat/message',
        {
          content: newMessage,
          conversationId: Number(conversationId),
          room: conversationsMap[conversationId].name,
        },
        { withCredentials: true },
      );
    }
    setNewMessage('');
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter') {
      // Prevent the default behavior of the "Enter" key
      event.preventDefault();
      if (event.shiftKey) setNewMessage((prevMessage) => prevMessage + '\n');
      else {
        handleSend();
      }
    }
  };

  return (
    <div
      className={`md:w-4/6 bg-[#25244E] rounded-[3rem] w-full h-full 
        shadow-[0_10px_20px_15px_rgba(0,0,0,0.2)] relative text-white 
        ${showConversation ? '' : 'hidden md:block'}
       `}
    >
      {/* Header */}
      {conversationId >= 0 &&
        conversationsMap.hasOwnProperty(conversationId) && (
          <>
            {conversationsMap[conversationId].type === 'DM' && (
              <ConversationHeader
                receiver={receiver}
                updateConversations={updateShowConversation}
                statuses={statuses}
                removeConversation={removeConversation}
                conversationId={conversationId}
              />
            )}
            {conversationsMap[conversationId].type != 'DM' && (
              <>
                <ChannelsHeader
                  channel={conversationsMap[conversationId]}
                  updateConversations={updateShowConversation}
                  showChannelInfo={showChannelInfo}
                  setShowChannelInfo={setShowChannelInfo}
                />
                {showChannelInfo && (
                  <div
                    ref={infoRef}
                    className="absolute w-[90%] max-h-[85%] left-1/2 top-1/2 transform 
                    -translate-x-1/2 -translate-y-1/2 z-20 overflow-y-auto rounded-lg "
                  >
                    <ChannelInfo
                      currentUser={currentUser}
                      channel={conversationsMap[conversationId]}
                      updateConversations={updateConversations}
                      statuses={statuses}
                    />
                  </div>
                )}
              </>
            )}
            {/* Messages */}
            <div className="w-full h-full overflow-hidden py-6">
              <div
                className="flex flex-col gap-2 sm:h-[91%] h-[83%] my-auto mt-12 overflow-y-scroll px-6 py-4"
                ref={chatContainerRef}
              >
                {conversationsMap[conversationId].type === 'DM' &&
                  conversationsMap[conversationId].messages.map(
                    (message, index) => {
                      return (
                        <MessageContainer
                          isCurrentUser={currentUser?.id === message.sender.id}
                          content={message.content}
                          date={message.createdAt}
                          key={index}
                        />
                      );
                    },
                  )}
                {conversationsMap[conversationId].type != 'DM' &&
                  conversationsMap[conversationId].messages.map(
                    (message, index, array) => {
                      return (
                        <ChannelMessageContainer
                          message={message}
                          isCurrentUser={currentUser?.id === message.sender.id}
                          displayAvatr={
                            array[index + 1]?.sender != message.sender
                          }
                          key={index}
                        />
                      );
                    },
                  )}
              </div>
            </div>
            {/* Input */}
            <div
              className="absolute bottom-3 w-11/12 h-14 rounded-3xl left-1/2 transform -translate-x-1/2
                            bg-[#59598E4A] flex text-sm"
            >
              <button
                className={`self-center pl-[1.3rem] hover:cursor-pointer
                drop-shadow-[0_3px_8px_rgba(255,255,255,0.15)] relative ${
                  isMuted &&
                  conversationsMap[conversationId].type != 'DM' &&
                  'cursor-not-allowed'
                } `}
                onClick={toggleEmojiPicker}
                disabled={
                  isMuted && conversationsMap[conversationId].type != 'DM'
                    ? true
                    : false
                }
              >
                <Emoji color={'#20204A'} width={'29px'} height={'29px'} />
                <div className="absolute bottom-10 left-0 ">
                  {showEmojiPicker && (
                    <EmojiPicker
                      onEmojiClick={handleEmojiSelect}
                      className=""
                    />
                  )}
                </div>
              </button>
              <div className="w-full h-full flex py-2">
                <textarea
                  disabled={isMuted}
                  name="message"
                  value={newMessage}
                  onKeyDown={handleKeyDown}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message here..."
                  className={`bg-transparent w-full h-full outline-none px-6
                                placeholder:text-white/20 placeholder:text-[0.60rem]  resize-none pt-[0.7rem] overflow-y-auto sm:placeholder:text-sm 
                  ${isMuted && conversationsMap[conversationId].type != 'DM' && 'cursor-not-allowed'} `}
                />
              </div>
              <button
                className={`self-center pr-[1.3rem] hover:cursor-pointer
                drop-shadow-[0_3px_8px_rgba(255,255,255,0.15)]
                ${isMuted && conversationsMap[conversationId].type != 'DM' && 'cursor-not-allowed'} `}
                onClick={() => {
                  handleSend();
                }}
                disabled={isMuted}
              >
                <SendMessage color={'#20204A'} width={'29px'} height={'29px'} />
              </button>
            </div>
          </>
        )}
    </div>
  );
};

export default ViewConversations;
