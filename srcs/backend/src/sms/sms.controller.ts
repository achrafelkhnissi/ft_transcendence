import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { SmsService } from './sms.service';
import { User } from 'src/decorators/user.decorator';
import { UserType } from 'src/interfaces/user.interface';

@Controller('sms')
export class SmsController {
  constructor(private readonly smsService: SmsService) {}

  @Post('verify')
  verify(@User() user: UserType, @Body('phoneNumber') phoneNumber: string) {
    return this.smsService.initiatePhoneNumberVerification(
      user.phoneNumber ?? phoneNumber,
    );
  }

  @Post('confirm')
  confirm(@User() user: UserType, @Body('code') code: string) {
    if (user.isPhoneNumberVerified) {
      return new BadRequestException('Phone number already verified');
    }

    return this.smsService.confirmPhoneNumberVerification(
      user.id,
      user.phoneNumber,
      code,
    );
  }
}
