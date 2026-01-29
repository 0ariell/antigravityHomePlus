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

// --- PLOMERIA ---
const PLOMERIA_INODORO_TAPADO: Question[] = [
    { id: 'desborde', text: '¿Se desborda el agua al tirar la cadena?', options: ['Sí, totalmente', 'Parcialmente', 'No se desborda'] },
    { id: 'intentos', text: '¿Has intentado destaparlo?', options: ['No intenté nada', 'Con sopapa/ventosa', 'Con alambre/cinta', 'Con productos químicos'] },
    { id: 'alcance', text: '¿El problema es solo en este inodoro?', options: ['Sí, solo aquí', 'Afecta otros desagües (ducha/bidet)', 'No lo sé'] },
    ...GENERIC_QUESTIONS
];
const PLOMERIA_PERDIDA: Question[] = [
    { id: 'origen_perdida', text: '¿Dónde se origina la pérdida?', options: ['Tubería interna', 'Grifería', 'Conexión flexible', 'No lo sé'] },
    { id: 'frecuencia_perdida', text: '¿Cuándo pierde?', options: ['Es constante', 'Solo al usar el artefacto', 'Es intermitente'] },
    { id: 'daño_superficie', text: '¿Está dañando paredes o pisos?', options: ['Sí, hay humedad visible', 'Sí, gotea al vecino', 'No por ahora'] },
    ...GENERIC_QUESTIONS
];
const PLOMERIA_INODORO_PIERDE: Question[] = [
    { id: 'lugar_perdida', text: '¿Por dónde pierde agua?', options: ['Por la base (piso)', 'Por la mochila/depósito', 'Por el botón de descarga', 'No lo sé'] },
    { id: 'tipo_descarga', text: '¿Qué sistema de descarga tiene?', options: ['Mochila apoyada', 'Mochila colgante', 'Válvula en pared', 'No lo sé'] },
    ...GENERIC_QUESTIONS
];
const PLOMERIA_INODORO_NO_CARGA: Question[] = [
    { id: 'ruido', text: '¿Hace ruido de carga?', options: ['Sí, pero no corta', 'No hace ningún ruido', 'Hace un silbido constante'] },
    { id: 'agua_red', text: '¿Hay agua en el resto de la casa?', options: ['Sí, normal', 'No, no hay agua', 'Poca presión'] },
    ...GENERIC_QUESTIONS
];
const PLOMERIA_DESAGUE_TAPADO: Question[] = [
    { id: 'ubicacion_desague', text: '¿Qué desagüe está afectado?', options: ['Pileta de cocina', 'Lavatorio de baño', 'Ducha/Bañera', 'Lavadero'] },
    { id: 'velocidad_drenaje', text: '¿El agua baja lento o no baja nada?', options: ['Baja muy lento', 'No baja nada (se estanca)', 'Baja haciendo ruidos raros'] },
    ...GENERIC_QUESTIONS
];
const PLOMERIA_PRESION_BAJA: Question[] = [
    { id: 'afectados', text: '¿Afecta a toda la casa o solo una canilla?', options: ['Toda la casa', 'Solo agua caliente', 'Solo una canilla específica', 'Solo el baño'] },
    { id: 'tipo_suministro', text: '¿Tienes tanque de agua o es directo?', options: ['Tanque elevado', 'Cisterna y bomba', 'Directo de red', 'No lo sé'] },
    ...GENERIC_QUESTIONS
];
const PLOMERIA_CAMBIO_GRIFERIA: Question[] = [
    { id: 'tipo_nueva', text: '¿Qué grifería vas a instalar?', options: ['Monocomando', 'Doble comando estándar', 'Grifería de pared', 'Grifería de ducha exterior'] },
    { id: 'estado_actual', text: '¿La instalación actual funciona bien?', options: ['Sí, solo quiero renovar', 'No, está rota/oxidada', 'Es una instalación nueva'] },
    ...GENERIC_QUESTIONS
];
const PLOMERIA_INST_LAVARROPAS: Question[] = [
    { id: 'conexiones', text: '¿Están listas las conexiones de agua y desagüe?', options: ['Sí, todo listo', 'Solo la canilla', 'No hay nada instalado', 'Es un reemplazo'] },
    { id: 'espacio', text: '¿El espacio es suficiente?', options: ['Sí', 'Es muy justo', 'Hay que adaptar mueble/mesada'] },
    ...GENERIC_QUESTIONS
];

