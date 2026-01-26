import { ChatService } from './chat.service';
export declare class ChatController {
    private readonly chatService;
    constructor(chatService: ChatService);
    getMyConversations(userId: string): Promise<{
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
    getConversation(id: string, userId: string): Promise<{
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
    getByBooking(bookingId: string, userId: string): Promise<({
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
}
