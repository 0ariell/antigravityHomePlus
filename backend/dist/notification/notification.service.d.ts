import { NotificationType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
export declare class NotificationService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(userId: string, type: NotificationType, title: string, message: string, data?: Record<string, any>): Promise<{
        message: string;
        id: string;
        createdAt: Date;
        data: import("@prisma/client/runtime/library").JsonValue | null;
        title: string;
        readAt: Date | null;
        type: import("@prisma/client").$Enums.NotificationType;
        userId: string;
    }>;
    findByUser(userId: string, onlyUnread?: boolean): Promise<{
        message: string;
        id: string;
        createdAt: Date;
        data: import("@prisma/client/runtime/library").JsonValue | null;
        title: string;
        readAt: Date | null;
        type: import("@prisma/client").$Enums.NotificationType;
        userId: string;
    }[]>;
    markAsRead(id: string, userId: string): Promise<{
        message: string;
        id: string;
        createdAt: Date;
        data: import("@prisma/client/runtime/library").JsonValue | null;
        title: string;
        readAt: Date | null;
        type: import("@prisma/client").$Enums.NotificationType;
        userId: string;
    } | null>;
    markAllAsRead(userId: string): Promise<{
        message: string;
    }>;
    getUnreadCount(userId: string): Promise<{
        count: number;
    }>;
    notifyBookingAccepted(booking: {
        id: string;
        clientId: string;
        service: {
            title: string;
        };
        provider: {
            firstName: string;
            lastName: string;
        };
    }): Promise<{
        message: string;
        id: string;
        createdAt: Date;
        data: import("@prisma/client/runtime/library").JsonValue | null;
        title: string;
        readAt: Date | null;
        type: import("@prisma/client").$Enums.NotificationType;
        userId: string;
    }>;
    notifyNewMessage(recipientId: string, senderName: string, conversationId: string, bookingId: string): Promise<{
        message: string;
        id: string;
        createdAt: Date;
        data: import("@prisma/client/runtime/library").JsonValue | null;
        title: string;
        readAt: Date | null;
        type: import("@prisma/client").$Enums.NotificationType;
        userId: string;
    }>;
    notifyBookingCompleted(booking: {
        id: string;
        clientId: string;
        service: {
            title: string;
        };
    }): Promise<{
        message: string;
        id: string;
        createdAt: Date;
        data: import("@prisma/client/runtime/library").JsonValue | null;
        title: string;
        readAt: Date | null;
        type: import("@prisma/client").$Enums.NotificationType;
        userId: string;
    }>;
}
