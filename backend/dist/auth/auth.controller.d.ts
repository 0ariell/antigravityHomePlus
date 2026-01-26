import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto): Promise<{
        user: {
            email: string;
            role: import("@prisma/client").$Enums.UserRole;
            firstName: string | null;
            lastName: string | null;
            id: string;
            avatarUrl: string | null;
            createdAt: Date;
        };
        accessToken: string;
    }>;
    login(dto: LoginDto): Promise<{
        user: {
            id: string;
            email: string;
            role: import("@prisma/client").$Enums.UserRole;
            firstName: string | null;
            lastName: string | null;
            avatarUrl: string | null;
        };
        accessToken: string;
    }>;
    getProfile(userId: string): Promise<{
        email: string;
        role: import("@prisma/client").$Enums.UserRole;
        firstName: string | null;
        lastName: string | null;
        id: string;
        phone: string | null;
        avatarUrl: string | null;
        bio: string | null;
        zone: string | null;
        trades: string[];
        certifications: string[];
        portfolioUrls: string[];
        address: string | null;
        avgRating: number;
        totalReviews: number;
        createdAt: Date;
    }>;
    logout(): Promise<{
        message: string;
    }>;
}
