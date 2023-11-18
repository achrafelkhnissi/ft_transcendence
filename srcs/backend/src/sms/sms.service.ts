import { PrismaService } from 'src/prisma/prisma.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Twilio } from 'twilio';

@Injectable()
export class SmsService {
  private twilioClient: Twilio;
  constructor(private readonly prismaService: PrismaService) {
    this.twilioClient = new Twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN,
    );
  }

  async initiatePhoneNumberVerification(phoneNumber: string) {
    return this.twilioClient.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .verifications.create({
        to: phoneNumber,
        channel: 'sms',
      });
  }

  async confirmPhoneNumberVerification(
    userId: number,
    phoneNumber: string,
    code: string,
  ) {
    const result = await this.twilioClient.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .verificationChecks.create({
        to: phoneNumber,
        code,
      });

    if (!result.valid || result.status !== 'approved') {
      throw new BadRequestException('Invalid verification code');
    }

    return await this.updatePhoneNumberVerificationStatus(userId);
  }

  async updatePhoneNumberVerificationStatus(userId: number) {
    return await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        isPhoneNumberVerified: true,
      },
    });
  }
}
