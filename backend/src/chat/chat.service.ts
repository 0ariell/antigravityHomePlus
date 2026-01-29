import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SendMessageDto } from './dto';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  async getConversation(conversationId: string, userId: string) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        booking: {
          select: {
            id: true,
            clientId: true,
            providerId: true,
            status: true,
            service: {
              select: {
                title: true,
              },
            },
            client: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatarUrl: true,
              },
            },
            provider: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatarUrl: true,
              },
            },
          },
        },
        messages: {
          orderBy: { createdAt: 'asc' },
          include: {
            sender: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    // Check access
    const { clientId, providerId } = conversation.booking;
    if (userId !== clientId && userId !== providerId) {
      throw new ForbiddenException('You do not have access to this conversation');
    }

    return conversation;
  }

  async getConversationByBooking(bookingId: string, userId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        conversation: {
          include: {
            messages: {
              orderBy: { createdAt: 'asc' },
              include: {
                sender: {
                  select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    avatarUrl: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (userId !== booking.clientId && userId !== booking.providerId) {
      throw new ForbiddenException('You do not have access to this conversation');
    }

    return booking.conversation;
  }

  async sendMessage(senderId: string, dto: SendMessageDto) {
    // Verify sender has access to conversation
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: dto.conversationId },
      include: {
        booking: {
          select: {
            clientId: true,
            providerId: true,
          },
        },
      },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    const { clientId, providerId } = conversation.booking;
    if (senderId !== clientId && senderId !== providerId) {
      throw new ForbiddenException('You cannot send messages in this conversation');
    }

    const message = await this.prisma.message.create({
      data: {
        conversationId: dto.conversationId,
        senderId,
        content: dto.content,
        attachments: dto.attachments || [],
      },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
      },
    });

    // Update conversation timestamp
    await this.prisma.conversation.update({
      where: { id: dto.conversationId },
      data: { updatedAt: new Date() },
    });

    return message;
  }

  async markAsRead(messageId: string, userId: string) {
    const message = await this.prisma.message.findUnique({
      where: { id: messageId },
      include: {
        conversation: {
          include: {
            booking: {
              select: {
                clientId: true,
                providerId: true,
              },
            },
          },
        },
      },
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    const { clientId, providerId } = message.conversation.booking;
    if (userId !== clientId && userId !== providerId) {
      throw new ForbiddenException('You cannot access this message');
    }

    // Only mark as read if not the sender
    if (message.senderId !== userId && !message.readAt) {
      return this.prisma.message.update({
        where: { id: messageId },
        data: { readAt: new Date() },
      });
    }

    return message;
  }

  async markConversationAsRead(conversationId: string, userId: string) {
      const conversation = await this.prisma.conversation.findUnique({
          where: { id: conversationId },
          include: {
              booking: {
                  select: { clientId: true, providerId: true }
              }
          }
      });

      if (!conversation) throw new NotFoundException('Conversation not found');

      const { clientId, providerId } = conversation.booking;
      if (userId !== clientId && userId !== providerId) {
          throw new ForbiddenException('Access denied');
      }

      // Mark all messages sent by the OTHER person as read
      await this.prisma.message.updateMany({
          where: {
              conversationId,
              senderId: { not: userId }, // Sent by other
              readAt: null
          },
          data: {
              readAt: new Date()
          }
      });

      return { success: true, conversationId, readBy: userId };
  }

  async getUserConversations(userId: string) {
    const bookings = await this.prisma.booking.findMany({
      where: {
        OR: [{ clientId: userId }, { providerId: userId }],
        conversation: { isNot: null },
      },
      orderBy: { updatedAt: 'desc' },
      include: {
        service: {
          select: {
            title: true,
          },
        },
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
        provider: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
        conversation: {
          include: {
            messages: {
              orderBy: { createdAt: 'desc' },
              take: 1,
              select: {
                content: true,
                createdAt: true,
                senderId: true,
                readAt: true,
              },
            },
          },
        },
      },
    });

    return bookings
      .filter((booking) => booking.conversation !== null)
      .map((booking) => ({
        id: booking.conversation!.id,
        bookingId: booking.id,
        booking: {
          id: booking.id,
          service: {
            title: booking.service?.title || 'Servicio Personalizado',
          },
          client: booking.client,
          provider: booking.provider,
        },
        lastMessage: booking.conversation!.messages[0] || null,
        updatedAt: booking.conversation!.updatedAt,
      }));
  }
}
