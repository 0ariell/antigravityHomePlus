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

const PLOMERIA_INODORO_TAPADO: Question[] = [
    { id: 'desborde', text: '¿Se desborda el agua al tirar la cadena?', options: ['Sí, totalmente', 'Parcialmente', 'No se desborda'] },
    { id: 'intentos', text: '¿Has intentado destaparlo?', options: ['No intenté nada', 'Con sopapa/ventosa', 'Con alambre/cinta', 'Con productos químicos'] },
    { id: 'alcance', text: '¿El problema es solo en este inodoro?', options: ['Sí, solo aquí', 'Afecta otros desagües (ducha/bidet)', 'No lo sé'] },
    ...GENERIC_QUESTIONS
];

const ELEC_SALTA_TERMICA: Question[] = [
    { id: 'cuando_salta', text: '¿En qué momento salta la térmica?', options: ['Al encender un aparato puntual', 'Al azar / sin motivo aparente', 'No deja rearmarla (salta enseguida)'] },
    { id: 'clima', text: '¿Ocurre cuando llueve o hay humedad?', options: ['Sí, siempre', 'A veces', 'No, no tiene relación'] },
    { id: 'disyuntor', text: '¿Tienes disyuntor diferencial instalado?', options: ['Sí', 'No', 'No estoy seguro'] },
    ...GENERIC_QUESTIONS
];

const GAS_OLOR: Question[] = [
    { id: 'ubicacion_olor', text: '¿Dónde percibes el olor a gas?', options: ['Cerca de un artefacto', 'En el nicho del medidor', 'En un ambiente cerrado', 'En toda la casa'] },
    { id: 'frecuencia', text: '¿El olor es constante?', options: ['Sí, constante', 'Solo cuando uso un artefacto', 'Solo a veces'] },
    { id: 'llave_paso', text: '¿Has cerrado la llave de paso?', options: ['Sí, la general', 'Solo la del artefacto', 'No la cerré'] },
    ...GENERIC_QUESTIONS
];

const ALBA_HUMEDAD: Question[] = [
    { id: 'altura', text: '¿A qué altura se encuentra la humedad?', options: ['Cerca del piso (cimientos)', 'En el techo', 'En el medio de la pared'] },
    { id: 'exterior', text: '¿La pared da al exterior?', options: ['Sí', 'No, es interna', 'No, da al vecino'] },
    { id: 'estado_superficie', text: '¿Cómo está la superficie?', options: ['Solo mancha de humedad', 'Pintura descascarada', 'Hay moho u hongos negros', 'Revoque cayéndose'] },
    ...GENERIC_QUESTIONS
];

const PINT_UNA_HABITACION: Question[] = [
    { id: 'tamaño', text: '¿Qué tamaño aproximado tiene la habitación?', options: ['Chica (hasta 2x2m)', 'Mediana (3x3m)', 'Grande (4x4m o más)'] },
    { id: 'muebles', text: '¿Hay que mover muebles pesados?', options: ['Sí, hay muchos', 'Pocos muebles', 'No, está vacía'] },
    { id: 'estado_paredes', text: '¿Cómo están las paredes?', options: ['Muy buen estado', 'Requieren arreglos menores', 'Muchos huecos o grietas'] },
    ...GENERIC_QUESTIONS
];

const CARP_ARMADO_MUEBLE: Question[] = [
    { id: 'estado_mueble', text: '¿El mueble es nuevo en caja?', options: ['Sí, nuevo embalado', 'No, es para rearmar', 'Parcialmente armado'] },
    { id: 'tipo_mueble', text: '¿Qué tipo de mueble es?', options: ['Ropero / Placard grande', 'Escritorio / Mesa', 'Cómoda / Biblioteca mediana', 'Mueble de cocina'] },
    { id: 'herramientas', text: '¿Tienes las herramientas básicas?', options: ['Sí, tengo todo', 'No, el profesional debe traerlas'] },
    ...GENERIC_QUESTIONS
];