// --- ELECTRICIDAD ---
const ELEC_SALTA_TERMICA: Question[] = [
    { id: 'cuando_salta', text: '¿En qué momento salta la térmica?', options: ['Al encender un aparato puntual', 'Al azar / sin motivo aparente', 'No deja rearmarla (salta enseguida)'] },
    { id: 'clima', text: '¿Ocurre cuando llueve o hay humedad?', options: ['Sí, siempre', 'A veces', 'No, no tiene relación'] },
    { id: 'disyuntor', text: '¿Tienes disyuntor diferencial instalado?', options: ['Sí', 'No', 'No estoy seguro'] },
    ...GENERIC_QUESTIONS
];
const ELEC_LUMINARIA: Question[] = [
    { id: 'tipo_trabajo', text: '¿Es una instalación nueva o reemplazo?', options: ['Instalación nueva (requiere cableado)', 'Reemplazo (solo montaje)'] },
    { id: 'altura_techo', text: '¿A qué altura se debe instalar?', options: ['Altura estándar (hasta 2.5m)', 'Doble altura (requiere escalera alta)'] },
    { id: 'producto_listo', text: '¿Ya tienes la lámpara/aplique?', options: ['Sí, ya lo tengo', 'No, necesito asesoramiento'] },
    ...GENERIC_QUESTIONS
];
const ELEC_CORTES_LUZ: Question[] = [
    { id: 'alcance_corte', text: '¿El corte es total o parcial?', options: ['Toda la casa', 'Solo algunas habitaciones', 'Solo los enchufes', 'Solo la iluminación'] },
    { id: 'vecinos', text: '¿Los vecinos tienen luz?', options: ['Sí, tienen luz', 'No, es un corte general', 'No me fijé'] },
    ...GENERIC_QUESTIONS
];
const ELEC_TOMA_NO_FUNCIONA: Question[] = [
    { id: 'cantidad', text: '¿Cuántos tomas fallan?', options: ['Solo uno', 'Varios en la misma pared', 'Todos de la habitación'] },
    { id: 'signos', text: '¿Hay signos de quemadura o calentamiento?', options: ['Sí, plástico derretido/negro', 'Está caliente al tacto', 'Ninguno visible'] },
    ...GENERIC_QUESTIONS
];
const ELEC_CAMBIO_ENCHUFES: Question[] = [
    { id: 'cantidad_cambio', text: '¿Cuántos módulos necesitas cambiar?', options: ['1 a 3', '4 a 10', 'Más de 10', 'Toda la casa'] },
    { id: 'motivo', text: '¿Cuál es el motivo?', options: ['Estética/Renovación', 'Están quemados/viejos', 'Cambio de norma (patas planas)'] },
    ...GENERIC_QUESTIONS
];
const ELEC_TABLERO: Question[] = [
    { id: 'tipo_tablero', text: '¿Es tablero principal o seccional?', options: ['Principal (medidor)', 'Seccional (dentro de casa)', 'No lo sé'] },
    { id: 'trabajo_req', text: '¿Qué necesitas hacer?', options: ['Cambiar térmicas viejas', 'Agregar circuitos', 'Instalar disyuntor', 'Armado de cero'] },
    ...GENERIC_QUESTIONS
];

