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
// import { SmsService } from './sms/sms.service';
import {
  ApiForbiddenResponse,
  ApiFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import * as jose from 'jose';
import { AchievementsService } from 'src/users/achievements/achievements.service';
import { Achievements } from 'src/common/enums/achievements.enum';
import { GoogleAuthGuard } from './google/google.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    // private readonly smsService: SmsService,
    private readonly achievements: AchievementsService,
  ) {}

  @ApiOperation({ summary: 'OAuth2.0 42 API' })
  @Get('ft')
  @UseGuards(FtAuthGuard)
  async ft() {}

  @ApiOperation({ summary: 'OAuth2.0 42 API redirect' })
  @Get('ft/redirect')
  @UseGuards(FtAuthGuard)
  async ftRedirect(@User() user: UserType, @Res() res: Response) {
    const { settings } = user;

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);

    if (user.isNew) {
      await this.achievements.giveAchievementToUser(user.id, Achievements.NOOB);

      return res.redirect(`${process.env.FRONTEND}/settings`);
    }

    if (settings?.twoFactorEnabled) {
      // await this.smsService.initiatePhoneNumberVerification(user.phoneNumber);

      const token = await new jose.SignJWT({ id: user.id })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setIssuer(process.env.DOMAIN_NAME)
        .setExpirationTime('1m')
        .sign(secret);

      return res.redirect(`${process.env.FRONTEND}/verify?token=${token}`);
    }

    res.redirect(`${process.env.FRONTEND}/dashboard`);
  }

  @ApiOperation({ summary: 'OAuth2.0 Google API' })
  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async google() {}

  @ApiOperation({ summary: 'OAuth2.0 42 API redirect' })
  @Get('google/redirect')
  @UseGuards(GoogleAuthGuard)
  async googleRedirect(@User() user: UserType, @Res() res: Response) {
    const { settings } = user;

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);

    if (user.isNew) {
      await this.achievements.giveAchievementToUser(user.id, Achievements.NOOB);

      return res.redirect(`${process.env.FRONTEND}/settings`);
    }

    if (settings?.twoFactorEnabled) {
      // await this.smsService.initiatePhoneNumberVerification(user.phoneNumber);

      const token = await new jose.SignJWT({ id: user.id })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setIssuer(process.env.DOMAIN_NAME)
        .setExpirationTime('1m')
        .sign(secret);

      return res.redirect(`${process.env.FRONTEND}/verify?token=${token}`);
    }

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
        return err;
      }

      req.session.destroy(() => {
        res.clearCookie('pong-time.sid', {
          domain: process.env.DOMAIN_NAME,
          httpOnly: true,
          secure: false,
        });

        res.redirect(process.env.FRONTEND);
      });
    });
  }

  @Get('is-authenticated')
  @ApiOperation({ summary: 'Check if user is authenticated' })
  @SerializeOptions({ strategy: 'excludeAll' })
  async isAuthenticated(@Res() res: Response, @User() user: UserType) {
    if (user) {
      return res.status(HttpStatus.OK).send();
    }

    return res.status(HttpStatus.UNAUTHORIZED).send();
  }
}
