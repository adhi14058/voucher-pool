import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RedeemVoucherDto {
  @ApiProperty({ example: 'ABCD1234' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  email: string;
}
