import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';

export class CreateSpecialOfferDto {
  @ApiProperty({ example: 'Summer Sale' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 20.0, description: 'Discount percentage (0-100)' })
  @IsNumber()
  @Min(0)
  @Max(100)
  discountPercentage: number;
}
