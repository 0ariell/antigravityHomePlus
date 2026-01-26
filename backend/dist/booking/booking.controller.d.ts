import { BookingService } from './booking.service';
import { CreateBookingDto, UpdateBookingStatusDto } from './dto';
export declare class BookingController {
    private readonly bookingService;
    constructor(bookingService: BookingService);
    create(clientId: string, dto: CreateBookingDto): Promise<{
        service: {
            id: string;
            title: string;
            category: string;
        };
        conversation: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            bookingId: string;
        } | null;
        provider: {
            firstName: string | null;
            lastName: string | null;
            id: string;
            avatarUrl: string | null;
        };
    } & {
        id: string;
        address: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        images: string[];
        providerId: string;
        serviceId: string;
        preferredDate: Date | null;
        notes: string | null;
        status: import("@prisma/client").$Enums.BookingStatus;
        quotedPrice: number | null;
        finalPrice: number | null;
        acceptedAt: Date | null;
        completedAt: Date | null;
        clientId: string;
    }>;
    findMyBookings(user: {
        id: string;
        role: string;
    }): Promise<({
        service: {
            id: string;
            title: string;
            category: string;
            images: string[];
        };
        provider: {
            firstName: string | null;
            lastName: string | null;
            id: string;
            avatarUrl: string | null;
        };
    } & {
        id: string;
        address: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        images: string[];
        providerId: string;
        serviceId: string;
        preferredDate: Date | null;
        notes: string | null;
        status: import("@prisma/client").$Enums.BookingStatus;
        quotedPrice: number | null;
        finalPrice: number | null;
        acceptedAt: Date | null;
        completedAt: Date | null;
        clientId: string;
    })[]> | Promise<({
        service: {
            id: string;
            title: string;
            category: string;
        };
        client: {
            firstName: string | null;
            lastName: string | null;
            id: string;
            phone: string | null;
            avatarUrl: string | null;
        };
    } & {
        id: string;
        address: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        images: string[];
        providerId: string;
        serviceId: string;
        preferredDate: Date | null;
        notes: string | null;
        status: import("@prisma/client").$Enums.BookingStatus;
        quotedPrice: number | null;
        finalPrice: number | null;
        acceptedAt: Date | null;
        completedAt: Date | null;
        clientId: string;
    })[]>;
    findOne(id: string, userId: string): Promise<{
        service: {
            id: string;
            zone: string;
            avgRating: number;
            totalReviews: number;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            description: string;
            category: string;
            priceBase: number | null;
            priceUnit: string | null;
            images: string[];
            isActive: boolean;
            providerId: string;
        };
        conversation: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            bookingId: string;
        } | null;
        review: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            providerId: string;
            bookingId: string;
            authorId: string;
            rating: number;
            comment: string | null;
        } | null;
        provider: {
            email: string;
            firstName: string | null;
            lastName: string | null;
            id: string;
            phone: string | null;
            avatarUrl: string | null;
        };
        client: {
            email: string;
            firstName: string | null;
            lastName: string | null;
            id: string;
            phone: string | null;
            avatarUrl: string | null;
        };
    } & {
        id: string;
        address: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        images: string[];
        providerId: string;
        serviceId: string;
        preferredDate: Date | null;
        notes: string | null;
        status: import("@prisma/client").$Enums.BookingStatus;
        quotedPrice: number | null;
        finalPrice: number | null;
        acceptedAt: Date | null;
        completedAt: Date | null;
        clientId: string;
    }>;
    updateStatus(id: string, user: {
        id: string;
        role: string;
    }, dto: UpdateBookingStatusDto): Promise<{
        service: {
            id: string;
            title: string;
        };
        provider: {
            firstName: string | null;
            lastName: string | null;
            id: string;
        };
        client: {
            firstName: string | null;
            lastName: string | null;
            id: string;
        };
    } & {
        id: string;
        address: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        images: string[];
        providerId: string;
        serviceId: string;
        preferredDate: Date | null;
        notes: string | null;
        status: import("@prisma/client").$Enums.BookingStatus;
        quotedPrice: number | null;
        finalPrice: number | null;
        acceptedAt: Date | null;
        completedAt: Date | null;
        clientId: string;
    }>;
}
