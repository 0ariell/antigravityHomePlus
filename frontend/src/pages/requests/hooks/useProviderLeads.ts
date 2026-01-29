import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { requestsService, type ServiceRequest } from '../../../services/requests.service';
import { QUOTE_STATUS, type QuoteStatus } from '../../../app/constants/domain';

export interface MyQuote {
    id: string;
    status: QuoteStatus;
    price: number;
    request: ServiceRequest;
}

export type TabType = 'DIRECT' | 'OPPORTUNITIES' | 'MY_QUOTES';

export function useProviderLeads() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Initialize tab from state or default to DIRECT
  const initialTab = (location.state as any)?.initialTab as TabType | undefined;
  const [activeTab, setActiveTab] = useState<TabType>(initialTab || 'DIRECT');
  
  const [loading, setLoading] = useState(true);
  
  // Data
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [myQuotes, setMyQuotes] = useState<MyQuote[]>([]);
  
  // View options
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [isGlobal, setIsGlobal] = useState(false);

  useEffect(() => {
    loadData();
  }, [activeTab, isGlobal]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'MY_QUOTES') {
         const quotesData = await requestsService.getMyQuotes();
         // Cast to MyQuote[] manually or validate
         setMyQuotes(quotesData as unknown as MyQuote[]);
      } else if (activeTab === 'DIRECT') {
        const data = await requestsService.getDirect();
        setRequests(data);
      } else if (activeTab === 'OPPORTUNITIES') {
        const data = isGlobal 
          ? await requestsService.getAllOpen()
          : await requestsService.getNearbyOpen();
        setRequests(data);
      }
    } catch (error) {
      console.error('Error loading data', error);
    } finally {
      setLoading(false);
    }
  };

  const openQuoteForm = (requestId: string) => {
    setViewMode('list');
    navigate(`/leads/${requestId}`);
  };

  return {
      activeTab,
      setActiveTab,
      loading,
      requests,
      myQuotes,
      viewMode,
      setViewMode,
      isGlobal,
      setIsGlobal,
      openQuoteForm,
      navigate,
      QUOTE_STATUS
  };
}
