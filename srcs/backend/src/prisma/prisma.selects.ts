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
    readBy: true,
    createdAt: true,
    sender: userSelect,
  },
};

export const mutedUserSelect = {
  select: {
    user: userSelect,
    duration: true,
    createdAt: true,
  },
};

export const conversationSelect = {
  id: true,
  name: true,
  type: true,
  image: true,
  updatedAt: true,
  ownerId: true,
  owner: userSelect,
  admins: userSelect,
  participants: userSelect,
  messages: messageSelect,
  bannedUsers: userSelect,
  mutedUsers: mutedUserSelect,
};
