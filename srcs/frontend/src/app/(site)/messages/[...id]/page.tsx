/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import Preview from '@/components/messages/Preview';
import { useState, useEffect } from 'react';
import ViewConversations from '@/components/messages/ViewConversations';
import {
  Message,
  UserStatuses,
  Conversation,
  ConversationsMap,
  User,
  actionData,
} from '../../../../components/messages/data';
import getConversations from '@/services/getConversations';
import getCurrentUser from '@/services/getCurrentUser';
import { useSocket } from '@/contexts/socketContext';
import CreateChannel from '@/components/messages/channels/CreateChannel';
import markMessageAsRead from '@/services/markMessageAsRead';
import getAllUsersStatus from '@/services/getAllUsersStatus';

const Home = ({ params }: { params: { id: number } }) => {
  const [userStatuses, setUserStatuses] = useState<UserStatuses>({});
  const [conversationOrder, setConversationOrder] = useState<number[]>([]);
  const [conversations, setConversations] = useState<ConversationsMap>({});
  const [selectedConversationId, setSelectedConversationId] =
    useState<number>(-1);
  const [currentUser, setCurrentUser] = useState<User>();
  const [createChannel, setCreateChannel] = useState<boolean>(false);
  const [showConversation, setShowConversation] = useState<boolean>(false);
  const { socket } = useSocket();

  const markLastMessageAsRead = (conversationId: number) => {
    if (
      conversations[conversationId] &&
      conversations[conversationId].messages.length > 0
    ) {
      const message =
        conversations[conversationId].messages[
          conversations[conversationId].messages.length - 1
        ];
      markMessageAsRead(message.id).then((res) => {
        if (res)
          setConversations((prevConversations) => {
            const updatedConversations = { ...prevConversations };
            const conversation = updatedConversations[conversationId];

            if (conversation && conversation.messages.length > 0) {
              const lastMessageIndex = conversation.messages.length - 1;
              conversation.messages[lastMessageIndex] = {
                ...conversation.messages[lastMessageIndex],
                readBy: [
                  ...conversation.messages[lastMessageIndex].readBy,
                  currentUser?.id,
                ],
              };
            }

            return updatedConversations;
          });
      });
    }
  };

  const addConversation = (id: number) => {
    getConversations(id).then((res) => {
      setConversations((prev) => {
        return {
          ...prev,
          [id]: res,
        };
      });
      setConversationOrder((prev) => {
        return [id, ...prev];
      });
    });
  };

  const removeConversation = (id: number) => {
    setConversations((prev) => {
      const updatedConversations = { ...prev };
      delete updatedConversations[id];
      return updatedConversations;
    });
    setConversationOrder((prev) => prev.filter((convoId) => convoId != id));
  };

  const getConversationIdByName = (name: string) => {
    const conversationId = Object.keys(conversations).find(
      (key) => conversations[Number(key)].name === name,
    );
    return conversationId ? Number(conversationId) : -1;
  };

  const removeConversationByName = (name: string) => {
    const conversationId = getConversationIdByName(name);

    setConversations((prev) => {
      const updatedConversations = { ...prev };
      if (conversationId) {
        delete updatedConversations[Number(conversationId)];
      }
      return updatedConversations;
    });
    setConversationOrder((prev) =>
      prev.filter((convoId) => convoId != Number(conversationId)),
    );
  };

  const addAdminToConversation = (conversationId: number, user: User) => {
    setConversations((prevConversations) => {
      const updatedConversations = { ...prevConversations };
      const conversation = updatedConversations[conversationId];

      if (conversation) {
        conversation.admins.push(user);
      }

      return updatedConversations;
    });
  };

  const updateUserStatus = (userId: number, status: string) => {
    setUserStatuses((prevStatuses) => ({
      ...prevStatuses,
      [userId]: status,
    }));
  };

  const uppdateConversations = (newConversation: Conversation) => {
    setConversations((prev) => {
      return {
        ...prev,
        [newConversation.id]: newConversation,
      };
    });
    setConversationOrder((prevOrder) => {
      return [
        newConversation.id,
        ...prevOrder.filter((id) => id != newConversation.id),
      ];
    });
  };

  //  initialize conversations
  useEffect(() => {
    const initializeConversations = (initialConversations: Conversation[]) => {
      const sortedConversations = initialConversations?.sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      );

      const initialOrder = sortedConversations.map((convo) => convo.id);
      const initialConversationsMap =
        initialConversations.reduce<ConversationsMap>((acc, convo) => {
          const sortedMessagesConvo = convo.messages.sort(
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
          );
          acc[convo.id] = {...convo, messages: sortedMessagesConvo};
          return acc;
        }, {});

      setConversationOrder(initialOrder);
      setConversations(initialConversationsMap);
    };

    if (params.id > 0) {
      //check if the convo deos not exist
      setSelectedConversationId(params.id);
      setShowConversation(true);
    }

    getConversations().then((res) => {
      res && initializeConversations(res);
    });
    getAllUsersStatus().then((res) => {
      if (res) {
        const userStatuses: User[] = res;
        const userStatusesMap: UserStatuses = userStatuses.reduce<UserStatuses>(
          (acc, user) => {
            user.id && (acc[user.id] = user.status);
            return acc;
          },
          {},
        );
        setUserStatuses(userStatusesMap);
      }
    });
    getCurrentUser().then((res) => {
      if (res) setCurrentUser(res);
    });
  }, []);

  // socket
  useEffect(() => {
    const addMessageToConversation = (newMessage: Message) => {
      const conversationId = Number(newMessage.conversationId);

      if (
        conversations.hasOwnProperty(conversationId) &&
        conversations[conversationId]
      ) {
        setConversations((prev) => ({
          ...prev,
          [conversationId]: {
            ...prev[conversationId],
            messages: [...prev[conversationId].messages, newMessage],
            updatedAt: new Date().toISOString(),
          },
        }));
        setConversationOrder((prevOrder) => {
          return [
            conversationId,
            ...prevOrder.filter((id) => id != conversationId),
          ];
        });
      } else {
        // Handle case where the conversation is new or not loaded
        addConversation(conversationId);
      }
    };

    if (socket) {
      socket.on('onMessage', (message: Message) => {
        addMessageToConversation(message);
      });

      socket.on('status', (status: { userId: number; status: string }) => {
        updateUserStatus(status.userId, status.status);
      });

      socket.on('action', (res: actionData) => {
        switch (res.action) {
          case 'add':
          case 'remove-admin':
          case 'add-admin':
          case 'mute':
          case 'unmute':
          case 'join':
          case 'unban': {
            if (res.data.type != 'DM') uppdateConversations(res.data);
            break;
          }
          case 'leave':
          case 'remove':
          case 'ban': {
            if (res.user == currentUser?.id) {
              removeConversation(res.data.id);
              setShowConversation(false);
            } else {
              uppdateConversations(res.data);
            }
            break;
          }
        }
      });
      socket.on('blocked', (res) => {
        removeConversationByName(res.roomName);
      });
    }

    return () => {
      if (socket) {
        socket.off('connect');
        socket.off('onMessage');
        socket.off('action');
        socket.off('status');
        socket.off('blocked');
      }
    };
  }, [socket, conversations, currentUser]);

  return (
    <div
      className={` flex px-6 py-4 justify-center h-[90vh] min-w-[300px] min-h-[600px]`}
    >
      <div className="relative w-full h-full flex gap-6 self-center md:flex-row flex-col">
        <Preview
          conversationsMap={conversations}
          orderedConversations={conversationOrder}
          statuses={userStatuses}
          selectedConversation={selectedConversationId}
          updateSelectedConversation={setSelectedConversationId}
          markLastMessageAsRead={markLastMessageAsRead}
          createBtn={createChannel}
          setCreateBtn={setCreateChannel}
          currentUser={currentUser}
          showConversation={showConversation}
          updateShowConversation={setShowConversation}
        />
        <ViewConversations
          conversationId={selectedConversationId}
          conversationsMap={conversations}
          statuses={userStatuses}
          currentUser={currentUser}
          showConversation={showConversation}
          updateShowConversation={setShowConversation}
          addAdmin={addAdminToConversation}
          updateConversations={uppdateConversations}
          removeConversation={removeConversation}
        />
        {createChannel && (
          <div
            className={`absolute w-full h-full flex justify-center
        top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
        ${createChannel && 'blur-container'} `}
            onClick={() => setCreateChannel(false)}
          >
            <div
              className="max-w-[500px] w-full md:h-[700px] h-[600px]  self-center bg-[#101038]  z-40 
                            rounded-[2rem] border-4 border-blue-500/30 max-h-full text-xs md:text-base "
              onClick={(e) => e.stopPropagation()}
            >
              <CreateChannel
                currentUser={currentUser}
                conversationsMap={conversations}
                updateSelectedConversation={setSelectedConversationId}
                updateConversations={addConversation}
                updateCreateChannelState={setCreateChannel}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
