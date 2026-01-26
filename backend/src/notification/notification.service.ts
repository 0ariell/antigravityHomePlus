import { Injectable } from '@nestjs/common';
import { NotificationType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationGateway } from './notification.gateway';

@Injectable()
export class NotificationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationGateway: NotificationGateway,
  ) {}

  async create(
    userId: string,
    type: NotificationType,
    title: string,
    message: string,
    data?: Record<string, any>,
  ) {
    const notification = await this.prisma.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        data: data ? data : undefined,
      },
    });

    // Send real-time notification
    this.notificationGateway.sendToUser(userId, 'notification', notification);

    return notification;
  }

  async findByUser(userId: string, onlyUnread = false) {
    return this.prisma.notification.findMany({
      where: {
        userId,
        ...(onlyUnread && { readAt: null }),
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async markAsRead(id: string, userId: string) {
    const notification = await this.prisma.notification.findFirst({
      where: { id, userId },
    });

    if (!notification) {
      return null;
    }

    return this.prisma.notification.update({
      where: { id },
      data: { readAt: new Date() },
    });
  }

  async markAllAsRead(userId: string) {
    await this.prisma.notification.updateMany({
      where: { userId, readAt: null },
      data: { readAt: new Date() },
    });

    return { message: 'All notifications marked as read' };
  }

  async getUnreadCount(userId: string) {
    const count = await this.prisma.notification.count({
      where: { userId, readAt: null },
    });

    return { count };
  }

  // Helper methods for common notifications
  async notifyBookingAccepted(booking: {
    id: string;
    clientId: string;
    service: { title: string };
    provider: { firstName: string; lastName: string };
  }) {
    return this.create(
      booking.clientId,
      'BOOKING_ACCEPTED',
      'Reserva aceptada',
      `${booking.provider.firstName} ${booking.provider.lastName} ha aceptado tu solicitud para "${booking.service.title}"`,
      { bookingId: booking.id },
    );
  }

  async notifyNewMessage(
    recipientId: string,
    senderName: string,
    conversationId: string,
    bookingId: string,
  ) {
    return this.create(
      recipientId,
      'NEW_MESSAGE',
      'Nuevo mensaje',
      `${senderName} te ha enviado un mensaje`,
      { conversationId, bookingId },
    );
  }

  async notifyBookingCompleted(booking: {
    id: string;
    clientId: string;
    service: { title: string };
  }) {
    return this.create(
      booking.clientId,
      'BOOKING_COMPLETED',
      'Trabajo completado',
      `El trabajo "${booking.service.title}" ha sido marcado como completado. ¡Deja una reseña!`,
      { bookingId: booking.id },
    );
  }
}
