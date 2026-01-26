import { httpClient } from '../infra/http';

export interface CreateQuoteDto {
  requestId: string;
  price: number;
  description?: string;
}

export interface Quote {
  id: string;
  price: number;
  description?: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
  provider: {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl?: string;
    avgRating: number;
  };
}

export const quotesService = {
  create: (data: CreateQuoteDto) => httpClient.post('/quotes', data),
  
  accept: (id: string) => httpClient.patch(`/quotes/${id}/accept`, {}),
  
  getByRequest: async (requestId: string): Promise<Quote[]> => {
    const response = await httpClient.get(`/quotes/request/${requestId}`);
    return response.data;
  }
};
