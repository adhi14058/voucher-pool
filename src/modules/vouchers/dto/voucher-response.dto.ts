import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class VoucherResponseDto {
  @Expose()
  @ApiProperty()
  id: string;

  @Expose()
  @ApiProperty()
  code: string;

  @Expose()
  @ApiProperty()
  expirationDate: Date;

  @Expose()
  @ApiProperty()
  customerId: string;

  @Expose()
  @ApiProperty()
  specialOfferId: string;

  @Expose()
  @ApiProperty()
  createdAt: Date;
}

export class RedeemVoucherResponseDto {
  @Expose()
  @ApiProperty({ example: 20.0 })
  discountPercentage: number;
}

export class ValidVoucherResponseDto {
  @Expose()
  @ApiProperty()
  code: string;

  @Expose()
  @ApiProperty()
  specialOfferName: string;

  @Expose()
  @ApiProperty()
  discountPercentage: number;

  @Expose()
  @ApiProperty()
  expirationDate: Date;
}
