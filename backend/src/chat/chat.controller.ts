import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../auth/guards';
import { CurrentUser } from '../auth/decorators';

@Controller('api/chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('conversations')
  getMyConversations(@CurrentUser('id') userId: string) {
    return this.chatService.getUserConversations(userId);
  }

  @Get('conversations/:id')
  getConversation(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.chatService.getConversation(id, userId);
  }

  @Get('booking/:bookingId')
  getByBooking(@Param('bookingId') bookingId: string, @CurrentUser('id') userId: string) {
    return this.chatService.getConversationByBooking(bookingId, userId);
  }
}
