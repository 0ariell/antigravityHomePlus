import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { ServicesService } from './services.service';
import { CreateServiceDto, UpdateServiceDto, ServiceQueryDto } from './dto';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { Roles, CurrentUser } from '../auth/decorators';

@Controller('api/services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  // Public endpoints
  @Get()
  findAll(@Query() query: ServiceQueryDto) {
    return this.servicesService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.servicesService.findOne(id);
  }

  // Provider-only endpoints
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PROVIDER)
  create(@CurrentUser('id') providerId: string, @Body() dto: CreateServiceDto) {
    return this.servicesService.create(providerId, dto);
  }

  @Get('provider/my-services')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PROVIDER)
  findMyServices(@CurrentUser('id') providerId: string) {
    return this.servicesService.findByProvider(providerId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PROVIDER)
  update(
    @Param('id') id: string,
    @CurrentUser('id') providerId: string,
    @Body() dto: UpdateServiceDto,
  ) {
    return this.servicesService.update(id, providerId, dto);
  }

  @Patch(':id/toggle-active')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PROVIDER)
  toggleActive(@Param('id') id: string, @CurrentUser('id') providerId: string) {
    return this.servicesService.toggleActive(id, providerId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PROVIDER)
  delete(@Param('id') id: string, @CurrentUser('id') providerId: string) {
    return this.servicesService.delete(id, providerId);
  }
}
