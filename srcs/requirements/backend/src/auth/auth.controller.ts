import { Controller, Get, Req, Res, UseGuards, Logger } from '@nestjs/common';
import { FtAuthGuard } from './ft/ft.guard';
import { Request, Response } from 'express';

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
    console.log('redirecting to http://localhost:3000/api/users');
    console.log('\n');
    // const { user } = req;
    // console.log({
    //   function: 'ftRedirect',
    //   user,
    //   session: req.session,
    // });
    res.redirect('http://localhost:3000/api/users');
  }

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
  async whoami(@Req() req: Request, @Res() res: Response) {
    console.log('\n\n');
    console.log('--------- AuthController.whoami ---------');
    console.log({
      function: 'whoami',
      user: req.user,
      session: req.session,
    });
    console.log('\n');
    res.send(req.user ? req.user : "You're not logged in");
  }
}
