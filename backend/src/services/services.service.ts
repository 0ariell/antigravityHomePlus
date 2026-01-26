import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceDto, UpdateServiceDto, ServiceQueryDto } from './dto';

@Injectable()
export class ServicesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(providerId: string, dto: CreateServiceDto) {
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

  async findAll(query: ServiceQueryDto) {
    const { category, zone, minRating, page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    const where = {
      isActive: true,
      ...(category && { category }),
      ...(zone && { zone: { contains: zone, mode: 'insensitive' as const } }),
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

  async findOne(id: string) {
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
      throw new NotFoundException('Service not found');
    }

    return service;
  }

  async findByProvider(providerId: string) {
    return this.prisma.service.findMany({
      where: { providerId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(id: string, providerId: string, dto: UpdateServiceDto) {
    const service = await this.prisma.service.findUnique({
      where: { id },
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    if (service.providerId !== providerId) {
      throw new ForbiddenException('You can only edit your own services');
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

  async delete(id: string, providerId: string) {
    const service = await this.prisma.service.findUnique({
      where: { id },
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    if (service.providerId !== providerId) {
      throw new ForbiddenException('You can only delete your own services');
    }

    await this.prisma.service.delete({ where: { id } });

    return { message: 'Service deleted successfully' };
  }

  async toggleActive(id: string, providerId: string) {
    const service = await this.prisma.service.findUnique({
      where: { id },
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    if (service.providerId !== providerId) {
      throw new ForbiddenException('You can only modify your own services');
    }

    return this.prisma.service.update({
      where: { id },
      data: { isActive: !service.isActive },
    });
  }
}
