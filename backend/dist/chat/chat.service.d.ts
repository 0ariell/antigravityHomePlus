import { PrismaService } from '../prisma/prisma.service';
import { SendMessageDto } from './dto';
export declare class ChatService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getConversation(conversationId: string, userId: string): Promise<{
        booking: {
            service: {
                title: string;
            };
            providerId: string;
            status: import("@prisma/client").$Enums.BookingStatus;
            clientId: string;
        };
        messages: ({
            sender: {
                firstName: string | null;
                lastName: string | null;
                id: string;
                avatarUrl: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            conversationId: string;
            content: string;
            attachments: string[];
            senderId: string;
            readAt: Date | null;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        bookingId: string;
    }>;
    getConversationByBooking(bookingId: string, userId: string): Promise<({
        messages: ({
            sender: {
                firstName: string | null;
                lastName: string | null;
                id: string;
                avatarUrl: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            conversationId: string;
            content: string;
            attachments: string[];
            senderId: string;
            readAt: Date | null;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        bookingId: string;
    }) | null>;
    sendMessage(senderId: string, dto: SendMessageDto): Promise<{
        sender: {
            firstName: string | null;
            lastName: string | null;
            id: string;
            avatarUrl: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        conversationId: string;
        content: string;
        attachments: string[];
        senderId: string;
        readAt: Date | null;
    }>;
    markAsRead(messageId: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        conversationId: string;
        content: string;
        attachments: string[];
        senderId: string;
        readAt: Date | null;
    }>;
    getUserConversations(userId: string): Promise<{
        id: string | undefined;
        bookingId: string;
        serviceTitle: string;
        status: import("@prisma/client").$Enums.BookingStatus;
        otherUser: {
            firstName: string | null;
            lastName: string | null;
            id: string;
            avatarUrl: string | null;
        };
        lastMessage: {
            createdAt: Date;
            content: string;
            senderId: string;
            readAt: Date | null;
        } | null;
    }[]>;
}
