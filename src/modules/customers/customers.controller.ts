import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { CustomerResponseDto } from './dto/customer-response.dto';

@Controller('')
@ApiTags('Customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new customer' })
  @ApiResponse({ status: 201, type: CustomerResponseDto })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  create(@Body() dto: CreateCustomerDto): Promise<CustomerResponseDto> {
    return this.customersService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all customers' })
  @ApiResponse({ status: 200, type: [CustomerResponseDto] })
  findAll(): Promise<CustomerResponseDto[]> {
    return this.customersService.findAll();
  }
}
