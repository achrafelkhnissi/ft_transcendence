import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get(['/', 'help'])
  getHelp(): object {
    return this.appService.getHelp();
  }

  @Get('authors')
  getAuthors(): object {
    return this.appService.getAuthors();
  }
}
