import { useState, useEffect } from 'react';
import { httpClient } from '../../infra/http';
import { ServiceDetail, PublicProfile } from '../../ui/pages/services/types'; // We will define types properly next

export function useServiceDetail(serviceId?: string) {
  const [service, setService] = useState<ServiceDetail | null>(null);
  const [providerProfile, setProviderProfile] = useState<PublicProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!serviceId) return;
    loadData();
  }, [serviceId]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      // 1. Load Service
      const serviceRes = await httpClient.get(`/services/${serviceId}`);
      setService(serviceRes.data);

      // 2. Load Provider Profile (for reviews/extra info)
      if (serviceRes.data?.provider?.id) {
        try {
          const profileRes = await httpClient.get(`/auth/users/${serviceRes.data.provider.id}/public-profile`);
          setProviderProfile(profileRes.data);
        } catch (e) {
          console.warn('Could not load provider profile', e);
        }
      }
    } catch (err: any) {
      console.error('Error loading service:', err);
      setError(err.message || 'Error loading service');
    } finally {
      setIsLoading(false);
    }
  };

  return { service, providerProfile, isLoading, error, refetch: loadData };
}
