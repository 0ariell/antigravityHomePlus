export declare class CreateBookingDto {
    serviceId: string;
    description: string;
    images?: string[];
    preferredDate?: string;
    address: string;
    notes?: string;
}
export declare class UpdateBookingStatusDto {
    status: 'ACCEPTED' | 'REJECTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
    quotedPrice?: number;
}
