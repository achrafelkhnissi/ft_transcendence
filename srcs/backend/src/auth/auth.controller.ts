import { Controller, Get, Req, Res, UseGuards, Logger } from '@nestjs/common';
import { FtAuthGuard } from './ft/ft.guard';
import { Request, Response } from 'express';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { User } from 'src/common/decorators/user.decorator';
import { UserType } from 'src/common/interfaces/user.interface';
import { SmsService } from './sms/sms.service';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly smsService: SmsService) {}

  @Get('ft')
  @UseGuards(FtAuthGuard)
  async ft() {
    this.logger.debug('ft');
  }

  @Get('ft/redirect')
  @UseGuards(FtAuthGuard)
  async ftRedirect(@User() user: UserType, @Res() res: Response) {
    const { settings } = user;

    // TODO: To be tested
    // Set a cookie to be used by the frontend to determine if the user is logged in
    res.cookie('pong-time.authenticated', 'true', {
      maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
      httpOnly: false, // Allow client side JS to read the cookie
      secure: false, // Sent over HTTP and HTTPS
    });

    if (user.isNew) {
      this.logger.debug(`Redirecting user ${user.username} to settings page`);
      return res.redirect(`${process.env.FRONTEND_URL}/settings`);
    }

    if (settings?.twoFactorEnabled) {
      this.logger.debug(`Redirecting user ${user.username} to verify 2FA page`);
      await this.smsService.initiatePhoneNumberVerification(user.phoneNumber);
      return res.redirect(`${process.env.FRONTEND_URL}/verify`);
    }

    this.logger.debug(
      `Redirecting user ${user.username} to ${process.env.FRONTEND_URL}/dashboard`,
    );
    res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
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
        `Redirecting to ${process.env.FRONTEND_URL} after logging out`,
      );

      req.session.destroy(() => {
        res.clearCookie('pong-time.sid', {
          path: '/',
          domain: 'localhost',
          httpOnly: true,
          secure: false,
        });

        res.clearCookie('pong-time.authenticated', {
          path: '/',
          domain: 'localhost',
          httpOnly: false,
          secure: false,
        });

        this.logger.debug(`Session destroyed`);

        res.redirect(process.env.FRONTEND_URL);
      });
    });
  }
}
