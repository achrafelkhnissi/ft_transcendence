import { Injectable } from '@nestjs/common';

const HELP = {
  'GET /': 'Get this help message',
  users: {
    'GET /users': 'Get all users',
    'GET /users/:id': 'Get a user by id',
    'POST /users': 'Create a user',
    'PUT /users/:id': 'Update a user by id',
    'DELETE /users/:id': 'Delete a user by id',
  },
};

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

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
