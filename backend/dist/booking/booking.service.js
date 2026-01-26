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
exports.BookingService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let BookingService = class BookingService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(clientId, dto) {
        const service = await this.prisma.service.findUnique({
            where: { id: dto.serviceId },
            select: { providerId: true, isActive: true },
        });
        if (!service) {
            throw new common_1.NotFoundException('Service not found');
        }
        if (!service.isActive) {
            throw new common_1.BadRequestException('This service is not currently available');
        }
        const booking = await this.prisma.booking.create({
            data: {
                clientId,
                providerId: service.providerId,
                serviceId: dto.serviceId,
                description: dto.description,
                images: dto.images || [],
                preferredDate: dto.preferredDate ? new Date(dto.preferredDate) : null,
                address: dto.address,
                notes: dto.notes,
                conversation: {
                    create: {},
                },
            },
            include: {
                service: {
                    select: {
                        id: true,
                        title: true,
                        category: true,
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
                conversation: true,
            },
        });
        return booking;
    }
    async findByClient(clientId) {
        return this.prisma.booking.findMany({
            where: { clientId },
            orderBy: { createdAt: 'desc' },
            include: {
                service: {
                    select: {
                        id: true,
                        title: true,
                        category: true,
                        images: true,
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
        });
    }
    async findByProvider(providerId) {
        return this.prisma.booking.findMany({
            where: { providerId },
            orderBy: { createdAt: 'desc' },
            include: {
                service: {
                    select: {
                        id: true,
                        title: true,
                        category: true,
                    },
                },
                client: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        avatarUrl: true,
                        phone: true,
                    },
                },
            },
        });
    }
    async findOne(id, userId) {
        const booking = await this.prisma.booking.findUnique({
            where: { id },
            include: {
                service: true,
                client: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        avatarUrl: true,
                        phone: true,
                        email: true,
                    },
                },
                provider: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        avatarUrl: true,
                        phone: true,
                        email: true,
                    },
                },
                conversation: true,
                review: true,
            },
        });
        if (!booking) {
            throw new common_1.NotFoundException('Booking not found');
        }
        if (booking.clientId !== userId && booking.providerId !== userId) {
            throw new common_1.ForbiddenException('You do not have access to this booking');
        }
        return booking;
    }
    async updateStatus(id, userId, userRole, dto) {
        const booking = await this.prisma.booking.findUnique({
            where: { id },
        });
        if (!booking) {
            throw new common_1.NotFoundException('Booking not found');
        }
        this.validateStatusTransition(booking, userId, userRole, dto.status);
        const updateData = {
            status: dto.status,
        };
        if (dto.status === 'ACCEPTED') {
            updateData.acceptedAt = new Date();
            if (dto.quotedPrice) {
                updateData.quotedPrice = dto.quotedPrice;
            }
        }
        else if (dto.status === 'COMPLETED') {
            updateData.completedAt = new Date();
            if (dto.quotedPrice) {
                updateData.finalPrice = dto.quotedPrice;
            }
        }
        return this.prisma.booking.update({
            where: { id },
            data: updateData,
            include: {
                service: {
                    select: {
                        id: true,
                        title: true,
                    },
                },
                client: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                    },
                },
                provider: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        });
    }
    validateStatusTransition(booking, userId, userRole, newStatus) {
        const { status: currentStatus, clientId, providerId } = booking;
        if (userId === clientId) {
            if (newStatus !== 'CANCELLED') {
                throw new common_1.ForbiddenException('Clients can only cancel bookings');
            }
            if (!['PENDING', 'ACCEPTED'].includes(currentStatus)) {
                throw new common_1.BadRequestException('Cannot cancel booking in current status');
            }
            return;
        }
        if (userId === providerId) {
            const validTransitions = {
                PENDING: ['ACCEPTED', 'REJECTED'],
                ACCEPTED: ['IN_PROGRESS', 'CANCELLED'],
                IN_PROGRESS: ['COMPLETED'],
            };
            const allowed = validTransitions[currentStatus] || [];
            if (!allowed.includes(newStatus)) {
                throw new common_1.BadRequestException(`Cannot transition from ${currentStatus} to ${newStatus}`);
            }
            return;
        }
        throw new common_1.ForbiddenException('You cannot modify this booking');
    }
};
exports.BookingService = BookingService;
exports.BookingService = BookingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BookingService);
//# sourceMappingURL=booking.service.js.map