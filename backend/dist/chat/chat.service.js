"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ChatService = class ChatService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getConversation(conversationId, userId) {
        const conversation = await this.prisma.conversation.findUnique({
            where: { id: conversationId },
            include: {
                booking: {
                    select: {
                        clientId: true,
                        providerId: true,
                        status: true,
                        service: {
                            select: {
                                title: true,
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
            throw new common_1.NotFoundException('Conversation not found');
        }
        const { clientId, providerId } = conversation.booking;
        if (userId !== clientId && userId !== providerId) {
            throw new common_1.ForbiddenException('You do not have access to this conversation');
        }
        return conversation;
    }
    async getConversationByBooking(bookingId, userId) {
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
            throw new common_1.NotFoundException('Booking not found');
        }
        if (userId !== booking.clientId && userId !== booking.providerId) {
            throw new common_1.ForbiddenException('You do not have access to this conversation');
        }
        return booking.conversation;
    }
    async sendMessage(senderId, dto) {
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
            throw new common_1.NotFoundException('Conversation not found');
        }
        const { clientId, providerId } = conversation.booking;
        if (senderId !== clientId && senderId !== providerId) {
            throw new common_1.ForbiddenException('You cannot send messages in this conversation');
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
        await this.prisma.conversation.update({
            where: { id: dto.conversationId },
            data: { updatedAt: new Date() },
        });
        return message;
    }
    async markAsRead(messageId, userId) {
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
            throw new common_1.NotFoundException('Message not found');
        }
        const { clientId, providerId } = message.conversation.booking;
        if (userId !== clientId && userId !== providerId) {
            throw new common_1.ForbiddenException('You cannot access this message');
        }
        if (message.senderId !== userId && !message.readAt) {
            return this.prisma.message.update({
                where: { id: messageId },
                data: { readAt: new Date() },
            });
        }
        return message;
    }
    async getUserConversations(userId) {
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
        return bookings.map((booking) => ({
            id: booking.conversation?.id,
            bookingId: booking.id,
            serviceTitle: booking.service.title,
            status: booking.status,
            otherUser: userId === booking.clientId ? booking.provider : booking.client,
            lastMessage: booking.conversation?.messages[0] || null,
        }));
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ChatService);
//# sourceMappingURL=chat.service.js.map