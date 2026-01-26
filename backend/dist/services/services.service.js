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
exports.ServicesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ServicesService = class ServicesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(providerId, dto) {
        return this.prisma.service.create({
            data: {
                ...dto,
                providerId,
            },
            include: {
                provider: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        avatarUrl: true,
                        avgRating: true,
                    },
                },
            },
        });
    }
    async findAll(query) {
        const { category, zone, minRating, page = 1, limit = 20 } = query;
        const skip = (page - 1) * limit;
        const where = {
            isActive: true,
            ...(category && { category }),
            ...(zone && { zone: { contains: zone, mode: 'insensitive' } }),
            ...(minRating && { avgRating: { gte: minRating } }),
        };
        const [services, total] = await Promise.all([
            this.prisma.service.findMany({
                where,
                skip,
                take: limit,
                orderBy: [
                    { avgRating: 'desc' },
                    { totalReviews: 'desc' },
                    { createdAt: 'desc' },
                ],
                include: {
                    provider: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            avatarUrl: true,
                            avgRating: true,
                            totalReviews: true,
                        },
                    },
                },
            }),
            this.prisma.service.count({ where }),
        ]);
        return {
            data: services,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(id) {
        const service = await this.prisma.service.findUnique({
            where: { id },
            include: {
                provider: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        phone: true,
                        avatarUrl: true,
                        bio: true,
                        avgRating: true,
                        totalReviews: true,
                        trades: true,
                        zone: true,
                    },
                },
            },
        });
        if (!service) {
            throw new common_1.NotFoundException('Service not found');
        }
        return service;
    }
    async findByProvider(providerId) {
        return this.prisma.service.findMany({
            where: { providerId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async update(id, providerId, dto) {
        const service = await this.prisma.service.findUnique({
            where: { id },
        });
        if (!service) {
            throw new common_1.NotFoundException('Service not found');
        }
        if (service.providerId !== providerId) {
            throw new common_1.ForbiddenException('You can only edit your own services');
        }
        return this.prisma.service.update({
            where: { id },
            data: dto,
            include: {
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
    async delete(id, providerId) {
        const service = await this.prisma.service.findUnique({
            where: { id },
        });
        if (!service) {
            throw new common_1.NotFoundException('Service not found');
        }
        if (service.providerId !== providerId) {
            throw new common_1.ForbiddenException('You can only delete your own services');
        }
        await this.prisma.service.delete({ where: { id } });
        return { message: 'Service deleted successfully' };
    }
    async toggleActive(id, providerId) {
        const service = await this.prisma.service.findUnique({
            where: { id },
        });
        if (!service) {
            throw new common_1.NotFoundException('Service not found');
        }
        if (service.providerId !== providerId) {
            throw new common_1.ForbiddenException('You can only modify your own services');
        }
        return this.prisma.service.update({
            where: { id },
            data: { isActive: !service.isActive },
        });
    }
};
exports.ServicesService = ServicesService;
exports.ServicesService = ServicesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ServicesService);
//# sourceMappingURL=services.service.js.map