import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { VouchersService } from './vouchers.service';
import { GenerateVoucherDto } from './dto/generate-voucher.dto';
import { RedeemVoucherDto } from './dto/redeem-voucher.dto';
import {
  RedeemVoucherResponseDto,
  ValidVoucherResponseDto,
  VoucherResponseDto,
} from './dto/voucher-response.dto';

@Controller('')
@ApiTags('Vouchers')
export class VouchersController {
  constructor(private readonly vouchersService: VouchersService) {}

  @Post('generate')
  @ApiOperation({
    summary:
      'Generate voucher codes for all customers for a given special offer',
  })
  @ApiResponse({ status: 201, type: [VoucherResponseDto] })
  @ApiResponse({ status: 404, description: 'Special offer not found' })
  generate(@Body() dto: GenerateVoucherDto): Promise<VoucherResponseDto[]> {
    return this.vouchersService.generate(dto);
  }

  @Post('redeem')
  @ApiOperation({ summary: 'Redeem a voucher code' })
  @ApiResponse({ status: 200, type: RedeemVoucherResponseDto })
  @ApiResponse({
    status: 400,
    description: 'Voucher already used, expired, or email mismatch',
  })
  @ApiResponse({ status: 404, description: 'Voucher code not found' })
  redeem(@Body() dto: RedeemVoucherDto): Promise<RedeemVoucherResponseDto> {
    return this.vouchersService.redeem(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all valid voucher codes for a given email',
  })
  @ApiQuery({ name: 'email', required: true, type: String })
  @ApiResponse({ status: 200, type: [ValidVoucherResponseDto] })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  findValidByEmail(
    @Query('email') email: string,
  ): Promise<ValidVoucherResponseDto[]> {
    return this.vouchersService.findValidByEmail(email);
  }
}
