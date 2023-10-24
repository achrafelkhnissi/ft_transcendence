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
import { AuthGuard } from 'src/users/auth.guard';
import { User } from 'src/decorators/user.decorator';
import { UserType } from 'src/interfaces/user.interface';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  @Get()
  async index() {
    console.log('\n\n');
    console.log('--------- AuthController.index ---------');
    console.log('\n');

    return 'AuthController.index';
  }

  @Get('ft')
  @UseGuards(FtAuthGuard)
  async ft() {
    console.log('\n\n');
    console.log('--------- AuthController.ft ---------');
    console.log('\n');
  }

  @Get('ft/redirect')
  @UseGuards(FtAuthGuard)
  async ftRedirect(@Req() req: Request, @Res() res: Response) {
    console.log('\n\n');
    console.log('--------- AuthController.ftRedirect ---------');
    console.log('redirecting to http://localhost:1337/dashboard');
    console.log('\n');
    res.redirect('http://localhost:1337/dashboard');
  }

  @UseGuards(AuthGuard)
  @Get('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    console.log('\n\n');
    console.log('--------- AuthController.logout ---------');
    req.logout((err) => {
      if (err) {
        console.log(err);
        return err;
      }
      console.log('redirecting to ' + process.env.FRONTEND_URL);
      res.redirect(process.env.FRONTEND_URL);
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
