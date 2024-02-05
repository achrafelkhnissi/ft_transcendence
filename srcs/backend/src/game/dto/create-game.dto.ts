import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateGameDto {
  @IsNumber()
  @IsNotEmpty()
  winnerId: number;

  @IsNumber()
  @IsNotEmpty()
  loserId: number;

  @IsString()
  @IsNotEmpty()
  score: string;
}
