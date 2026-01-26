import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { DollarSign, MapPin } from 'lucide-react';

// Fix for default marker icons in React Leaflet
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

interface ServiceRequest {
  id: string;
  title: string;
  description: string;
  category: string;
  zone: string;
  latitude: number | null;
  longitude: number | null;
  createdAt: string;
  client: {
    firstName: string;
    lastName: string;
  };
}

interface MapLeadsViewProps {
  requests: ServiceRequest[];
  onQuote: (requestId: string) => void;
}

export function MapLeadsView({ requests, onQuote }: MapLeadsViewProps) {
  const [center, setCenter] = useState<[number, number]>([-34.6037, -58.3816]); // Buenos Aires default
  
  // Try to center on the first request with coordinates
  useEffect(() => {
    const withCoords = requests.find(r => r.latitude && r.longitude);
    if (withCoords?.latitude && withCoords?.longitude) {
      setCenter([withCoords.latitude, withCoords.longitude]);
    }
  }, [requests]);

  // If no requests have coordinates, we could show a message or generic map
  const validRequests = requests.filter(r => r.latitude && r.longitude);

  return (
    <div className="h-[600px] w-full rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm relative">
      <MapContainer 
        center={center} 
        zoom={13} 
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {validRequests.map(req => (
          <Marker 
            key={req.id} 
            position={[req.latitude!, req.longitude!]}
          >
            <Popup className="request-popup">
              <div className="p-1 min-w-[200px]">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 bg-orange-100 text-orange-600 text-[10px] font-bold rounded-full uppercase">
                    {req.category}
                  </span>
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{req.title}</h3>
                <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                  {req.description}
                </p>
                <div className="flex items-center gap-1 text-xs text-gray-400 mb-4">
                  <MapPin className="w-3 h-3" />
                  <span>{req.zone}</span>
                </div>
                
                <div className="flex gap-2">
                  <button 
                    onClick={() => onQuote(req.id)}
                    className="flex-1 btn-primary py-1.5 text-xs flex items-center justify-center gap-1 transition-transform hover:scale-105"
                  >
                    <DollarSign className="w-3 h-3" />
                    Cotizar
                  </button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      {validRequests.length === 0 && requests.length > 0 && (
        <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-[2px] z-[1000] flex items-center justify-center p-6 text-center">
          <div className="max-w-xs">
            <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Ubicaciones no disponibles</h4>
            <p className="text-sm text-gray-500 mt-2">
              Las solicitudes actuales no tienen coordenadas GPS. Podrás verlas en el modo Lista.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
