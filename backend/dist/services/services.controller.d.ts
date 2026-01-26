import { ServicesService } from './services.service';
import { CreateServiceDto, UpdateServiceDto, ServiceQueryDto } from './dto';
export declare class ServicesController {
    private readonly servicesService;
    constructor(servicesService: ServicesService);
    findAll(query: ServiceQueryDto): Promise<{
        data: ({
            provider: {
                firstName: string | null;
                lastName: string | null;
                id: string;
                avatarUrl: string | null;
                avgRating: number;
                totalReviews: number;
            };
        } & {
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
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        provider: {
            firstName: string | null;
            lastName: string | null;
            id: string;
            phone: string | null;
            avatarUrl: string | null;
            bio: string | null;
            zone: string | null;
            trades: string[];
            avgRating: number;
            totalReviews: number;
        };
    } & {
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
    }>;
    create(providerId: string, dto: CreateServiceDto): Promise<{
        provider: {
            firstName: string | null;
            lastName: string | null;
            id: string;
            avatarUrl: string | null;
            avgRating: number;
        };
    } & {
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
    }>;
    findMyServices(providerId: string): Promise<{
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
    }[]>;
    update(id: string, providerId: string, dto: UpdateServiceDto): Promise<{
        provider: {
            firstName: string | null;
            lastName: string | null;
            id: string;
            avatarUrl: string | null;
        };
    } & {
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
    }>;
    toggleActive(id: string, providerId: string): Promise<{
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
    }>;
    delete(id: string, providerId: string): Promise<{
        message: string;
    }>;
}
