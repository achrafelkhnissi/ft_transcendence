import { Transform } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsNotEmpty,
  IsNumber,
  Matches,
  MinLength,
} from 'class-validator';

function toNumber(value: string): number {
  return parseInt(value);
}

export class QueryDto {
  @IsNotEmpty()
  @IsOptional()
  @IsString()
  @Matches(/^[a-z]+(-[a-z]+)*$/, {
    message:
      'Username must contain only lowercase letters and dashes, and cannot start or end with a dash',
  })
  @MinLength(4, {
    message: 'Username must be at least 4 characters long',
  })
  username?: string;

  @IsNotEmpty()
  @IsOptional()
  @Transform(({ value }) => toNumber(value))
  @IsNumber({}, { message: 'Id must be a number' })
  id?: number;
}
