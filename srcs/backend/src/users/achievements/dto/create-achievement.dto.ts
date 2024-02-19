import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateAchievementDto {
  @IsNumber()
  @IsNotEmpty()
  userId: number;

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
