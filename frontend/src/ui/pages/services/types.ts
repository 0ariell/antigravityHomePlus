export interface ServiceDetail {
  id: string;
  title: string;
  description: string;
  category: string;
  zone: string;
  priceBase: number | null;
  priceUnit: string | null;
  images: string[];
  avgRating: number;
  totalReviews: number;
  isActive: boolean;
  provider: {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
    avgRating: number;
    totalReviews: number;
    bio: string | null;
  };
}

export interface PublicProfile {
  reviewsReceived: Array<{
    id: string;
    rating: number;
    comment: string;
    createdAt: string;
    author: {
      firstName: string;
      lastName: string;
      avatarUrl: string | null;
    };
  }>;
}
