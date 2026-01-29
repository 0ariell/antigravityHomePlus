import { httpClient } from '../infra/http';

export interface CreateRequestDto {
  category: string;
  title: string;
  description: string;
  zone: string;
  images?: string[];
  preferredDate?: string;
  latitude?: number;
  longitude?: number;
  diagnosis?: any;
  extraInfo?: string;
}

export interface ServiceRequest {
  id: string;
  category: string;
  title: string;
  description: string;
  zone: string;
  images: string[];
  status: 'OPEN' | 'CLOSED' | 'CANCELLED';
  latitude: number | null;
  longitude: number | null;
  diagnosis?: any;
  extraInfo?: string;
  createdAt: string;
  client: {
    firstName: string;
    lastName: string;
    avatarUrl?: string;
    address?: string;
  };
  _count?: { quotes: number };
  quotes?: { id: string, price: number, status: string, isAsap: boolean, estimatedDate?: string, provider: { firstName: string, lastName: string, avatarUrl?: string, avgRating?: number } }[];
}

export const requestsService = {
  create: (data: CreateRequestDto) => httpClient.post('/service-requests', data),
  
  getNearbyOpen: async (): Promise<ServiceRequest[]> => {
    const response = await httpClient.get('/service-requests/nearby');
    return response.data;
  },

  getMyRequests: async (): Promise<ServiceRequest[]> => {
    const response = await httpClient.get('/service-requests/my-requests');
    return response.data;
  },

  getOne: async (id: string) => {
    const response = await httpClient.get(`/service-requests/${id}`);
    return response.data;
  },

  getAllOpen: async (): Promise<ServiceRequest[]> => {
    const response = await httpClient.get('/service-requests/all-open');
    return response.data;
  },

  getDirect: async (): Promise<ServiceRequest[]> => {
    const response = await httpClient.get('/service-requests/direct');
    return response.data;
  },

  getMyQuotes: async (): Promise<{ id: string, status: string, price: number, isAsap: boolean, estimatedDate?: string, request: ServiceRequest }[]> => {
    const response = await httpClient.get('/quotes/my-quotes');
    return response.data;
  }
};
