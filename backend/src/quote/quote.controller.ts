import { Controller, Post, Body, UseGuards, Patch, Param, Get } from '@nestjs/common';
import { QuoteService } from './quote.service';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { Roles, CurrentUser } from '../auth/decorators';
import { UserRole } from '@prisma/client';

@Controller('api/quotes')
@UseGuards(JwtAuthGuard)
export class QuoteController {
  constructor(private readonly quoteService: QuoteService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.PROVIDER)
  create(@CurrentUser('id') providerId: string, @Body() dto: CreateQuoteDto) {
    return this.quoteService.create(providerId, dto);
  }

  @Patch(':id/accept')
  @UseGuards(RolesGuard)
  @Roles(UserRole.CLIENT)
  accept(@Param('id') id: string, @CurrentUser('id') clientId: string) {
      return this.quoteService.accept(id, clientId);
  }

  @Get('request/:requestId')
  findByRequest(@Param('requestId') requestId: string, @CurrentUser('id') userId: string) {
      // TODO: Add permission check if user is client or provider of quote
      return this.quoteService.findByRequest(requestId, userId);
  }
}
