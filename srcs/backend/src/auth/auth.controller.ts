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
    console.log('\n\n');
    console.log('--------- AuthController.ft ---------');
    console.log('\n');
  }

  @Get('ft/redirect')
  @UseGuards(FtAuthGuard)
  async ftRedirect(@User() user: UserType, @Res() res: Response) {
    const isPhoneNumberVerified = user.isPhoneNumberVerified;
    const domainName = process.env.FT_REDIRECT_URI.split('/')[2].split(':')[0];

    console.log('\n\n');
    console.log('--------- AuthController.ftRedirect ---------');
    console.log(`Redirecting to http://${domainName}:1337/dashboard`);
    console.log({
      function: 'ftRedirect',
    });
    console.log('\n');

    if (isPhoneNumberVerified) {
      // TODO: Check if 2FA is enabled
      this.logger.log('2FA is enabled');
      return res.redirect(`http://${domainName}:1337/verify`);
    }

    res.redirect(`http://${domainName}:1337/dashboard`);
  }

  @UseGuards(AuthGuard)
  @Get('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    const host = os.hostname();

    console.log('\n\n');
    console.log('--------- AuthController.logout ---------');
    req.logout((err) => {
      if (err) {
        console.log(err);
        return err;
      }
      console.log(`redirecting to http://${host}:1337`);
      res.redirect(`http://${host}:1337`);
    });
    console.log('\n');
  }

  @Get('whoami')
  async whoami(
    @User(/* new ValidationPipe({ validateCustomDecorators: true }) */)
    user: UserType,
    @Res() res: Response,
  ) {
    // async whoami(@User('username') username: string, @Res() res: Response) {
    console.log('\n\n');
    console.log('--------- AuthController.whoami ---------');

    console.log({
      function: 'whoami',
      user,
      // username,
    });

    console.log('\n');
    res.send(user ? user : 'not logged in');
    // res.send(username ? username : 'not logged in');
  }
}
