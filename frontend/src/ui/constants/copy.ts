/**
 * HomePlus UX Copy - Textos humanizados
 * Evitamos el "feel robótico" con copy conversacional
 */

export const COPY = {
  // ===== ESTADOS VACÍOS =====
  empty: {
    noJobs: {
      title: '¡Todo tranquilo por aquí!',
      subtitle: 'No tenés trabajos pendientes. ¡Buen momento para descansar!',
    },
    noRequests: {
      title: 'Sin pedidos nuevos',
      subtitle: 'Cuando alguien necesite ayuda en tu zona, te avisamos.',
    },
    noMessages: {
      title: 'Tu bandeja está vacía',
      subtitle: 'Cuando tengas conversaciones activas, aparecerán aquí.',
    },
    noQuotes: {
      title: 'Esperando presupuestos',
      subtitle: 'Los profesionales están revisando tu pedido. ¡Pronto recibirás ofertas!',
    },
    noActivity: {
      title: 'Sin actividad reciente',
      subtitle: 'Cuando recibas presupuestos o mensajes, los verás aquí.',
    },
    noProviders: {
      title: 'Buscando profesionales...',
      subtitle: 'Estamos encontrando los mejores para vos.',
    },
    noReviews: {
      title: 'Sin reseñas aún',
      subtitle: 'Las opiniones de tus clientes aparecerán aquí.',
    },
  },

  // ===== ESTADOS DE CARGA =====
  loading: {
    default: 'Cargando...',
    searching: 'Buscando al mejor especialista para vos...',
    sending: 'Enviando tu pedido...',
    processing: 'Procesando...',
    uploading: 'Subiendo imagen...',
    connecting: 'Conectando...',
  },

  // ===== ERRORES =====
  errors: {
    generic: 'Ups, algo salió mal. Intentá de nuevo.',
    network: 'Sin conexión. Verificá tu internet.',
    server: 'Nuestros servidores están descansando. Volvé en unos minutos.',
    notFound: 'No encontramos lo que buscabas.',
    unauthorized: 'Sesión expirada. Ingresá de nuevo.',
    validation: 'Revisá los datos ingresados.',
  },

  // ===== ÉXITOS =====
  success: {
    requestCreated: '¡Listo! Tu pedido ya está visible para los profesionales cercanos.',
    quoteSent: '¡Presupuesto enviado! El cliente recibirá una notificación.',
    quoteAccepted: '¡Excelente! El trabajo es tuyo. Coordiná con el cliente.',
    jobCompleted: '¡Trabajo terminado! Esperá la valoración del cliente.',
    reviewSent: '¡Gracias por tu opinión! Ayuda a otros usuarios.',
    profileUpdated: 'Perfil actualizado correctamente.',
    messageSent: 'Mensaje enviado.',
  },

  // ===== ACCIONES =====
  actions: {
    createRequest: 'Crear Pedido',
    sendQuote: 'Enviar Presupuesto',
    acceptQuote: 'Aceptar Presupuesto',
    rejectQuote: 'Rechazar',
    startJob: 'Iniciar Trabajo',
    completeJob: 'Finalizar Trabajo',
    leaveReview: 'Dejar Reseña',
    sendMessage: 'Enviar',
    viewDetails: 'Ver Detalles',
    goBack: 'Volver',
    cancel: 'Cancelar',
    confirm: 'Confirmar',
    save: 'Guardar',
    search: 'Buscar',
    filter: 'Filtrar',
    seeAll: 'Ver todos',
    seeMore: 'Ver más',
  },

  // ===== ESTADOS DE BOOKING =====
  bookingStatus: {
    PENDING: 'Pendiente',
    ACCEPTED: 'Aceptado',
    EN_CAMINO: 'En camino',
    ARRIVED: 'Llegó',
    IN_PROGRESS: 'En progreso',
    AWAITING_APPROVAL: 'Esperando aprobación',
    COMPLETED: 'Completado',
    CANCELLED: 'Cancelado',
    REJECTED: 'Rechazado',
  },

  // ===== CATEGORÍAS =====
  categories: {
    plomeria: 'Plomería',
    electricidad: 'Electricidad',
    pintura: 'Pintura',
    reparaciones: 'Reparaciones',
    construccion: 'Construcción',
    limpieza: 'Limpieza',
    jardineria: 'Jardinería',
    mudanzas: 'Mudanzas',
    cerrajeria: 'Cerrajería',
    aire_acondicionado: 'Aire Acondicionado',
  },

  // ===== DASHBOARD =====
  dashboard: {
    greeting: (name: string) => `Hola, ${name}`,
    clientSubtitle: '¿Qué necesitas solucionar hoy?',
    providerSubtitle: 'Gestiona tus oportunidades y mantente activo',
    stats: {
      activeRequests: 'Pedidos activos',
      pendingQuotes: 'Presupuestos recibidos',
      jobsInProgress: 'Trabajos en curso',
      completedJobs: 'Completados',
    },
  },

  // ===== ONBOARDING / TOOLTIPS =====
  tips: {
    profilePhoto: '¡Una foto de perfil genera más confianza!',
    addTrades: 'Agregá tus oficios para recibir más pedidos.',
    firstRequest: '¿Primera vez? Describí tu problema con detalle.',
    verification: 'Los profesionales verificados reciben más trabajos.',
  },

  // ===== CONFIRMATIONS =====
  confirmations: {
    cancelJob: '¿Seguro que querés cancelar este trabajo?',
    rejectQuote: '¿Rechazar este presupuesto?',
    completeJob: '¿Marcar este trabajo como completado?',
    logout: '¿Cerrar sesión?',
  },
} as const;

// Tipo helper para autocompletado
export type CopyKey = keyof typeof COPY;
