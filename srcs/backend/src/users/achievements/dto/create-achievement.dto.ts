import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateAchievementDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  image: string;
}
