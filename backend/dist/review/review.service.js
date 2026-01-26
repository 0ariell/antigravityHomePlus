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
exports.ReviewService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ReviewService = class ReviewService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(authorId, dto) {
        const booking = await this.prisma.booking.findUnique({
            where: { id: dto.bookingId },
            include: { review: true },
        });
        if (!booking) {
            throw new common_1.NotFoundException('Booking not found');
        }
        if (booking.clientId !== authorId) {
            throw new common_1.ForbiddenException('Only the client can leave a review');
        }
        if (booking.status !== 'COMPLETED') {
            throw new common_1.BadRequestException('Can only review completed bookings');
        }
        if (booking.review) {
            throw new common_1.BadRequestException('This booking has already been reviewed');
        }
        const review = await this.prisma.review.create({
            data: {
                bookingId: dto.bookingId,
                authorId,
                providerId: booking.providerId,
                rating: dto.rating,
                comment: dto.comment,
            },
            include: {
                author: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        avatarUrl: true,
                    },
                },
            },
        });
        await this.updateProviderRating(booking.providerId);
        await this.updateServiceRating(booking.serviceId);
        return review;
    }
    async findByProvider(providerId) {
        return this.prisma.review.findMany({
            where: { providerId },
            orderBy: { createdAt: 'desc' },
            include: {
                author: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        avatarUrl: true,
                    },
                },
                booking: {
                    select: {
                        service: {
                            select: {
                                title: true,
                            },
                        },
                    },
                },
            },
        });
    }
    async findByService(serviceId) {
        return this.prisma.review.findMany({
            where: {
                booking: { serviceId },
            },
            orderBy: { createdAt: 'desc' },
            include: {
                author: {
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
    async updateProviderRating(providerId) {
        const stats = await this.prisma.review.aggregate({
            where: { providerId },
            _avg: { rating: true },
            _count: { rating: true },
        });
        await this.prisma.user.update({
            where: { id: providerId },
            data: {
                avgRating: stats._avg.rating || 0,
                totalReviews: stats._count.rating,
            },
        });
    }
    async updateServiceRating(serviceId) {
        const stats = await this.prisma.review.aggregate({
            where: {
                booking: { serviceId },
            },
            _avg: { rating: true },
            _count: { rating: true },
        });
        await this.prisma.service.update({
            where: { id: serviceId },
            data: {
                avgRating: stats._avg.rating || 0,
                totalReviews: stats._count.rating,
            },
        });
    }
};
exports.ReviewService = ReviewService;
exports.ReviewService = ReviewService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReviewService);
//# sourceMappingURL=review.service.js.map