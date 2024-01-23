import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class PhoneNumberDto {
  @Matches(/^\+212[0-9]{9}$/, {
    message: 'Phone number must be a valid Moroccan phone number',
  })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;
}
