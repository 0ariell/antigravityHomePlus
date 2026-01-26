import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { Roles, CurrentUser } from '../auth/decorators';

@Controller('api/reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CLIENT)
  create(@CurrentUser('id') authorId: string, @Body() dto: CreateReviewDto) {
    return this.reviewService.create(authorId, dto);
  }

  @Get('provider/:providerId')
  findByProvider(@Param('providerId') providerId: string) {
    return this.reviewService.findByProvider(providerId);
  }

  @Get('service/:serviceId')
  findByService(@Param('serviceId') serviceId: string) {
    return this.reviewService.findByService(serviceId);
  }
}
