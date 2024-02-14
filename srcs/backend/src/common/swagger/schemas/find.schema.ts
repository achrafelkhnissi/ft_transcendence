export const findUserSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      id: { type: 'number' },
      username: { type: 'string' },
      avatar: { type: 'string' },
      url: { type: 'string' },
      phoneNumber: { type: 'string' },
      status: { enum: ['ONLINE', 'OFFLINE', 'PLAYING'] },
      stats: {
        type: 'object',
        properties: {
          exp: { type: 'number' },
          level: { type: 'number' },
          wins: { type: 'number' },
          loses: { type: 'number' },
        },
      },
      achievements: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            description: { type: 'string' },
            image: { type: 'string' },
          },
        },
      },
      settings: {
        type: 'object',
        properties: {
          twoFactorEnabled: { type: 'boolean' },
          verified: { type: 'boolean' },
        },
      },
    },
  },
};
