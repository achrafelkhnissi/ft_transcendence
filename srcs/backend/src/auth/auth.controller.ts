import {
  Controller,
  Get,
  Req,
  Res,
  UseGuards,
  Logger,
  HttpStatus,
  SerializeOptions,
} from '@nestjs/common';
import { FtAuthGuard } from './ft/ft.guard';
import { Request, Response } from 'express';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { User } from 'src/common/decorators/user.decorator';
import { UserType } from 'src/common/interfaces/user.interface';
import { SmsService } from './sms/sms.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
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

    if (user.isNew) {
      this.logger.debug(`Redirecting user ${user.username} to settings page`);
      return res.redirect(`${process.env.FRONTEND}/settings`);
    }

    if (settings?.twoFactorEnabled) {
      this.logger.debug(`Redirecting user ${user.username} to verify 2FA page`);
      await this.smsService.initiatePhoneNumberVerification(user.phoneNumber);
      return res.redirect(`${process.env.FRONTEND}/verify`);
    }

    this.logger.debug(
      `Redirecting user ${user.username} to ${process.env.FRONTEND}/dashboard`,
    );
    res.redirect(`${process.env.FRONTEND}/dashboard`);
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
        `Redirecting to ${process.env.FRONTEND} after logging out`,
      );

      req.session.destroy(() => {
        res.clearCookie('pong-time.sid', {
          path: '/',
          domain: process.env.DOMAIN_NAME,
          httpOnly: true,
          secure: false,
        });

        this.logger.debug(`Session destroyed`);

        res.redirect(process.env.FRONTEND);
      });
    });
  }

  @Get('is-authenticated')
  @SerializeOptions({ strategy: 'excludeAll' })
  async isAuthenticated(@Req() req: Request, @Res() res: Response) {
    if (req.isAuthenticated()) {
      return res.status(HttpStatus.OK).send();
    }

    return res.status(HttpStatus.UNAUTHORIZED).send();
  }
}
