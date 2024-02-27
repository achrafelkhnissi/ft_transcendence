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
import {
  ApiForbiddenResponse,
  ApiFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import * as jose from 'jose';
import { AchievementsService } from 'src/users/achievements/achievements.service';
import { Achievements } from 'src/common/enums/achievements.enum';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly smsService: SmsService,
    private readonly achievements: AchievementsService,
  ) {}

  @ApiOperation({ summary: 'OAuth2.0 42 API' })
  @Get('ft')
  @UseGuards(FtAuthGuard)
  async ft() {
    this.logger.debug('ft');
  }

  @ApiOperation({ summary: 'OAuth2.0 42 API redirect' })
  @Get('ft/redirect')
  @UseGuards(FtAuthGuard)
  async ftRedirect(@User() user: UserType, @Res() res: Response) {
    const { settings } = user;

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const token = await new jose.SignJWT({ id: user.id })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setIssuer(process.env.DOMAIN_NAME)
      .setExpirationTime('1y')
      .sign(secret);

    res.cookie('pong-time.auth', token, {
      maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
      httpOnly: true,
      secure: false,
      domain: process.env.DOMAIN_NAME,
    });

    if (user.isNew) {
      this.logger.debug(`Redirecting user ${user.username} to settings page`);
      await this.achievements.giveAchievementToUser(user.id, Achievements.NOOB);

      return res.redirect(`${process.env.FRONTEND}/settings`);
    }

    if (settings?.twoFactorEnabled) {
      this.logger.debug(`Redirecting user ${user.username} to verify 2FA page`);
      await this.smsService.initiatePhoneNumberVerification(user.phoneNumber);

      const token = await new jose.SignJWT({ id: user.id })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setIssuer(process.env.DOMAIN_NAME)
        .setExpirationTime('1m')
        .sign(secret);

      return res.redirect(`${process.env.FRONTEND}/verify?token=${token}`);
    }

    this.logger.debug(
      `Redirecting user ${user.username} to ${process.env.FRONTEND}/dashboard`,
    );
    res.redirect(`${process.env.FRONTEND}/dashboard`);
  }

  @UseGuards(AuthGuard)
  @ApiFoundResponse({ description: 'Redirecting to frontend' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiOperation({ summary: 'Logout' })
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
          domain: process.env.DOMAIN_NAME,
          httpOnly: true,
          secure: false,
        });

        res.clearCookie('pong-time.auth', {
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
  @ApiOperation({ summary: 'Check if user is authenticated' })
  @SerializeOptions({ strategy: 'excludeAll' })
  async isAuthenticated(@Req() req: Request, @Res() res: Response) {
    if (req.isAuthenticated()) {
      return res.status(HttpStatus.OK).send();
    }

    return res.status(HttpStatus.UNAUTHORIZED).send();
  }
}
