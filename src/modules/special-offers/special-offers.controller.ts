import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SpecialOffersService } from './special-offers.service';
import { CreateSpecialOfferDto } from './dto/create-special-offer.dto';
import { SpecialOfferResponseDto } from './dto/special-offer-response.dto';
import { AppLogger } from '../../core/logging/app-logger';

@Controller('')
@ApiTags('Special Offers')
export class SpecialOffersController {
  private readonly logger = new AppLogger(SpecialOffersController.name);
  constructor(private readonly specialOffersService: SpecialOffersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new special offer' })
  @ApiResponse({ status: 201, type: SpecialOfferResponseDto })
  create(@Body() dto: CreateSpecialOfferDto): Promise<SpecialOfferResponseDto> {
    return this.specialOffersService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all special offers' })
  @ApiResponse({ status: 200, type: [SpecialOfferResponseDto] })
  findAll(): Promise<SpecialOfferResponseDto[]> {
    this.logger.log('findAll special offers');
    return this.specialOffersService.findAll();
  }
}
