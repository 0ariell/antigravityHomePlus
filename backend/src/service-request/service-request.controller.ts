import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ServiceRequestService } from './service-request.service';
import { CreateServiceRequestDto } from './dto/create-service-request.dto';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { Roles, CurrentUser } from '../auth/decorators';
import { UserRole } from '@prisma/client';

@Controller('api/service-requests')
@UseGuards(JwtAuthGuard)
export class ServiceRequestController {
  constructor(private readonly serviceRequestService: ServiceRequestService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.CLIENT)
  create(@CurrentUser('id') clientId: string, @Body() dto: CreateServiceRequestDto) {
    return this.serviceRequestService.create(clientId, dto);
  }

  @Get('nearby')
  @UseGuards(RolesGuard)
  @Roles(UserRole.PROVIDER)
  findAllOpen(@CurrentUser('id') providerId: string) {
    return this.serviceRequestService.findAllOpen(providerId);
  }

  @Get('direct')
  @UseGuards(RolesGuard)
  @Roles(UserRole.PROVIDER)
  findDirect(@CurrentUser('id') providerId: string) {
    return this.serviceRequestService.findDirect(providerId);
  }

  @Get('my-requests')
  @UseGuards(RolesGuard)
  @Roles(UserRole.CLIENT)
  findMyRequests(@CurrentUser('id') clientId: string) {
    return this.serviceRequestService.findMyRequests(clientId);
  }

  @Get('all-open')
  @UseGuards(RolesGuard)
  @Roles(UserRole.PROVIDER)
  findAllOpenGlobal() {
    return this.serviceRequestService.findAllOpenGlobal();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.serviceRequestService.findOne(id);
  }
}
