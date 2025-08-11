/* import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto'; */

import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  @IsNotEmpty()
  @IsOptional()
  name: string;

  @IsNotEmpty()
  @IsOptional()
  @IsStrongPassword({
    minLength: 8,
  })
  password: string;
}
