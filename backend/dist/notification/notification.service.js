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
exports.NotificationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let NotificationService = class NotificationService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, type, title, message, data) {
        return this.prisma.notification.create({
            data: {
                userId,
                type,
                title,
                message,
                data: data ? data : undefined,
            },
        });
    }
    async findByUser(userId, onlyUnread = false) {
        return this.prisma.notification.findMany({
            where: {
                userId,
                ...(onlyUnread && { readAt: null }),
            },
            orderBy: { createdAt: 'desc' },
            take: 50,
        });
    }
    async markAsRead(id, userId) {
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
    async markAllAsRead(userId) {
        await this.prisma.notification.updateMany({
            where: { userId, readAt: null },
            data: { readAt: new Date() },
        });
        return { message: 'All notifications marked as read' };
    }
    async getUnreadCount(userId) {
        const count = await this.prisma.notification.count({
            where: { userId, readAt: null },
        });
        return { count };
    }
    async notifyBookingAccepted(booking) {
        return this.create(booking.clientId, 'BOOKING_ACCEPTED', 'Reserva aceptada', `${booking.provider.firstName} ${booking.provider.lastName} ha aceptado tu solicitud para "${booking.service.title}"`, { bookingId: booking.id });
    }
    async notifyNewMessage(recipientId, senderName, conversationId, bookingId) {
        return this.create(recipientId, 'NEW_MESSAGE', 'Nuevo mensaje', `${senderName} te ha enviado un mensaje`, { conversationId, bookingId });
    }
    async notifyBookingCompleted(booking) {
        return this.create(booking.clientId, 'BOOKING_COMPLETED', 'Trabajo completado', `El trabajo "${booking.service.title}" ha sido marcado como completado. ¡Deja una reseña!`, { bookingId: booking.id });
    }
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], NotificationService);
//# sourceMappingURL=notification.service.js.map