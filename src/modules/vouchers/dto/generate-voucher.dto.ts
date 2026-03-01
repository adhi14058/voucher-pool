import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsUUID } from 'class-validator';

export class GenerateVoucherDto {
  @ApiProperty({ example: 'uuid-of-special-offer' })
  @IsUUID()
  specialOfferId: string;

  @ApiProperty({
    example: '2026-12-31T23:59:59.000Z',
    description: 'Expiration date for the voucher codes',
  })
  @IsDateString()
  expirationDate: string;
}
