import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class SpecialOfferResponseDto {
  @Expose()
  @ApiProperty()
  id: string;

  @Expose()
  @ApiProperty()
  name: string;

  @Expose()
  @ApiProperty()
  discountPercentage: number;

  @Expose()
  @ApiProperty()
  createdAt: Date;
}
