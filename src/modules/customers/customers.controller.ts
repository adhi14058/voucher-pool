import { Body, Controller, Get, Post, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { CustomerResponseDto } from './dto/customer-response.dto';
import { TransformInterceptor } from '../../core/interceptors/transform.interceptor';
import { AppLogger } from '../../core/logging/app-logger';

@Controller()
@ApiTags('Customers')
export class CustomersController {
  private readonly logger = new AppLogger(CustomersController.name);
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  @UseInterceptors(new TransformInterceptor(CustomerResponseDto))
  @ApiOperation({ summary: 'Create a new customer' })
  @ApiResponse({ status: 201, type: CustomerResponseDto })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  async create(@Body() dto: CreateCustomerDto): Promise<CustomerResponseDto> {
    const customer = await this.customersService.create(dto);
    this.logger.log(`Customer created: ${customer.id}`);
    return customer;
  }

  @Get()
  @UseInterceptors(new TransformInterceptor(CustomerResponseDto))
  @ApiOperation({ summary: 'List all customers' })
  @ApiResponse({ status: 200, type: [CustomerResponseDto] })
  findAll(): Promise<CustomerResponseDto[]> {
    return this.customersService.findAll();
  }
}
