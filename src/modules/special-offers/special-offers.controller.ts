import { Body, Controller, Get, Post, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SpecialOffersService } from './special-offers.service';
import { CreateSpecialOfferDto } from './dto/create-special-offer.dto';
import { SpecialOfferResponseDto } from './dto/special-offer-response.dto';
import { TransformInterceptor } from '../../core/interceptors/transform.interceptor';
import { AppLogger } from '../../core/logging/app-logger';

@Controller()
@ApiTags('Special Offers')
export class SpecialOffersController {
  private readonly logger = new AppLogger(SpecialOffersController.name);

  constructor(private readonly specialOffersService: SpecialOffersService) {}

  @Post()
  @UseInterceptors(new TransformInterceptor(SpecialOfferResponseDto))
  @ApiOperation({ summary: 'Create a new special offer' })
  @ApiResponse({ status: 201, type: SpecialOfferResponseDto })
  async create(
    @Body() dto: CreateSpecialOfferDto,
  ): Promise<SpecialOfferResponseDto> {
    const specialOffer = await this.specialOffersService.create(dto);
    this.logger.log(`Special offer created: ${specialOffer.id}`);
    return specialOffer;
  }

  @Get()
  @UseInterceptors(new TransformInterceptor(SpecialOfferResponseDto))
  @ApiOperation({ summary: 'List all special offers' })
  @ApiResponse({ status: 200, type: [SpecialOfferResponseDto] })
  findAll(): Promise<SpecialOfferResponseDto[]> {
    return this.specialOffersService.findAll();
  }
}
