import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto';

@Injectable()
export class ReviewService {
  constructor(private readonly prisma: PrismaService) {}

  async create(authorId: string, dto: CreateReviewDto) {
    // Get booking and verify
    const booking = await this.prisma.booking.findUnique({
      where: { id: dto.bookingId },
      include: { review: true },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // Only client can review
    if (booking.clientId !== authorId) {
      throw new ForbiddenException('Only the client can leave a review');
    }

    // Only completed bookings can be reviewed
    if (booking.status !== 'COMPLETED') {
      throw new BadRequestException('Can only review completed bookings');
    }

    // Check if already reviewed
    if (booking.review) {
      throw new BadRequestException('This booking has already been reviewed');
    }

    // Create review
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

    // Update provider's average rating
    await this.updateProviderRating(booking.providerId);

    // Update service's average rating
    await this.updateServiceRating(booking.serviceId);

    return review;
  }

  async findByProvider(providerId: string) {
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

  async findByService(serviceId: string) {
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

  private async updateProviderRating(providerId: string) {
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

  private async updateServiceRating(serviceId: string) {
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
}
