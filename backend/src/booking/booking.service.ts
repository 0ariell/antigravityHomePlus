import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { BookingStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto, UpdateBookingStatusDto } from './dto';

@Injectable()
export class BookingService {
  constructor(private readonly prisma: PrismaService) {}

  async create(clientId: string, dto: CreateBookingDto) {
    // Get the service to find the provider
    const service = await this.prisma.service.findUnique({
      where: { id: dto.serviceId },
      select: { providerId: true, isActive: true },
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    if (!service.isActive) {
      throw new BadRequestException('This service is not currently available');
    }

    // Create booking and conversation together
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

  async findByClient(clientId: string) {
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
            bio: true,
            phone: true,
            trades: true,
            avgRating: true,
            totalReviews: true,
          },
        },
      },
    });
  }

  async findByProvider(providerId: string) {
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
            address: true,
          },
        },
      },
    });
  }

  async findOne(id: string, userId: string) {
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
      throw new NotFoundException('Booking not found');
    }

    // Only participants can view booking
    if (booking.clientId !== userId && booking.providerId !== userId) {
      throw new ForbiddenException('You do not have access to this booking');
    }

    return booking;
  }

  async updateStatus(id: string, userId: string, userRole: string, dto: UpdateBookingStatusDto) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // Validate permissions and status transitions
    this.validateStatusTransition(booking, userId, userRole, dto.status);

    const updateData: any = {
      status: dto.status,
    };

    // Add timestamps based on status
    if (dto.status === 'ACCEPTED') {
      updateData.acceptedAt = new Date();
      if (dto.quotedPrice) {
        updateData.quotedPrice = dto.quotedPrice;
      }
    } else if (dto.status === 'COMPLETED') {
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

  private validateStatusTransition(
    booking: { status: BookingStatus; clientId: string; providerId: string },
    userId: string,
    userRole: string,
    newStatus: string,
  ) {
    const { status: currentStatus, clientId, providerId } = booking;

    // Client can only cancel
    if (userId === clientId) {
      if (newStatus !== 'CANCELLED') {
        throw new ForbiddenException('Clients can only cancel bookings');
      }
      if (!['PENDING', 'ACCEPTED'].includes(currentStatus)) {
        throw new BadRequestException('Cannot cancel booking in current status');
      }
      return;
    }

    // Provider transitions
    if (userId === providerId) {
      const validTransitions: Record<string, string[]> = {
        PENDING: ['ACCEPTED', 'REJECTED'],
        ACCEPTED: ['IN_PROGRESS', 'CANCELLED'],
        IN_PROGRESS: ['COMPLETED'],
      };

      const allowed = validTransitions[currentStatus] || [];
      if (!allowed.includes(newStatus)) {
        throw new BadRequestException(
          `Cannot transition from ${currentStatus} to ${newStatus}`,
        );
      }
      return;
    }

    throw new ForbiddenException('You cannot modify this booking');
  }
}
