import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getAuthors(): object {
    return {
      frontend: 'Fathiyat Olatokunbo Jamia',
      backend: 'Achraf El Khnissi',
      game: 'Zaineb Sarir',
    };
  }
}
