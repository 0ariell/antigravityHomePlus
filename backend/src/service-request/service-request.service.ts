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
        targetProviderId: dto.targetProviderId, // Direct Request
        status: RequestStatus.OPEN,
      },
      include: {
        client: {
          select: { firstName: true, lastName: true, avatarUrl: true },
        },
      },
    });

    // 2. Notification Logic
    if (dto.targetProviderId) {
       // A. Direct Request -> Notify only the target provider
       await this.notificationService.create(
         dto.targetProviderId,
         NotificationType.BOOKING_CREATED,
         '¡Solicitud Directa Recibida!',
         `${request.client.firstName} te ha enviado una solicitud directa para ${dto.category}.`,
         { requestId: request.id }
       );
    } else {
       // B. General Request -> Notify matching online providers in zone
        const providers = await this.prisma.user.findMany({
          where: {
            role: 'PROVIDER',
            isOnline: true,
            services: {
              some: {
                category: dto.category,
                zone: { contains: dto.zone, mode: 'insensitive' }, 
                isActive: true,
              },
            },
          },
        });

        for (const provider of providers) {
          await this.notificationService.create(
            provider.id,
            NotificationType.BOOKING_CREATED, 
            '¡Nueva Oportunidad!',
            `${request.client.firstName} busca ${dto.category} en ${dto.zone}`,
            { requestId: request.id },
          );
        }
    }

    return request;
  }

  // General Opportunities (No target provider)
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

    // Find OPEN requests in those categories where targetProviderId IS NULL
    const requests = await this.prisma.serviceRequest.findMany({
      where: {
        status: RequestStatus.OPEN,
        category: { in: myCategories },
        targetProviderId: null, // IMPORTANT: Exclude direct requests
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
      take: 50, // Limit for safety
    });

    return requests;
  }

  // Direct Requests (Targeted to me)
  async findDirect(providerId: string) {
    return this.prisma.serviceRequest.findMany({
      where: {
        targetProviderId: providerId,
        status: RequestStatus.OPEN
      },
      orderBy: { createdAt: 'desc' },
      include: {
        client: {
          select: { firstName: true, lastName: true, avatarUrl: true, address: true },
        },
        quotes: {
            where: { providerId },
            select: { id: true, status: true }
        }
      }
    });
  }

  async findMyRequests(clientId: string) {
    return this.prisma.serviceRequest.findMany({
      where: { clientId },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { quotes: true } },
        targetProvider: { // Include target if exists
            select: { firstName: true, lastName: true, avatarUrl: true }
        }
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
