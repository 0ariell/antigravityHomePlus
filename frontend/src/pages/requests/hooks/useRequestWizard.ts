import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { requestsService } from '../../../services/requests.service';
import type { Trade, Problem } from '../../../data/diagnosisData';

export function useRequestWizard() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Guided Data State
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [extraInfo, setExtraInfo] = useState('');
  const [images, setImages] = useState<string[]>([]);
  
  // Location State
  const [zone, setZone] = useState('');
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([-34.6037, -58.3816]);

  const steps = [
    { title: 'Oficio' },
    { title: 'Problema' },
    { title: 'Diagnóstico' },
    { title: 'Info Extra' },
    { title: 'Fotos' },
    { title: 'Ubicación' },
    { title: 'Resumen' },
  ];

  useEffect(() => {
    if (step === 6 && !location && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setMapCenter([latitude, longitude]);
        setLocation({ lat: latitude, lng: longitude });
      });
    }
  }, [step]);

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  // Simulation for image upload
  const handleSimulateUpload = () => {
    const mockImages = [
      'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=400',
      'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400',
      'https://images.unsplash.com/photo-1504148454959-adfa0055c6d5?w=400'
    ];
    if (images.length < 3) {
       setImages([...images, mockImages[images.length]]);
    }
  };

  const handleLocationSelect = (lat: number, lng: number) => {
      setLocation({ lat, lng });
  };

  const handleSubmit = async () => {
    if (!selectedTrade || !selectedProblem || !location) return;
    
    setLoading(true);
    try {
        const title = selectedProblem.label;
        const description = `Diagnóstico de ${selectedTrade.label}: ${selectedProblem.label}`;
        
        const diagnosis = {
            trade: selectedTrade.id,
            tradeLabel: selectedTrade.label,
            problem: selectedProblem.id,
            problemLabel: selectedProblem.label,
            answers: selectedProblem.questions.map(q => ({
                question: q.text,
                answer: answers[q.id] || 'No respondido'
            }))
        };

        await requestsService.create({
            category: selectedTrade.label,
            title,
            description,
            diagnosis,
            extraInfo,
            zone,
            latitude: location.lat,
            longitude: location.lng,
            images
        });

        alert('¡Solicitud creada con éxito!');
        navigate('/my-requests');
    } catch (error) {
        console.error(error);
        alert('Error al crear la solicitud.');
    } finally {
        setLoading(false);
    }
  };

  return {
    step,
    steps,
    loading,
    selectedTrade,
    selectedProblem,
    answers,
    extraInfo,
    images,
    zone,
    location,
    mapCenter,
    nextStep,
    prevStep,
    setSelectedTrade,
    setSelectedProblem,
    setAnswers,
    setExtraInfo,
    setImages,
    setZone,
    handleSimulateUpload,
    handleLocationSelect,
    handleSubmit
  };
}
