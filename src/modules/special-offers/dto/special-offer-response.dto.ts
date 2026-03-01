import { ApiProperty } from '@nestjs/swagger';

export class SpecialOfferResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  discountPercentage: number;

  @ApiProperty()
  createdAt: Date;
}