// --- GAS ---
const GAS_OLOR: Question[] = [
    { id: 'ubicacion_olor', text: '¿Dónde percibes el olor a gas?', options: ['Cerca de un artefacto', 'En el nicho del medidor', 'En un ambiente cerrado', 'En toda la casa'] },
    { id: 'frecuencia', text: '¿El olor es constante?', options: ['Sí, constante', 'Solo cuando uso un artefacto', 'Solo a veces'] },
    { id: 'llave_paso', text: '¿Has cerrado la llave de paso?', options: ['Sí, la general', 'Solo la del artefacto', 'No la cerré'] },
    ...GENERIC_QUESTIONS
];
const GAS_INST_ARTEFACTO: Question[] = [
    { id: 'tipo_gas', text: '¿Qué tipo de gas tienes?', options: ['Gas Natural (red)', 'Gas Envasado (garrafa/tubo)'] },
    { id: 'ventilacion', text: '¿El ambiente tiene rejillas de ventilación?', options: ['Sí, superior e inferior', 'Solo una', 'No tiene ventilación'] },
    { id: 'salida_humos', text: '¿El artefacto tiene salida al exterior?', options: ['Sí, tiro balanceado', 'Sí, tiro natural', 'Sin salida (infrarrojo/catalítico)'] },
    ...GENERIC_QUESTIONS
];
const GAS_REVISION: Question[] = [
    { id: 'motivo_rev', text: '¿Por qué solicitas la revisión?', options: ['Control preventivo', 'Solicitud de Metrogas/Naturgy', 'Voy a alquilar/comprar', 'Sospecha de fuga'] },
    { id: 'planos', text: '¿Tienes planos de la instalación?', options: ['Sí', 'No', 'No lo sé'] },
    ...GENERIC_QUESTIONS
];

// --- ALBAÑILERIA ---
const ALBA_HUMEDAD: Question[] = [
    { id: 'altura', text: '¿A qué altura se encuentra la humedad?', options: ['Cerca del piso (cimientos)', 'En el techo', 'En el medio de la pared'] },
    { id: 'exterior', text: '¿La pared da al exterior?', options: ['Sí', 'No, es interna', 'No, da al vecino'] },
    { id: 'estado_superficie', text: '¿Cómo está la superficie?', options: ['Solo mancha de humedad', 'Pintura descascarada', 'Hay moho u hongos negros', 'Revoque cayéndose'] },
    ...GENERIC_QUESTIONS
];
const ALBA_PARED: Question[] = [
    { id: 'tipo_pared', text: '¿De qué material es la pared?', options: ['Ladrillo común/hueco', 'Durlock/Yeso', 'Hormigón', 'No lo sé'] },
    { id: 'daño', text: '¿Qué tipo de daño tiene?', options: ['Grieta profunda', 'Fisuras superficiales', 'Golpe/Agujero'] },
    ...GENERIC_QUESTIONS
];
const ALBA_PISO: Question[] = [
    { id: 'tipo_piso', text: '¿Qué tipo de piso es?', options: ['Cerámica/Porcelanato', 'Madera/Parquet', 'Cemento alisado', 'Baldosa exterior'] },
    { id: 'problema_piso', text: '¿Cuál es el problema?', options: ['Piezas sueltas/rotas', 'Desnivelado', 'Humedad que sube', 'Juntas deterioradas'] },
    ...GENERIC_QUESTIONS
];

// --- PINTURA ---
const PINT_UNA_HABITACION: Question[] = [
    { id: 'tamaño', text: '¿Qué tamaño aproximado tiene la habitación?', options: ['Chica (hasta 2x2m)', 'Mediana (3x3m)', 'Grande (4x4m o más)'] },
    { id: 'muebles', text: '¿Hay que mover muebles pesados?', options: ['Sí, hay muchos', 'Pocos muebles', 'No, está vacía'] },
    { id: 'estado_paredes', text: '¿Cómo están las paredes?', options: ['Muy buen estado', 'Requieren arreglos menores', 'Muchos huecos o grietas'] },
    ...GENERIC_QUESTIONS
];
const PINT_EXTERIOR: Question[] = [
    { id: 'altura_trabajo', text: '¿A qué altura hay que pintar?', options: ['Planta baja', 'Primer piso (escalera)', 'Altura considerable (andamios/sileta)'] },
    { id: 'superficie', text: '¿Qué tipo de superficie es?', options: ['Revoque fino/grueso', 'Ladrillo a la vista', 'Tarquini/Texturado', 'Madera/Metal'] },
    ...GENERIC_QUESTIONS
];
const PINT_TECHOS: Question[] = [
    { id: 'tipo_techo', text: '¿Qué tipo de techo es?', options: ['Losa (hormigón)', 'Yeso/Durlock', 'Madera/Machimbre'] },
    { id: 'problemas_previos', text: '¿Hubo humedad o filtraciones?', options: ['Sí, ya reparadas', 'Sí, activas', 'No, está en buen estado'] },
    ...GENERIC_QUESTIONS
];

