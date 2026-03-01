import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { VouchersService } from './vouchers.service';
import { GenerateVoucherDto } from './dto/generate-voucher.dto';
import { RedeemVoucherDto } from './dto/redeem-voucher.dto';
import { FindVouchersByEmailQuery } from './dto/find-vouchers-query.dto';
import {
  RedeemVoucherResponseDto,
  ValidVoucherResponseDto,
  VoucherResponseDto,
} from './dto/voucher-response.dto';
import { TransformInterceptor } from '../../core/interceptors/transform.interceptor';
import { AppLogger } from '../../core/logging/app-logger';

@Controller()
@ApiTags('Vouchers')
export class VouchersController {
  private readonly logger = new AppLogger(VouchersController.name);
  constructor(private readonly vouchersService: VouchersService) {}

  @Post('generate')
  @UseInterceptors(new TransformInterceptor(VoucherResponseDto))
  @ApiOperation({
    summary:
      'Generate voucher codes for all customers for a given special offer',
  })
  @ApiResponse({ status: 201, type: [VoucherResponseDto] })
  @ApiResponse({ status: 404, description: 'Special offer not found' })
  async generate(
    @Body() dto: GenerateVoucherDto,
  ): Promise<VoucherResponseDto[]> {
    const vouchers = await this.vouchersService.generate(dto);
    this.logger.log(`Vouchers generated: ${vouchers.length}`);
    return vouchers;
  }

  @Post('redeem')
  @UseInterceptors(new TransformInterceptor(RedeemVoucherResponseDto))
  @ApiOperation({ summary: 'Redeem a voucher code' })
  @ApiResponse({ status: 200, type: RedeemVoucherResponseDto })
  @ApiResponse({
    status: 400,
    description: 'Voucher already used, expired, or email mismatch',
  })
  @ApiResponse({ status: 404, description: 'Voucher code not found' })
  async redeem(
    @Body() dto: RedeemVoucherDto,
  ): Promise<RedeemVoucherResponseDto> {
    const redeemVoucherResponse = await this.vouchersService.redeem(dto);
    this.logger.log(`Voucher redeemed: ${dto.code} for email ${dto.email}`);
    return redeemVoucherResponse;
  }

  @Get()
  @UseInterceptors(new TransformInterceptor(ValidVoucherResponseDto))
  @ApiOperation({
    summary: 'Get all valid voucher codes for a given email',
  })
  @ApiResponse({ status: 200, type: [ValidVoucherResponseDto] })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  findValidByEmail(
    @Query() query: FindVouchersByEmailQuery,
  ): Promise<ValidVoucherResponseDto[]> {
    return this.vouchersService.findValidByEmail(query.email);
  }
}
