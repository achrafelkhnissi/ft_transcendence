import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class ConfirmationDto {
  @Matches(/^[0-9]{6}$/, {
    message: 'Code must be a 6 digit number',
  })
  @IsNotEmpty()
  @IsString()
  code: string;

  @Matches(/^\+212[0-9]{9}$/, {
    message: 'Phone number must be a valid Moroccan phone number',
  })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;
}
