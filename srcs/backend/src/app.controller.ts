import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOkResponse({ description: 'Return authors' })
  @ApiOperation({ summary: 'Get authors' })
  @Get('authors')
  getAuthors(): object {
    return this.appService.getAuthors();
  }
}
