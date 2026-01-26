import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto';
export declare class ReviewService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(authorId: string, dto: CreateReviewDto): Promise<{
        author: {
            firstName: string | null;
            lastName: string | null;
            id: string;
            avatarUrl: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        providerId: string;
        bookingId: string;
        authorId: string;
        rating: number;
        comment: string | null;
    }>;
    findByProvider(providerId: string): Promise<({
        booking: {
            service: {
                title: string;
            };
        };
        author: {
            firstName: string | null;
            lastName: string | null;
            id: string;
            avatarUrl: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        providerId: string;
        bookingId: string;
        authorId: string;
        rating: number;
        comment: string | null;
    })[]>;
    findByService(serviceId: string): Promise<({
        author: {
            firstName: string | null;
            lastName: string | null;
            id: string;
            avatarUrl: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        providerId: string;
        bookingId: string;
        authorId: string;
        rating: number;
        comment: string | null;
    })[]>;
    private updateProviderRating;
    private updateServiceRating;
}
