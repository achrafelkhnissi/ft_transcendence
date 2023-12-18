import {
  Controller,
  Get,
  Req,
  Res,
  UseGuards,
  Logger,
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
    const isPhoneNumberVerified = user.isPhoneNumberVerified;
    const domainName = process.env.FT_REDIRECT_URI.split('/')[2].split(':')[0];

    if (isPhoneNumberVerified) {
      this.logger.debug(`Redirecting user ${user.username} to verify 2FA page`);
      return res.redirect(`http://${domainName}:1337/verify`);
    }

    this.logger.debug(`Redirecting user ${user.username} to dashboard`);
    res.redirect(`http://${domainName}:1337/dashboard`);
  }

  @UseGuards(AuthGuard)
  @Get('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    const host = os.hostname();
    req.logout((err) => {
      if (err) {
        this.logger.error(`Error logging out`);
        return err;
      }
      this.logger.debug(`Redirecting to http://${host}:1337 after logging out`);
      res.redirect(`http://${host}:1337`);
    });
  }

  @Get('whoami')
  async whoami(
    @User(/* new ValidationPipe({ validateCustomDecorators: true }) */)
    user: UserType,
    @Res() res: Response,
  ) {
    this.logger.debug(`User ${user.username} requested whoami`);
    res.send(user ? user : 'not logged in');
  }
}
