import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationService } from '../notification/notification.service';
import { CreateServiceRequestDto } from './dto/create-service-request.dto';
import { RequestStatus, NotificationType } from '@prisma/client';

@Injectable()
export class ServiceRequestService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
  ) {}

  async create(clientId: string, dto: CreateServiceRequestDto) {
    // 1. Create the request
    const request = await this.prisma.serviceRequest.create({
      data: {
        clientId,
        category: dto.category,
        title: dto.title,
        description: dto.description,
        zone: dto.zone,
        latitude: dto.latitude,
        longitude: dto.longitude,
        images: dto.images || [],
        preferredDate: dto.preferredDate ? new Date(dto.preferredDate) : null,
        status: RequestStatus.OPEN,
      },
      include: {
        client: {
          select: { firstName: true, lastName: true, avatarUrl: true },
        },
      },
    });

    // 2. Find online providers in the zone with matching active service category
    // We look for providers who have an active service in this category and zone
    // AND are currently toggled 'isOnline'
    const providers = await this.prisma.user.findMany({
      where: {
        role: 'PROVIDER',
        isOnline: true,
        services: {
          some: {
            category: dto.category,
            // Assuming providers can serve multiple zones or we match exact zone string for MVP
            // Ideally zone matching would be geospatial or list-based
            zone: { contains: dto.zone, mode: 'insensitive' }, 
            isActive: true,
          },
        },
      },
    });

    // 3. Notify them
    for (const provider of providers) {
      await this.notificationService.create(
        provider.id,
        NotificationType.BOOKING_CREATED, // Should likely be a new type e.g. NEW_OPPORTUNITY, but reusing for MVP
        '¡Nueva Oportunidad!',
        `${request.client.firstName} busca ${dto.category} en ${dto.zone}`,
        { requestId: request.id },
      );
    }

    return { request, matchedProviders: providers.length };
  }

  async findAllOpen(providerId: string) {
    // Get provider's services to know what they are interested in
    const provider = await this.prisma.user.findUnique({
      where: { id: providerId },
      include: { services: true },
    });

    if (!provider) return [];

    const myCategories = provider.services
      .filter((s) => s.isActive)
      .map((s) => s.category);

    const myZones = provider.services
        .filter(s=>s.isActive)
        .map(s=>s.zone); // Naive matching

    // DEBUG: Log filtering info
    console.log('DEBUG findAllOpen:', {
      providerId,
      allServices: provider.services.length,
      activeServices: provider.services.filter(s => s.isActive).length,
      myCategories,
      myZones,
    });

    // Find OPEN requests in those categories
    // For MVP, we'll just match categories. Zone matching can be strict or loose.
    const requests = await this.prisma.serviceRequest.findMany({
      where: {
        status: RequestStatus.OPEN,
        category: { in: myCategories },
        // zone: { in: myZones }, // Optional strict zone matching
      },
      orderBy: { createdAt: 'desc' },
      include: {
        client: {
          select: { firstName: true, lastName: true, avatarUrl: true, address: true },
        },
        _count: {
          select: { quotes: true },
        },
        quotes: {
            where: { providerId }, // Check if I already quoted
            select: { id: true }
        }
      },
    });

    console.log('DEBUG findAllOpen results:', requests.length, 'requests found');
    return requests;
  }

  async findMyRequests(clientId: string) {
    return this.prisma.serviceRequest.findMany({
      where: { clientId },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { quotes: true } },
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.serviceRequest.findUnique({
        where: { id },
        include: {
            client: {
                select: { id: true, firstName: true, lastName: true, avatarUrl: true }
            },
            quotes: {
                include: {
                    provider: {
                        select: { id: true, firstName: true, lastName: true, avatarUrl: true, avgRating: true }
                    }
                }
            }
        }
    })
  }

  async findAllOpenGlobal() {
    return this.prisma.serviceRequest.findMany({
      where: {
        status: RequestStatus.OPEN,
      },
      orderBy: { createdAt: 'desc' },
      include: {
        client: {
          select: { firstName: true, lastName: true, avatarUrl: true, address: true },
        },
        _count: {
          select: { quotes: true },
        },
      },
    });
  }
}
