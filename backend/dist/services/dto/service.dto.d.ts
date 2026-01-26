export declare class CreateServiceDto {
    title: string;
    description: string;
    category: string;
    zone: string;
    priceBase?: number;
    priceUnit?: string;
    images?: string[];
}
export declare class UpdateServiceDto {
    title?: string;
    description?: string;
    category?: string;
    zone?: string;
    priceBase?: number;
    priceUnit?: string;
    images?: string[];
    isActive?: boolean;
}
export declare class ServiceQueryDto {
    category?: string;
    zone?: string;
    minRating?: number;
    page?: number;
    limit?: number;
}
