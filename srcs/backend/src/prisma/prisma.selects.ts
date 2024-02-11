export const userSelect = {
  select: {
    id: true,
    username: true,
    avatar: true,
    status: true,
  },
};

export const messageSelect = {
  select: {
    id: true,
    content: true,
    isRead: true,
    createdAt: true,
    user: userSelect,
  },
};

export const conversationSelect = {
  id: true,
  name: true,
  type: true,
  updatedAt: true,
  ownerId: true,
  owner: userSelect,
  admins: userSelect,
  participants: userSelect,
  messages: messageSelect,
  bannedUsers: userSelect,
  mutedUsers: userSelect,
};
