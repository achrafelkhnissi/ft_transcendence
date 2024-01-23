import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { SmsService } from './sms.service';
import { User } from 'src/decorators/user.decorator';
import { UserType } from 'src/interfaces/user.interface';
import { PhoneNumberDto } from './dto/phone-number.dto';
import { ConfirmationDto } from './dto/confirmation-code';

@Controller('sms')
export class SmsController {
  constructor(private readonly smsService: SmsService) {}

  @Post('verify')
  verify(@User() user: UserType, @Body() body: PhoneNumberDto) {
    const { phoneNumber } = body;

    console.log({
      userPhoneNumber: user?.phoneNumber,
      phoneNumber,
    });

    return this.smsService.initiatePhoneNumberVerification(
      phoneNumber ?? user?.phoneNumber,
    );
  }

  @Post('confirm')
  confirm(@User() user: UserType, @Body() body: ConfirmationDto) {
    if (user.isPhoneNumberVerified) {
      return new BadRequestException('Phone number already verified');
    }

    const { code, phoneNumber } = body;

    console.log({
      phoneNumber,
      code,
    });

    return this.smsService.confirmPhoneNumberVerification(
      user.id,
      phoneNumber,
      code,
    );
  }
}
