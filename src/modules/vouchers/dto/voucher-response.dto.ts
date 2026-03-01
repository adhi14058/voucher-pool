import { ApiProperty } from '@nestjs/swagger';

export class VoucherResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  code: string;

  @ApiProperty()
  expirationDate: Date;

  @ApiProperty()
  customerId: string;

  @ApiProperty()
  specialOfferId: string;

  @ApiProperty()
  createdAt: Date;
}

export class RedeemVoucherResponseDto {
  @ApiProperty({ example: 20.0 })
  discountPercentage: number;
}

export class ValidVoucherResponseDto {
  @ApiProperty()
  code: string;

  @ApiProperty()
  specialOfferName: string;

  @ApiProperty()
  discountPercentage: number;

  @ApiProperty()
  expirationDate: Date;
}
