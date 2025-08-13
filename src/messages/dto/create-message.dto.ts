import {
  IsNotEmpty,
  IsPositive,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateMessageDto {
  @IsString({
    message: 'String is required for text field',
  })
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(255)
  readonly text: string;

  /* @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  readonly from: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  readonly to: string; */

  @IsPositive()
  @IsNotEmpty()
  readonly fromId: number;

  @IsPositive()
  @IsNotEmpty()
  readonly toId: number;
}
