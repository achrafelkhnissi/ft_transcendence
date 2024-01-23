import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { SmsService } from './sms.service';
import { User } from 'src/common/decorators/user.decorator';
import { UserType } from 'src/common/interfaces/user.interface';
import { PhoneNumberDto } from './dto/phone-number.dto';
import { ConfirmationCodeDto } from './dto/confirmation-code.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';

// TODO: Uncomment after buying 20$ Twilio credits :(
@UseGuards(AuthGuard)
@Controller('sms')
export class SmsController {
  constructor(private readonly smsService: SmsService) {}

  @Post('verify')
  verify(@User() user: UserType, @Body() body: PhoneNumberDto) {
    const { phoneNumber } = body;

    // return this.smsService.initiatePhoneNumberVerification(
    //   phoneNumber ?? user?.phoneNumber,
    // );

    return {
      phoneNumber: phoneNumber ?? user?.phoneNumber,
    };
  }

  @Post('confirm')
  confirm(@User() user: UserType, @Body() body: ConfirmationCodeDto) {
    const { code, phoneNumber } = body;

    // return this.smsService.confirmPhoneNumberVerification(
    //   user.id,
    //   phoneNumber ?? user?.phoneNumber,
    //   code,
    // );

    return {
      code,
      phoneNumber: phoneNumber ?? user?.phoneNumber,
    };
  }
}
