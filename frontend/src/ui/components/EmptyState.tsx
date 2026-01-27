import React from 'react';
import { 
  Inbox, 
  Search, 
  FileText, 
  MessageSquare, 
  Users, 
  Star,
  Briefcase,
  type LucideIcon 
} from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon | 'inbox' | 'search' | 'requests' | 'messages' | 'providers' | 'reviews' | 'jobs';
  title: string;
  subtitle?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

const iconMap: Record<string, LucideIcon> = {
  inbox: Inbox,
  search: Search,
  requests: FileText,
  messages: MessageSquare,
  providers: Users,
  reviews: Star,
  jobs: Briefcase,
};

export function EmptyState({
  icon = 'inbox',
  title,
  subtitle,
  action,
  className = '',
}: EmptyStateProps) {
  const IconComponent = typeof icon === 'string' ? iconMap[icon] || Inbox : icon;

  return (
    <div className={`flex flex-col items-center justify-center py-12 px-6 text-center ${className}`}>
      {/* Icon with subtle animation */}
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          <IconComponent className="w-10 h-10 text-gray-400 dark:text-gray-500" />
        </div>
        {/* Decorative rings */}
        <div className="absolute inset-0 rounded-full border-2 border-gray-100 dark:border-gray-700 animate-pulse-soft" style={{ transform: 'scale(1.3)' }} />
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">
        {title}
      </h3>

      {/* Subtitle */}
      {subtitle && (
        <p className="text-gray-500 dark:text-gray-400 max-w-sm text-sm leading-relaxed">
          {subtitle}
        </p>
      )}

      {/* Action button */}
      {action && (
        <button
          onClick={action.onClick}
          className="mt-6 btn-primary text-sm py-2.5 px-5"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

// Pre-configured empty states using COPY constants
export const EmptyStates = {
  NoJobs: (props?: Partial<EmptyStateProps>) => (
    <EmptyState
      icon="jobs"
      title="¡Todo tranquilo por aquí!"
      subtitle="No tenés trabajos pendientes. ¡Buen momento para descansar!"
      {...props}
    />
  ),
  NoRequests: (props?: Partial<EmptyStateProps>) => (
    <EmptyState
      icon="requests"
      title="Sin pedidos nuevos"
      subtitle="Cuando alguien necesite ayuda en tu zona, te avisamos."
      {...props}
    />
  ),
  NoMessages: (props?: Partial<EmptyStateProps>) => (
    <EmptyState
      icon="messages"
      title="Tu bandeja está vacía"
      subtitle="Cuando tengas conversaciones activas, aparecerán aquí."
      {...props}
    />
  ),
  NoQuotes: (props?: Partial<EmptyStateProps>) => (
    <EmptyState
      icon="inbox"
      title="Esperando presupuestos"
      subtitle="Los profesionales están revisando tu pedido. ¡Pronto recibirás ofertas!"
      {...props}
    />
  ),
  NoProviders: (props?: Partial<EmptyStateProps>) => (
    <EmptyState
      icon="providers"
      title="Buscando profesionales..."
      subtitle="Estamos encontrando los mejores para vos."
      {...props}
    />
  ),
  NoReviews: (props?: Partial<EmptyStateProps>) => (
    <EmptyState
      icon="reviews"
      title="Sin reseñas aún"
      subtitle="Las opiniones de tus clientes aparecerán aquí."
      {...props}
    />
  ),
  SearchEmpty: (props?: Partial<EmptyStateProps>) => (
    <EmptyState
      icon="search"
      title="Sin resultados"
      subtitle="Probá con otros términos o filtros."
      {...props}
    />
  ),
};
