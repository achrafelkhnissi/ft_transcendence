import {
  Controller,
  Get,
  Req,
  Res,
  UseGuards,
  Logger,
  Query,
  // ValidationPipe,
} from '@nestjs/common';
import { FtAuthGuard } from './ft/ft.guard';
import { Request, Response } from 'express';
import { AuthGuard } from 'src/guards/auth.guard';
import { User } from 'src/decorators/user.decorator';
import { UserType } from 'src/interfaces/user.interface';
import * as os from 'os';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  @Get('ft')
  @UseGuards(FtAuthGuard)
  async ft() {
    this.logger.debug('ft');
  }

  @Get('ft/redirect')
  @UseGuards(FtAuthGuard)
  async ftRedirect(@User() user: UserType, @Res() res: Response) {
    const domainName = process.env.FT_REDIRECT_URI.split('/')[2].split(':')[0];

    // FIXME: Check if the logged in user enabled
    if (user.twoFactorEnabled) {
      this.logger.debug(`Redirecting user ${user.username} to verify 2FA page`);
      return res.redirect(`http://${domainName}:1337/verify`);
    }

    this.logger.debug(`Redirecting user ${user.username} to dashboard`);
    res.redirect(`http://${domainName}:1337/dashboard`);
  }

  @UseGuards(AuthGuard)
  @Get('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    req.logout((err) => {
      if (err) {
        this.logger.error(`Error logging out`);
        return err;
      }
      this.logger.debug(
        `Redirecting to http://localhost:1337 after logging out`,
      );
      res.redirect(`http://localhost:1337`);
    });
  }

  @Get('whoami')
  async whoami(
    @User(/* new ValidationPipe({ validateCustomDecorators: true }) */)
    user: UserType,
    @Res() res: Response,
    @Query('data') data: boolean,
  ) {
    if (data) {
      // TODO: Return all user's data [settings, stats, conversations, etc.]
    }

    this.logger.debug(`User ${user?.username ?? 'X'} is requesting whoami`);
    res.send(user ? user : 'not logged in');
  }
}
