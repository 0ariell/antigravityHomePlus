export const BOOKING_STATUS = {
    PENDING: 'PENDING',
    ACCEPTED: 'ACCEPTED',
    REJECTED: 'REJECTED',
    IN_PROGRESS: 'IN_PROGRESS',
    COMPLETED: 'COMPLETED',
    CANCELLED: 'CANCELLED'
} as const;

export const REQUEST_STATUS = {
    OPEN: 'OPEN',
    CLOSED: 'CLOSED',
    CANCELLED: 'CANCELLED'
} as const;

export const QUOTE_STATUS = {
    PENDING: 'PENDING',
    ACCEPTED: 'ACCEPTED',
    REJECTED: 'REJECTED'
} as const;

export const USER_ROLE = {
    CLIENT: 'CLIENT',
    PROVIDER: 'PROVIDER'
} as const;

export type BookingStatus = keyof typeof BOOKING_STATUS;
export type RequestStatus = keyof typeof REQUEST_STATUS;
export type QuoteStatus = keyof typeof QUOTE_STATUS;
export type UserRole = keyof typeof USER_ROLE;
