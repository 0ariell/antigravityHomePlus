import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationService } from '../notification/notification.service';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { QuoteStatus, RequestStatus, NotificationType, BookingStatus } from '@prisma/client';

@Injectable()
export class QuoteService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
  ) {}

  async create(providerId: string, dto: CreateQuoteDto) {
    // Validate request exists and is OPEN
    const request = await this.prisma.serviceRequest.findUnique({
      where: { id: dto.requestId },
    });

    if (!request) {
      throw new NotFoundException('Service Request not found');
    }
    if (request.status !== RequestStatus.OPEN) {
      throw new BadRequestException('This request is no longer open');
    }

    // Create quote
    const quote = await this.prisma.quote.create({
      data: {
        requestId: dto.requestId,
        providerId,
        price: dto.price,
        description: dto.description,
        estimatedDate: dto.estimatedDate ? new Date(dto.estimatedDate) : null,
        isAsap: dto.isAsap || false,
        status: QuoteStatus.PENDING,
      },
      include: {
        provider: { select: { firstName: true, lastName: true } },
      },
    });

    // Notify client
    await this.notificationService.create(
      request.clientId,
      NotificationType.NEW_MESSAGE, // Reusing NEW_MESSAGE or BOOKING_CREATED type
      'Nueva Cotización',
      `${quote.provider.firstName} ha enviado un presupuesto de $${dto.price}`,
      { quoteId: quote.id, requestId: dto.requestId },
    );

    return quote;
  }

  async accept(quoteId: string, clientId: string) {
    const quote = await this.prisma.quote.findUnique({
      where: { id: quoteId },
      include: {
        request: true,
        provider: true,
      },
    });

    if (!quote) throw new NotFoundException('Quote not found');
    
    // Validate ownership
    if (quote.request.clientId !== clientId) {
      throw new BadRequestException('Not authorized to accept this quote');
    }

    if (quote.status !== QuoteStatus.PENDING) {
      throw new BadRequestException('Quote is not pending');
    }

    // Transaction to update Statuses and Create Booking
    const result = await this.prisma.$transaction(async (tx) => {
        // 1. Update Quote to ACCEPTED
        await tx.quote.update({
            where: { id: quoteId },
            data: { status: QuoteStatus.ACCEPTED }
        });

        // 2. Reject other quotes for this request? Or keep them pending?
        // Usually we reject others or at least Close the Request.
        await tx.serviceRequest.update({
            where: { id: quote.requestId },
            data: { status: RequestStatus.CLOSED }
        });

        // 3. Create Booking
        const booking = await tx.booking.create({
            data: {
                clientId: quote.request.clientId,
                providerId: quote.providerId,
                status: BookingStatus.ACCEPTED, // Already accepted via quote
                description: quote.request.description,
                address: quote.request.zone, // We stored zone as address in request? Or should map Request.zone -> Booking.address
                images: quote.request.images,
                preferredDate: quote.estimatedDate || quote.request.preferredDate, // Take provider's estimate if available
                quotedPrice: quote.price,
                acceptedAt: new Date(),
                conversation: { create: {} }
            }
        });

        return booking;
    });

    // Notify Provider
    await this.notificationService.create(
        quote.providerId,
        NotificationType.BOOKING_ACCEPTED,
        '¡Presupuesto Aceptado!',
        `El cliente aceptó tu cotización. Se ha creado una nueva reserva.`,
        { bookingId: result.id }
    );

    return result;
  }

  async findByRequest(requestId: string, userId: string) {
      return this.prisma.quote.findMany({
          where: { requestId },
          include: {
              provider: {
                  select: { id: true, firstName: true, lastName: true, avatarUrl: true, avgRating: true }
              }
          }
      })
  }

  async findMyQuotes(providerId: string) {
      return this.prisma.quote.findMany({
          where: { providerId },
          include: {
              request: {
                  select: {
                      id: true,
                      title: true,
                      category: true,
                      zone: true,
                      status: true,
                      createdAt: true
                  }
              }
          },
          orderBy: { createdAt: 'desc' }
      });
  }
}
