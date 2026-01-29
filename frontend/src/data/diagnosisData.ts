import { 
  Droplet, 
  Zap, 
  Flame, 
  Hammer, 
  PaintBucket, 
  Box 
} from 'lucide-react';

export interface Question {
  id: string;
  text: string;
  options: string[];
}

export interface Problem {
  id: string;
  label: string;
  questions: Question[];
}

export interface Trade {
  id: string;
  label: string;
  icon: any;
  color: string;
  problems: Problem[];
}

const GENERIC_QUESTIONS: Question[] = [
  {
    id: 'antiguedad',
    text: '¿Hace cuánto tiempo presenta este problema?',
    options: ['Recién hoy', 'Hace unos días', 'Más de una semana', 'No lo sé']
  },
  {
    id: 'urgencia',
    text: '¿Qué tan urgente es la reparación?',
    options: ['Muy urgente (emergencia)', 'Puede esperar unos días', 'Sin apuro es para mantenimiento']
  },
  {
    id: 'materiales',
    text: '¿Tienes los materiales necesarios?',
    options: ['Sí, ya los compré', 'No, necesito que el profesional los traiga', 'Necesito asesoramiento primero']
  }
];

export const DIAGNOSIS_DATA: Trade[] = [
  {
    id: 'plomeria',
    label: 'Plomería',
    icon: Droplet,
    color: 'from-blue-500 to-cyan-500',
    problems: [
      { 
        id: 'p_canilla_gotea', 
        label: 'Canilla que gotea constantemente',
        questions: [
            { id: 'tipo_canilla', text: '¿Qué tipo de canilla es?', options: ['Monocomando', 'Doble comando', 'Grifería de cocina', 'Grifería de baño', 'No estoy seguro'] },
            { id: 'intensidad_goteo', text: '¿Cómo es el goteo?', options: ['Goteo leve ocasional', 'Goteo constante', 'Chorrito continuo', 'Pierde agua solo al abrir', 'No lo sé'] },
            { id: 'ubicacion', text: '¿Dónde se encuentra la canilla?', options: ['Cocina', 'Baño', 'Lavadero', 'Exterior', 'Otro'] },
            { id: 'antiguedad_inst', text: '¿Hace cuánto está instalada?', options: ['Menos de 1 año', 'Entre 1 y 5 años', 'Más de 5 años', 'No lo sé'] },
            { id: 'accesibilidad', text: '¿Es fácil acceder a la canilla?', options: ['Sí, está a la vista', 'Parcialmente', 'No, requiere desmontar mueble o pared', 'No lo sé'] }
        ]
      },
      { id: 'p_perdida_agua', label: 'Pérdida de agua en canilla', questions: GENERIC_QUESTIONS },
      { id: 'p_inodoro_pierde', label: 'Inodoro pierde agua', questions: GENERIC_QUESTIONS },
      { id: 'p_inodoro_no_carga', label: 'Inodoro no carga agua', questions: GENERIC_QUESTIONS },
      { id: 'p_inodoro_tapado', label: 'Inodoro tapado', questions: GENERIC_QUESTIONS },
      { id: 'p_desague_tapado', label: 'Desagüe tapado (cocina / baño)', questions: GENERIC_QUESTIONS },
      { id: 'p_perdida_pared', label: 'Pérdida de agua en pared o piso', questions: GENERIC_QUESTIONS },
      { id: 'p_presion_baja', label: 'Baja presión de agua', questions: GENERIC_QUESTIONS },
      { id: 'p_cambio_griferia', label: 'Cambio de grifería', questions: GENERIC_QUESTIONS },
      { id: 'p_inst_lavarropas', label: 'Instalación de lavarropas', questions: GENERIC_QUESTIONS },
      { id: 'p_caño_roto', label: 'Caño roto', questions: GENERIC_QUESTIONS },
      { id: 'p_filtracion_vecino', label: 'Filtración de agua del vecino', questions: GENERIC_QUESTIONS },
      { id: 'p_termotanque_pierde', label: 'Termotanque pierde agua', questions: GENERIC_QUESTIONS }
    ]
  },
  {
    id: 'electricidad',
    label: 'Electricidad',
    icon: Zap,
    color: 'from-yellow-400 to-orange-500',
    problems: [
      { id: 'e_cortes_luz', label: 'Cortes de luz en parte de la casa', questions: GENERIC_QUESTIONS },
      { id: 'e_salta_termica', label: 'Salta la térmica o disyuntor', questions: GENERIC_QUESTIONS },
      { id: 'e_toma_no_funciona', label: 'Tomacorriente no funciona', questions: GENERIC_QUESTIONS },
      { id: 'e_chispas', label: 'Chispas en enchufe', questions: GENERIC_QUESTIONS },
      { id: 'e_cambio_enchufes', label: 'Cambio de enchufes', questions: GENERIC_QUESTIONS },
      { id: 'e_cambio_interruptores', label: 'Cambio de interruptores', questions: GENERIC_QUESTIONS },
      { id: 'e_inst_luminaria', label: 'Instalación de luminaria', questions: GENERIC_QUESTIONS },
      { id: 'e_inst_ventilador', label: 'Instalación de ventilador de techo', questions: GENERIC_QUESTIONS },
      { id: 'e_inst_tablero', label: 'Instalación de tablero eléctrico', questions: GENERIC_QUESTIONS },
      { id: 'e_cables_expuestos', label: 'Cables expuestos', questions: GENERIC_QUESTIONS },
      { id: 'e_luz_parpadea', label: 'Luz parpadea', questions: GENERIC_QUESTIONS },
      { id: 'e_inst_toma_tierra', label: 'Instalación de toma a tierra', questions: GENERIC_QUESTIONS },
      { id: 'e_aumento_potencia', label: 'Aumento de potencia', questions: GENERIC_QUESTIONS },
      { id: 'e_inst_completa', label: 'Instalación eléctrica completa', questions: GENERIC_QUESTIONS },
      { id: 'e_revision_general', label: 'Revisión eléctrica general', questions: GENERIC_QUESTIONS }
    ]
  },
  {
    id: 'gas',
    label: 'Gas',
    icon: Flame,
    color: 'from-orange-500 to-red-600',
    problems: [
      { id: 'g_olor_gas', label: 'Olor a gas', questions: GENERIC_QUESTIONS },
      { id: 'g_revision_inst', label: 'Revisión de instalación de gas', questions: GENERIC_QUESTIONS },
      { id: 'g_inst_cocina', label: 'Instalación de cocina', questions: GENERIC_QUESTIONS },
      { id: 'g_inst_estufa', label: 'Instalación de estufa', questions: GENERIC_QUESTIONS },
      { id: 'g_inst_termotanque', label: 'Instalación de termotanque', questions: GENERIC_QUESTIONS },
      { id: 'g_cambio_flexible', label: 'Cambio de flexible de gas', questions: GENERIC_QUESTIONS },
      { id: 'g_perdida_gas', label: 'Pérdida de gas', questions: GENERIC_QUESTIONS },
      { id: 'g_adecuacion', label: 'Adecuación a normativa', questions: GENERIC_QUESTIONS },
      { id: 'g_certificacion', label: 'Certificación de gas', questions: GENERIC_QUESTIONS },
      { id: 'g_cambio_llave', label: 'Cambio de llave de paso', questions: GENERIC_QUESTIONS },
      { id: 'g_inst_calefon', label: 'Instalación de calefón', questions: GENERIC_QUESTIONS },
      { id: 'g_posible_fuga', label: 'Revisión por posible fuga', questions: GENERIC_QUESTIONS },
      { id: 'g_reubicacion', label: 'Reubicación de artefacto', questions: GENERIC_QUESTIONS },
      { id: 'g_inst_horno', label: 'Instalación de horno', questions: GENERIC_QUESTIONS },
      { id: 'g_mantenimiento', label: 'Mantenimiento preventivo', questions: GENERIC_QUESTIONS }
    ]
  },
  {
    id: 'albañileria',
    label: 'Albañilería',
    icon: Hammer,
    color: 'from-amber-600 to-orange-700',
    problems: [
      { id: 'a_pared_agrietada', label: 'Arreglo de pared agrietada', questions: GENERIC_QUESTIONS },
      { id: 'a_humedad_pared', label: 'Humedad en pared', questions: GENERIC_QUESTIONS },
      { id: 'a_revoque', label: 'Reparación de revoque', questions: GENERIC_QUESTIONS },
      { id: 'a_pared_nueva', label: 'Construcción de pared nueva', questions: GENERIC_QUESTIONS },
      { id: 'a_hueco', label: 'Apertura de hueco', questions: GENERIC_QUESTIONS },
      { id: 'a_cierre_hueco', label: 'Cierre de hueco', questions: GENERIC_QUESTIONS },
      { id: 'a_reparacion_piso', label: 'Reparación de piso', questions: GENERIC_QUESTIONS },
      { id: 'a_colocacion_ceramicos', label: 'Colocación de cerámicos', questions: GENERIC_QUESTIONS },
      { id: 'a_escalones', label: 'Reparación de escalones', questions: GENERIC_QUESTIONS },
      { id: 'a_nivelacion', label: 'Nivelación de piso', questions: GENERIC_QUESTIONS },
      { id: 'a_contrapiso', label: 'Contrapiso', questions: GENERIC_QUESTIONS },
      { id: 'a_arreglo_techo', label: 'Arreglo de techo', questions: GENERIC_QUESTIONS },
      { id: 'a_filtraciones', label: 'Filtraciones', questions: GENERIC_QUESTIONS },
      { id: 'a_remodelacion', label: 'Pequeña remodelación', questions: GENERIC_QUESTIONS },
      { id: 'a_estructural_menor', label: 'Reparación estructural menor', questions: GENERIC_QUESTIONS }
    ]
  },
  {
    id: 'pintura',
    label: 'Pintura',
    icon: PaintBucket,
    color: 'from-pink-500 to-rose-500',
    problems: [
      { id: 'pi_interior_completa', label: 'Pintura interior completa', questions: GENERIC_QUESTIONS },
      { id: 'pi_una_habitacion', label: 'Pintura de una habitación', questions: GENERIC_QUESTIONS },
      { id: 'pi_exterior', label: 'Pintura de exterior', questions: GENERIC_QUESTIONS },
      { id: 'pi_techo', label: 'Pintura de techo', questions: GENERIC_QUESTIONS },
      { id: 'pi_humedad', label: 'Reparación y pintura por humedad', questions: GENERIC_QUESTIONS },
      { id: 'pi_cambio_color', label: 'Cambio de color', questions: GENERIC_QUESTIONS },
      { id: 'pi_pintura_vieja', label: 'Pintura sobre pintura vieja', questions: GENERIC_QUESTIONS },
      { id: 'pi_rejas', label: 'Pintura de rejas', questions: GENERIC_QUESTIONS },
      { id: 'pi_puertas', label: 'Pintura de puertas', questions: GENERIC_QUESTIONS },
      { id: 'pi_ventanas', label: 'Pintura de ventanas', questions: GENERIC_QUESTIONS },
      { id: 'pi_fachada', label: 'Pintura de fachada', questions: GENERIC_QUESTIONS },
      { id: 'pi_local', label: 'Pintura de local comercial', questions: GENERIC_QUESTIONS },
      { id: 'pi_superficie', label: 'Preparación de superficie', questions: GENERIC_QUESTIONS },
      { id: 'pi_sellado', label: 'Sellado y pintura', questions: GENERIC_QUESTIONS },
      { id: 'pi_retoques', label: 'Retoques puntuales', questions: GENERIC_QUESTIONS }
    ]
  },
  {
    id: 'carpinteria',
    label: 'Carpintería',
    icon: Box,
    color: 'from-amber-800 to-orange-950',
    problems: [
      { id: 'c_reparacion_puerta', label: 'Reparación de puerta', questions: GENERIC_QUESTIONS },
      { id: 'c_ajuste_puerta', label: 'Ajuste de puerta', questions: GENERIC_QUESTIONS },
      { id: 'c_puerta_no_cierra', label: 'Puerta no cierra', questions: GENERIC_QUESTIONS },
      { id: 'c_armado_mueble', label: 'Armado de mueble', questions: GENERIC_QUESTIONS },
      { id: 'c_reparacion_mueble', label: 'Reparación de mueble', questions: GENERIC_QUESTIONS },
      { id: 'c_mueble_medida', label: 'Mueble a medida', questions: GENERIC_QUESTIONS },
      { id: 'c_estantes', label: 'Colocación de estantes', questions: GENERIC_QUESTIONS },
      { id: 'c_cajones', label: 'Reparación de cajones', questions: GENERIC_QUESTIONS },
      { id: 'c_bisagras', label: 'Cambio de bisagras', questions: GENERIC_QUESTIONS },
      { id: 'c_correderas', label: 'Cambio de correderas', questions: GENERIC_QUESTIONS },
      { id: 'c_placard', label: 'Ajuste de placard', questions: GENERIC_QUESTIONS },
      { id: 'c_marcos', label: 'Colocación de marcos', questions: GENERIC_QUESTIONS },
      { id: 'c_ventana', label: 'Reparación de ventana', questions: GENERIC_QUESTIONS },
      { id: 'c_cerradura', label: 'Instalación de cerradura', questions: GENERIC_QUESTIONS },
      { id: 'c_estructural_menor', label: 'Reparación estructural menor', questions: GENERIC_QUESTIONS }
    ]
  }
];