// --- CARPINTERIA ---
const CARP_ARMADO_MUEBLE: Question[] = [
    { id: 'estado_mueble', text: '¿El mueble es nuevo en caja?', options: ['Sí, nuevo embalado', 'No, es para rearmar', 'Parcialmente armado'] },
    { id: 'tipo_mueble', text: '¿Qué tipo de mueble es?', options: ['Ropero / Placard grande', 'Escritorio / Mesa', 'Cómoda / Biblioteca mediana', 'Mueble de cocina'] },
    { id: 'herramientas', text: '¿Tienes las herramientas básicas?', options: ['Sí, tengo todo', 'No, el profesional debe traerlas'] },
    ...GENERIC_QUESTIONS
];
const CARP_PUERTA: Question[] = [
    { id: 'tipo_puerta', text: '¿Qué tipo de puerta es?', options: ['Madera placa (interior)', 'Madera maciza', 'Chapa/Metal', 'Vidrio/Aluminio'] },
    { id: 'problema_puerta', text: '¿Cuál es el problema?', options: ['Roza el piso', 'No entra en el marco', 'Bisagras rotas', 'Hinchada por humedad'] },
    ...GENERIC_QUESTIONS
];
const CARP_MUEBLE_REPARACION: Question[] = [
    { id: 'material_mueble', text: '¿De qué material es?', options: ['Melamina/MDF', 'Madera maciza', 'Pino', 'No lo sé'] },
    { id: 'daño_mueble', text: '¿Qué se rompió?', options: ['Pata/Estructura', 'Puerta/Cajón', 'Superficie/Tapa', 'Desencolado'] },
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
            { id: 'antiguedad_inst', text: '¿Hace cuánto está instalada?', options: ['Menos de 1 año', 'Entre 1 y 5 años', 'Más de 5 años', 'No lo sé'] },
            { id: 'accesibilidad', text: '¿Es fácil acceder a la canilla?', options: ['Sí, está a la vista', 'Parcialmente', 'No, requiere desmontar mueble o pared', 'No lo sé'] }
        ]
      },
      { id: 'p_perdida_agua', label: 'Pérdida de agua en canilla', questions: PLOMERIA_PERDIDA },
      { id: 'p_inodoro_pierde', label: 'Inodoro pierde agua', questions: PLOMERIA_INODORO_PIERDE },
      { id: 'p_inodoro_no_carga', label: 'Inodoro no carga agua', questions: PLOMERIA_INODORO_NO_CARGA },
      { id: 'p_inodoro_tapado', label: 'Inodoro tapado', questions: PLOMERIA_INODORO_TAPADO },
      { id: 'p_desague_tapado', label: 'Desagüe tapado (cocina / baño)', questions: PLOMERIA_DESAGUE_TAPADO },
      { id: 'p_perdida_pared', label: 'Pérdida de agua en pared o piso', questions: PLOMERIA_PERDIDA },
      { id: 'p_presion_baja', label: 'Baja presión de agua', questions: PLOMERIA_PRESION_BAJA },
      { id: 'p_cambio_griferia', label: 'Cambio de grifería', questions: PLOMERIA_CAMBIO_GRIFERIA },
      { id: 'p_inst_lavarropas', label: 'Instalación de lavarropas', questions: PLOMERIA_INST_LAVARROPAS },
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
      { id: 'e_cortes_luz', label: 'Cortes de luz en parte de la casa', questions: ELEC_CORTES_LUZ },
      { id: 'e_salta_termica', label: 'Salta la térmica o disyuntor', questions: ELEC_SALTA_TERMICA },
      { id: 'e_toma_no_funciona', label: 'Tomacorriente no funciona', questions: ELEC_TOMA_NO_FUNCIONA },
      { id: 'e_chispas', label: 'Chispas en enchufe', questions: ELEC_TOMA_NO_FUNCIONA },
      { id: 'e_cambio_enchufes', label: 'Cambio de enchufes', questions: ELEC_CAMBIO_ENCHUFES },
      { id: 'e_cambio_interruptores', label: 'Cambio de interruptores', questions: ELEC_CAMBIO_ENCHUFES },
      { id: 'e_inst_luminaria', label: 'Instalación de luminaria', questions: ELEC_LUMINARIA },
      { id: 'e_inst_ventilador', label: 'Instalación de ventilador de techo', questions: ELEC_LUMINARIA },
      { id: 'e_inst_tablero', label: 'Instalación de tablero eléctrico', questions: ELEC_TABLERO },
      { id: 'e_cables_expuestos', label: 'Cables expuestos', questions: GENERIC_QUESTIONS },
      { id: 'e_luz_parpadea', label: 'Luz parpadea', questions: ELEC_CORTES_LUZ },
      { id: 'e_inst_toma_tierra', label: 'Instalación de toma a tierra', questions: GENERIC_QUESTIONS },
      { id: 'e_aumento_potencia', label: 'Aumento de potencia', questions: ELEC_TABLERO },
      { id: 'e_inst_completa', label: 'Instalación eléctrica completa', questions: ELEC_TABLERO },
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
      { id: 'g_revision_inst', label: 'Revisión de instalación de gas', questions: GAS_REVISION },
      { id: 'g_inst_cocina', label: 'Instalación de cocina', questions: GAS_INST_ARTEFACTO },
      { id: 'g_inst_estufa', label: 'Instalación de estufa', questions: GAS_INST_ARTEFACTO },
      { id: 'g_inst_termotanque', label: 'Instalación de termotanque', questions: GAS_INST_ARTEFACTO },
      { id: 'g_cambio_flexible', label: 'Cambio de flexible de gas', questions: GENERIC_QUESTIONS },
      { id: 'g_perdida_gas', label: 'Pérdida de gas', questions: GAS_OLOR },
      { id: 'g_adecuacion', label: 'Adecuación a normativa', questions: GAS_REVISION },
      { id: 'g_certificacion', label: 'Certificación de gas', questions: GAS_REVISION },
      { id: 'g_cambio_llave', label: 'Cambio de llave de paso', questions: GENERIC_QUESTIONS },
      { id: 'g_inst_calefon', label: 'Instalación de calefón', questions: GAS_INST_ARTEFACTO },
      { id: 'g_posible_fuga', label: 'Revisión por posible fuga', questions: GAS_OLOR },
      { id: 'g_reubicacion', label: 'Reubicación de artefacto', questions: GAS_INST_ARTEFACTO },
      { id: 'g_inst_horno', label: 'Instalación de horno', questions: GAS_INST_ARTEFACTO },
      { id: 'g_mantenimiento', label: 'Mantenimiento preventivo', questions: GAS_REVISION }
    ]
  },
  {
    id: 'albañileria',
    label: 'Albañilería',
    icon: Hammer,
    color: 'from-amber-600 to-orange-700',
    problems: [
      { id: 'a_pared_agrietada', label: 'Arreglo de pared agrietada', questions: ALBA_PARED },
      { id: 'a_humedad_pared', label: 'Humedad en pared', questions: ALBA_HUMEDAD },
      { id: 'a_revoque', label: 'Reparación de revoque', questions: ALBA_PARED },
      { id: 'a_pared_nueva', label: 'Construcción de pared nueva', questions: ALBA_PARED },
      { id: 'a_hueco', label: 'Apertura de hueco', questions: ALBA_PARED },
      { id: 'a_cierre_hueco', label: 'Cierre de hueco', questions: ALBA_PARED },
      { id: 'a_reparacion_piso', label: 'Reparación de piso', questions: ALBA_PISO },
      { id: 'a_colocacion_ceramicos', label: 'Colocación de cerámicos', questions: ALBA_PISO },
      { id: 'a_escalones', label: 'Reparación de escalones', questions: ALBA_PISO },
      { id: 'a_nivelacion', label: 'Nivelación de piso', questions: ALBA_PISO },
      { id: 'a_contrapiso', label: 'Contrapiso', questions: ALBA_PISO },
      { id: 'a_arreglo_techo', label: 'Arreglo de techo', questions: ALBA_PARED },
      { id: 'a_filtraciones', label: 'Filtraciones', questions: ALBA_HUMEDAD },
      { id: 'a_remodelacion', label: 'Pequeña remodelación', questions: GENERIC_QUESTIONS },
      { id: 'a_estructural_menor', label: 'Reparación estructural menor', questions: ALBA_PARED }
    ]
  },
  {
    id: 'pintura',
    label: 'Pintura',
    icon: PaintBucket,
    color: 'from-pink-500 to-rose-500',
    problems: [
      { id: 'pi_interior_completa', label: 'Pintura interior completa', questions: PINT_UNA_HABITACION },
      { id: 'pi_una_habitacion', label: 'Pintura de una habitación', questions: PINT_UNA_HABITACION },
      { id: 'pi_exterior', label: 'Pintura de exterior', questions: PINT_EXTERIOR },
      { id: 'pi_techo', label: 'Pintura de techo', questions: PINT_TECHOS },
      { id: 'pi_humedad', label: 'Reparación y pintura por humedad', questions: ALBA_HUMEDAD },
      { id: 'pi_cambio_color', label: 'Cambio de color', questions: PINT_UNA_HABITACION },
      { id: 'pi_pintura_vieja', label: 'Pintura sobre pintura vieja', questions: PINT_UNA_HABITACION },
      { id: 'pi_rejas', label: 'Pintura de rejas', questions: PINT_EXTERIOR },
      { id: 'pi_puertas', label: 'Pintura de puertas', questions: PINT_EXTERIOR },
      { id: 'pi_ventanas', label: 'Pintura de ventanas', questions: PINT_EXTERIOR },
      { id: 'pi_fachada', label: 'Pintura de fachada', questions: PINT_EXTERIOR },
      { id: 'pi_local', label: 'Pintura de local comercial', questions: PINT_UNA_HABITACION },
      { id: 'pi_superficie', label: 'Preparación de superficie', questions: PINT_UNA_HABITACION },
      { id: 'pi_sellado', label: 'Sellado y pintura', questions: PINT_EXTERIOR },
      { id: 'pi_retoques', label: 'Retoques puntuales', questions: GENERIC_QUESTIONS }
    ]
  },
  {
    id: 'carpinteria',
    label: 'Carpintería',
    icon: Box,
    color: 'from-amber-800 to-orange-950',
    problems: [
      { id: 'c_reparacion_puerta', label: 'Reparación de puerta', questions: CARP_PUERTA },
      { id: 'c_ajuste_puerta', label: 'Ajuste de puerta', questions: CARP_PUERTA },
      { id: 'c_puerta_no_cierra', label: 'Puerta no cierra', questions: CARP_PUERTA },
      { id: 'c_armado_mueble', label: 'Armado de mueble', questions: CARP_ARMADO_MUEBLE },
      { id: 'c_reparacion_mueble', label: 'Reparación de mueble', questions: CARP_MUEBLE_REPARACION },
      { id: 'c_mueble_medida', label: 'Mueble a medida', questions: CARP_ARMADO_MUEBLE },
      { id: 'c_estantes', label: 'Colocación de estantes', questions: CARP_ARMADO_MUEBLE },
      { id: 'c_cajones', label: 'Reparación de cajones', questions: CARP_MUEBLE_REPARACION },
      { id: 'c_bisagras', label: 'Cambio de bisagras', questions: CARP_MUEBLE_REPARACION },
      { id: 'c_correderas', label: 'Cambio de correderas', questions: CARP_MUEBLE_REPARACION },
      { id: 'c_placard', label: 'Ajuste de placard', questions: CARP_ARMADO_MUEBLE },
      { id: 'c_marcos', label: 'Colocación de marcos', questions: CARP_PUERTA },
      { id: 'c_ventana', label: 'Reparación de ventana', questions: CARP_PUERTA },
      { id: 'c_cerradura', label: 'Instalación de cerradura', questions: CARP_PUERTA },
      { id: 'c_estructural_menor', label: 'Reparación estructural menor', questions: CARP_MUEBLE_REPARACION }
    ]
  }
];
