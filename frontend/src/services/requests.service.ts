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
  createdAt: string;
  client: {
    firstName: string;
    lastName: string;
    avatarUrl?: string;
    address?: string;
  };
  _count?: { quotes: number };
  quotes?: { id: string }[]; // Minimal info to check if quoted
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
  }
};
