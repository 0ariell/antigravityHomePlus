import { NotificationService } from './notification.service';
export declare class NotificationController {
    private readonly notificationService;
    constructor(notificationService: NotificationService);
    findAll(userId: string, unread?: string): Promise<{
        message: string;
        id: string;
        createdAt: Date;
        data: import("@prisma/client/runtime/library").JsonValue | null;
        title: string;
        readAt: Date | null;
        type: import("@prisma/client").$Enums.NotificationType;
        userId: string;
    }[]>;
    getUnreadCount(userId: string): Promise<{
        count: number;
    }>;
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
}
