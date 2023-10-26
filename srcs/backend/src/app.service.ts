import { Injectable } from '@nestjs/common';

const HELP = {
  'GET /api': 'Get this help message',
  authors: {
    'GET /api/authors': 'Get all authors',
  },
  users: {
    'GET /api/users': 'Get all users',
    'GET /api/users/:id': 'Get a user by id',
    'POST /api/users': 'Create a user',
    'PUT /api/users/:id': 'Update a user by id',
    'DELETE /api/users/:id': 'Delete a user by id',
    'GET /api/users/:username/friends': "Get a user's friends",
  },
  friends: {
    'GET /api/users/friends':
      'Get all friends (add ?username=friend to display other user friends)',
    'GET /api/users/friends/remove?username=friend': 'Remove a friend',
    'GET /api/users/friends/blocked': 'Get all blocked users',
    'GET /api/users/friends/block?username=friend': 'Block a user',
    'GET /api/users/friends/unblock?username=friend': 'Unblock a user',
  },
  FriendRequests: {
    'GET /api/users/friends/requests/send?username=friend':
      'Send a friend request',
    'GET /api/users/friends/requests/accept?username=friend':
      'Accept a friend request',
    'GET /api/users/friends/requests/decline?username=friend':
      'Decline a friend request',
    'GET /api/users/friends/requests/cancel?username=friend':
      'Cancel a friend request',
    'GET /api/users/friends/requests/sent': 'Get all sent friend requests',
    'GET /api/users/friends/requests/received':
      'Get all received friend requests',
  },
  Notifications: {
    'POST /api/users/notifications': 'Create a notification',
    'GET /api/users/notifications': 'Get all notifications',
    'GET /api/users/notifications/:id': 'Get a notification by id',
    'GET /api/users/notifications/:id/read': 'Mark a notification as read',
    'GET /api/users/notifications/:id/unread': 'Mark a notification as unread',
    'DELETE/api/users/notifications/:id': 'Delete a notification',
  },
  Authentication: {
    'GET /auth/ft': 'Authenticate with 42',
    'GET /auth/ft/redirect': 'Redirect from 42',
    'GET /auth/logout': 'Logout',
    'GET /auth/whoami': 'Get the current user',
  },
};

@Injectable()
export class AppService {
  getHelp(): object {
    return HELP;
  }

  getAuthors(): object {
    return {
      frontend: 'Fathiyat Olatokunbo Jamia',
      backend: 'Achraf El Khnissi',
      game: 'Zaineb Sarir',
    };
  }
}
