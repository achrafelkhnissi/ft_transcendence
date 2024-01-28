import { PrismaService } from 'src/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Twilio } from 'twilio';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SmsService {
  private twilioClient: Twilio;
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {
    this.twilioClient = new Twilio(
      this.configService.get<string>('twilio.accountSid'),
      this.configService.get<string>('twilio.authToken'),
    );
  }

  /**
   * Sends a verification code to the provided phone number
   * @param phoneNumber - The phone number to send the verification code to
   * @returns  - A message indicating that the verification code has been sent
   *
   * @throws BadRequestException - If the verification code could not be sent
   * @note - When the return type isn't specified, the TransformOperationExecutor.transform method in the class-transformer library.
   *        This method is used by the ClassSerializerInterceptor class to transform the response body
   *        will be called recursively, but for some reason, it's not terminating as expected.
   */
  async initiatePhoneNumberVerification(
    phoneNumber: string,
  ): Promise<{ status: string; message: string }> {
    try {
      const result = await this.twilioClient.verify.v2
        .services(this.configService.get<string>('twilio.verifyServiceSid'))
        .verifications.create({
          to: phoneNumber,
          channel: 'sms',
        });

      if (result.status !== 'pending') {
        return {
          status: 'error',
          message: 'Unable to send verification code',
        };
      }
    } catch (error) {
      return {
        status: 'error',
        message: `Unable to send verification code: ${error.message}`,
      };
    }

    return {
      status: 'success',
      message: 'Verification code sent',
    };
  }

  async confirmPhoneNumberVerification(
    userId: number,
    phoneNumber: string,
    code: string,
  ) {
    try {
      const result = await this.twilioClient.verify.v2
        .services(process.env.TWILIO_VERIFY_SERVICE_SID)
        .verificationChecks.create({
          to: phoneNumber,
          code,
        });

      if (!result.valid || result.status !== 'approved') {
        return {
          status: 'error',
          message: 'Invalid verification code',
        };
      }
    } catch (error) {
      return {
        status: 'error',
        message: `Unable to verify phone number.`,
      };
    }

    return await this.updatePhoneNumberVerificationStatus(userId);
  }

  async updatePhoneNumberVerificationStatus(userId: number) {
    return this.prismaService.userSettings.update({
      where: {
        userId,
      },
      data: {
        twoFactorEnabled: true,
        verified: true,
      },
    });
  }
}
