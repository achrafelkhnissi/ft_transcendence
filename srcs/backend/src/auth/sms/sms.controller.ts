import { AchievementsService } from './../../users/achievements/achievements.service';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
// import { SmsService } from './sms.service';
import { User } from 'src/common/decorators/user.decorator';
import { UserType } from 'src/common/interfaces/user.interface';
import { PhoneNumberDto } from './dto/phone-number.dto';
import { ConfirmationCodeDto } from './dto/confirmation-code.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { Achievements } from 'src/common/enums/achievements.enum';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

// TODO: Test end points in case of failure then update ApiResponses swagger

@UseGuards(AuthGuard)
@ApiTags('sms')
@ApiForbiddenResponse({ description: 'Forbidden' })
@Controller('sms')
export class SmsController {
  constructor(
    // private readonly smsService: SmsService,
    private readonly achievementsService: AchievementsService,
  ) {}

  @ApiBody({ type: PhoneNumberDto })
  @ApiCreatedResponse({ description: 'Initiate phone number verification' })
  @ApiOperation({ summary: 'Initiate phone number verification' })
  @Post('verify')
  verify(@User() user: UserType, @Body() body: PhoneNumberDto) {
    const { phoneNumber } = body;

    // return this.smsService.initiatePhoneNumberVerification(
    //   phoneNumber ?? user?.phoneNumber,
    // );
  }

  @ApiBody({ type: ConfirmationCodeDto })
  @ApiCreatedResponse({ description: 'Confirm phone number verification' })
  @ApiOperation({ summary: 'Confirm phone number verification' })
  @Post('confirm')
  async confirm(@User() user: UserType, @Body() body: ConfirmationCodeDto) {
    const { code, phoneNumber } = body;

    // const result = await this.smsService.confirmPhoneNumberVerification(
    //   user.id,
    //   phoneNumber ?? user?.phoneNumber,
    //   code,
    // );

    // if (result?.status !== 'error') {
    //   await this.achievementsService.giveAchievementToUser(
    //     user.id,
    //     Achievements.VERIFIED,
    //   );
    // }

    // return result;
  }
}