const PLOMERIA_PERDIDA: Question[] = [
    { id: 'origen_perdida', text: '¿Dónde se origina la pérdida?', options: ['Tubería interna', 'Grifería', 'Conexión flexible', 'No lo sé'] },
    { id: 'frecuencia_perdida', text: '¿Cuándo pierde?', options: ['Es constante', 'Solo al usar el artefacto', 'Es intermitente'] },
    { id: 'daño_superficie', text: '¿Está dañando paredes o pisos?', options: ['Sí, hay humedad visible', 'Sí, gotea al vecino', 'No por ahora'] },
    ...GENERIC_QUESTIONS
];

const ELEC_LUMINARIA: Question[] = [
    { id: 'tipo_trabajo', text: '¿Es una instalación nueva o reemplazo?', options: ['Instalación nueva (requiere cableado)', 'Reemplazo (solo montaje)'] },
    { id: 'altura_techo', text: '¿A qué altura se debe instalar?', options: ['Altura estándar (hasta 2.5m)', 'Doble altura (requiere escalera alta)'] },
    { id: 'producto_listo', text: '¿Ya tienes la lámpara/aplique?', options: ['Sí, ya lo tengo', 'No, necesito asesoramiento'] },
    ...GENERIC_QUESTIONS
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
            ...GENERIC_QUESTIONS
        ]
      },
      { id: 'p_perdida_agua', label: 'Pérdida de agua en canilla', questions: PLOMERIA_PERDIDA },
      { id: 'p_inodoro_pierde', label: 'Inodoro pierde agua', questions: GENERIC_QUESTIONS },
      { id: 'p_inodoro_no_carga', label: 'Inodoro no carga agua', questions: GENERIC_QUESTIONS },
      { id: 'p_inodoro_tapado', label: 'Inodoro tapado', questions: PLOMERIA_INODORO_TAPADO },
      { id: 'p_desague_tapado', label: 'Desagüe tapado (cocina / baño)', questions: GENERIC_QUESTIONS },
      { id: 'p_perdida_pared', label: 'Pérdida de agua en pared o piso', questions: PLOMERIA_PERDIDA },
      { id: 'p_presion_baja', label: 'Baja presión de agua', questions: GENERIC_QUESTIONS },
      { id: 'p_cambio_griferia', label: 'Cambio de grifería', questions: GENERIC_QUESTIONS },
      { id: 'p_inst_lavarropas', label: 'Instalación de lavarropas', questions: GENERIC_QUESTIONS },
      { id: 'p_caño_roto', label: 'Caño roto', questions: PLOMERIA_PERDIDA },
      { id: 'p_filtracion_vecino', label: 'Filtración de agua del vecino', questions: PLOMERIA_PERDIDA },
      { id: 'p_termotanque_pierde', label: 'Termotanque pierde agua', questions: PLOMERIA_PERDIDA }
    ]
  },
  {
    id: 'electricidad',
    label: 'Electricidad',
    icon: Zap,
    color: 'from-yellow-400 to-orange-500',
    problems: [
      { id: 'e_cortes_luz', label: 'Cortes de luz en parte de la casa', questions: GENERIC_QUESTIONS },
      { id: 'e_salta_termica', label: 'Salta la térmica o disyuntor', questions: ELEC_SALTA_TERMICA },
      { id: 'e_toma_no_funciona', label: 'Tomacorriente no funciona', questions: GENERIC_QUESTIONS },
      { id: 'e_chispas', label: 'Chispas en enchufe', questions: GENERIC_QUESTIONS },
      { id: 'e_cambio_enchufes', label: 'Cambio de enchufes', questions: GENERIC_QUESTIONS },
      { id: 'e_cambio_interruptores', label: 'Cambio de interruptores', questions: GENERIC_QUESTIONS },
      { id: 'e_inst_luminaria', label: 'Instalación de luminaria', questions: ELEC_LUMINARIA },
      { id: 'e_inst_ventilador', label: 'Instalación de ventilador de techo', questions: ELEC_LUMINARIA },
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
      { id: 'g_olor_gas', label: 'Olor a gas', questions: GAS_OLOR },
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
      { id: 'a_humedad_pared', label: 'Humedad en pared', questions: ALBA_HUMEDAD },
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
      { id: 'pi_una_habitacion', label: 'Pintura de una habitación', questions: PINT_UNA_HABITACION },
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
      { id: 'c_armado_mueble', label: 'Armado de mueble', questions: CARP_ARMADO_MUEBLE },
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
