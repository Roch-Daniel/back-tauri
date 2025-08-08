/* import { PartialType } from '@nestjs/mapped-types';
import { CreateMessageDto } from './create-message.dto'; */
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

//PartialType - To inherit the properties of CreateMessageDto, but make them optional
//export class UpdateMessageDto extends PartialType(CreateMessageDto) {
export class UpdateMessageDto {
  @IsString({
    message: 'String is required for text field',
  })
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(255)
  readonly text: string;

  @IsBoolean()
  @IsOptional()
  readonly read: boolean;
}
