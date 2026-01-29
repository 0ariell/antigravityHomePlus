// diagnosisData.ts
import {
  Droplet,
  Zap,
  Flame,
  Hammer,
  PaintBucket,
  Box,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/**
 * HomePlus - Guided diagnosis (no free-text)
 * - Trades -> Problems -> Questions (options only)
 * - Each Problem enforces photos (minPhotos + photoGuide)
 */

export type QuestionKind = "single" | "multi";

export interface PhotoGuideItem {
  id: string;
  label: string;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  kind?: QuestionKind; // default "single"
  required?: boolean; // default true
  help?: string; // short guidance text (not user input)
}

export interface Problem {
  id: string;
  label: string;
  questions: Question[];
  minPhotos: number; // enforce min 3
  photoGuide: PhotoGuideItem[]; // what photos to take
}

export interface Trade {
  id: string;
  label: string;
  icon: LucideIcon;
  color: string;
  problems: Problem[];
}

/* -----------------------
   Shared helpers
------------------------ */

const req = (q: Question): Question => ({
  kind: "single",
  required: true,
  ...q,
});

const GENERIC_QUESTIONS: Question[] = [
  req({
    id: "antiguedad",
    text: "¿Hace cuánto tiempo está pasando?",
    options: [
      "Recién hoy",
      "1–3 días",
      "4–7 días",
      "Más de 1 semana",
      "Más de 1 mes",
      "No lo sé",
    ],
  }),
  req({
    id: "frecuencia",
    text: "¿Con qué frecuencia ocurre?",
    options: [
      "Todo el tiempo",
      "Varias veces al día",
      "Una vez al día",
      "Cada tanto",
      "Solo en ciertos momentos",
    ],
  }),
  req({
    id: "urgencia",
    text: "¿Qué tan urgente es?",
    options: [
      "Emergencia (riesgo/daño)",
      "Alta (hoy/mañana)",
      "Media (esta semana)",
      "Baja (sin apuro)",
    ],
  }),
  req({
    id: "acceso",
    text: "¿Cómo es el acceso a la zona?",
    options: [
      "Fácil (a la vista)",
      "Medio (mueble/objeto estorba)",
      "Difícil (altura/techo)",
      "Requiere abrir pared/piso",
      "No lo sé",
    ],
  }),
  req({
    id: "materiales",
    text: "Materiales / repuestos",
    options: [
      "Ya los tengo",
      "No tengo nada",
      "Tengo algunos",
      "Necesito asesoramiento para comprar",
    ],
  }),
  req({
    id: "horario",
    text: "¿En qué franja horaria podés recibir al profesional?",
    options: ["Mañana", "Tarde", "Noche", "Fin de semana", "Flexible"],
  }),
];


const PHOTO_GUIDE_PLOMERIA: PhotoGuideItem[] = [
  { id: "general", label: "Foto general (baño/cocina/lavadero)" },
  { id: "fuga", label: "Primer plano de la fuga/parte afectada" },
  { id: "conex", label: "Foto de conexiones (flexibles, llaves, base)" },
];

const PHOTO_GUIDE_ELECTRICIDAD: PhotoGuideItem[] = [
  { id: "tablero", label: "Foto del tablero (térmicas/disyuntor) si aplica" },
  { id: "punto", label: "Foto del punto afectado (toma/llave/luz)" },
  { id: "contexto", label: "Foto general del ambiente y acceso" },
];

const PHOTO_GUIDE_GAS: PhotoGuideItem[] = [
  { id: "artefacto", label: "Foto del artefacto (cocina/estufa/calefón)" },
  { id: "conex", label: "Foto de conexión (flexible/llaves/cañería)" },
  { id: "vent", label: "Foto de ventilación y salida de gases si aplica" },
];

const PHOTO_GUIDE_ALBANILERIA: PhotoGuideItem[] = [
  { id: "general", label: "Foto general de la pared/piso/techo" },
  { id: "detalle", label: "Primer plano de grieta/humedad/rotura" },
  { id: "entorno", label: "Foto del entorno (esquina, aberturas, piso)" },
];

const PHOTO_GUIDE_PINTURA: PhotoGuideItem[] = [
  { id: "general", label: "Foto general del ambiente/superficie" },
  { id: "luz", label: "Foto con buena luz del estado de la pared/techo" },
  { id: "detalle", label: "Primer plano de manchas/grietas/descascarado" },
];

const PHOTO_GUIDE_CARPINTERIA: PhotoGuideItem[] = [
  { id: "general", label: "Foto general del mueble/puerta/ventana" },
  { id: "detalle", label: "Primer plano de la falla (bisagra/corredera/roce)" },
  { id: "encastre", label: "Foto de encastres/marcos/guías si aplica" },
];

/* -----------------------
   PLOMERÍA - Question sets
------------------------ */

const PLOM_CANILLA_GOTEA: Question[] = [
  req({
    id: "tipo_canilla",
    text: "¿Qué tipo de canilla es?",
    options: [
      "Monocomando",
      "Doble comando",
      "Grifería de cocina",
      "Grifería de baño",
      "No estoy seguro",
    ],
  }),
  req({
    id: "donde_gotea",
    text: "¿Dónde gotea?",
    options: [
      "Pico (sale por donde debería)",
      "Base (cerca de la mesada/pared)",
      "Manija/volante",
      "Conexiones debajo",
      "No lo sé",
    ],
  }),
  req({
    id: "intensidad",
    text: "¿Cómo es el goteo?",
    options: [
      "Goteo leve ocasional",
      "Goteo constante",
      "Chorrito continuo",
      "Solo pierde al abrir/cerrar",
      "No lo sé",
    ],
  }),
  req({
    id: "agua_afectada",
    text: "¿Afecta agua fría o caliente?",
    options: ["Fría", "Caliente", "Ambas", "No lo sé"],
  }),
  req({
    id: "ubicacion",
    text: "¿Dónde está la canilla?",
    options: ["Cocina", "Baño", "Lavadero", "Exterior", "Otro"],
  }),
  req({
    id: "antig_inst",
    text: "¿Hace cuánto está instalada?",
    options: ["Menos de 1 año", "1–5 años", "Más de 5 años", "No lo sé"],
  }),
  req({
    id: "acceso_bajo",
    text: "¿Podés acceder a las conexiones por debajo?",
    options: ["Sí, fácil", "Sí, pero con poco espacio", "No, está cerrado", "No lo sé"],
  }),
  req({
    id: "oxidacion",
    text: "¿Hay óxido/sarro visible?",
    options: ["Sí, bastante", "Algo", "No", "No lo sé"],
  }),
  ...GENERIC_QUESTIONS,
];

const PLOM_PERDIDA_AGUA_GENERAL: Question[] = [
  req({
    id: "origen",
    text: "¿Dónde se origina la pérdida?",
    options: [
      "Tubería a la vista",
      "Tubería dentro de pared/piso",
      "Grifería/artefacto",
      "Conexión flexible",
      "No lo sé",
    ],
  }),
  req({
    id: "cuando",
    text: "¿Cuándo pierde?",
    options: ["Constante", "Solo al usar", "Intermitente", "A la noche", "No lo sé"],
  }),
  req({
    id: "magnitud",
    text: "¿Qué tan fuerte es la pérdida?",
    options: ["Humedad leve", "Goteo", "Chorro", "Inundación", "No lo sé"],
  }),
  req({
    id: "daño",
    text: "¿Está dañando superficie?",
    options: [
      "Sí, humedad/mancha",
      "Sí, pintura se levanta",
      "Sí, afecta al vecino",
      "No por ahora",
      "No lo sé",
    ],
  }),
  req({
    id: "corte_agua",
    text: "¿Podés cortar el agua?",
    options: ["Sí, llave general", "Sí, llave del artefacto", "No encuentro la llave", "No lo sé"],
  }),
  req({
    id: "tipo_inst",
    text: "¿Tipo de instalación?",
    options: ["Casa", "Departamento", "PH", "Local", "No lo sé"],
  }),
  ...GENERIC_QUESTIONS,
];

const PLOM_INODORO_PIERDE: Question[] = [
  req({
    id: "por_donde",
    text: "¿Por dónde pierde agua?",
    options: ["Por la base", "Por la mochila/depósito", "Por el botón/tecla", "Por atrás", "No lo sé"],
  }),
  req({
    id: "cuando",
    text: "¿Cuándo se nota la pérdida?",
    options: [
      "Constante",
      "Solo después de tirar la cadena",
      "Solo cuando carga",
      "A veces",
      "No lo sé",
    ],
  }),
  req({
    id: "tipo_descarga",
    text: "¿Qué sistema de descarga tiene?",
    options: ["Mochila apoyada", "Mochila colgante", "Válvula en pared", "No lo sé"],
  }),
  req({
    id: "escucha_carga",
    text: "¿Se escucha que carga agua todo el tiempo?",
    options: ["Sí", "No", "A veces", "No lo sé"],
  }),
  req({
    id: "nivel_mochila",
    text: "¿El nivel de agua en la mochila llega muy alto?",
    options: ["Sí", "No", "No puedo verlo", "No lo sé"],
  }),
  req({
    id: "humedad_piso",
    text: "¿Hay agua en el piso alrededor?",
    options: ["Sí, charco", "Sí, humedad", "No", "No lo sé"],
  }),
  ...GENERIC_QUESTIONS,
];

const PLOM_INODORO_NO_CARGA: Question[] = [
  req({
    id: "hace_ruido",
    text: "¿Hace ruido de carga?",
    options: ["Sí, pero no corta", "No hace ruido", "Hace silbido", "No lo sé"],
  }),
  req({
    id: "hay_agua_casa",
    text: "¿Hay agua en el resto de la casa?",
    options: ["Sí, normal", "No hay agua", "Poca presión", "No lo sé"],
  }),
  req({
    id: "llave_abierta",
    text: "¿La llave de paso del inodoro está abierta?",
    options: ["Sí", "No", "No sé cuál es", "No lo sé"],
  }),
  req({
    id: "tipo_mochila",
    text: "Tipo de descarga",
    options: ["Mochila apoyada", "Mochila colgante", "Válvula en pared", "No lo sé"],
  }),
  req({
    id: "suciedad",
    text: "¿Ves sarro/agua sucia dentro del mecanismo?",
    options: ["Sí", "No", "No puedo verlo", "No lo sé"],
  }),
  ...GENERIC_QUESTIONS,
];

const PLOM_INODORO_TAPADO: Question[] = [
  req({
    id: "que_pasa",
    text: "Cuando tirás la cadena, ¿qué pasa?",
    options: ["Se desborda", "Sube y baja lento", "Sube y queda estancado", "Drena lento", "No probé"],
  }),
  req({
    id: "nivel_previo",
    text: "Antes de tirar la cadena, ¿el nivel de agua está normal?",
    options: ["Normal", "Muy alto", "Muy bajo", "No lo sé"],
  }),
  req({
    id: "que_lo_tapo",
    text: "¿Qué creés que lo tapó?",
    options: ["Papel", "Toallitas", "Objeto", "Sarro", "No sé"],
  }),
  req({
    id: "otros_desagues",
    text: "¿Otros desagües están lentos?",
    options: ["No, solo inodoro", "Sí, lavatorio", "Sí, ducha", "Sí, varios", "No lo sé"],
  }),
  req({
    id: "gorgoteo",
    text: "¿Escuchás gorgoteo/burbujas?",
    options: ["Sí", "No", "A veces"],
  }),
  req({
    id: "intentos",
    text: "¿Qué intentaste?",
    options: ["Nada", "Sopapa", "Serpiente/alambre", "Agua caliente", "Químicos"],
  }),
  req({
    id: "mejoro",
    text: "Si intentaste, ¿mejoró?",
    options: ["No", "Un poco", "Se solucionó y volvió", "No apliqué"],
  }),
  req({
    id: "tipo_inodoro",
    text: "Tipo de descarga",
    options: ["Mochila apoyada", "Mochila colgante", "Válvula en pared", "No lo sé"],
  }),
  req({
    id: "riesgo",
    text: "¿Hay riesgo de desborde?",
    options: ["Sí, ya se volcó", "Sí, podría pasar", "No"],
  }),
  ...GENERIC_QUESTIONS,
];

const PLOM_DESAGUE_TAPADO: Question[] = [
  req({
    id: "cual",
    text: "¿Qué desagüe está afectado?",
    options: ["Cocina", "Baño lavatorio", "Ducha/bañera", "Lavadero", "Pileta patio"],
  }),
  req({
    id: "baja",
    text: "¿El agua baja o queda estancada?",
    options: ["Baja muy lento", "No baja (estancada)", "Baja con ruidos", "Sube", "No lo sé"],
  }),
  req({
    id: "olor",
    text: "¿Hay mal olor?",
    options: ["Sí fuerte", "Sí leve", "No", "No lo sé"],
  }),
  req({
    id: "grasa_pelo",
    text: "¿Qué suele ir a ese desagüe?",
    options: ["Grasa/aceites", "Pelo", "Comida", "Jabón/cal", "No lo sé"],
  }),
  req({
    id: "intentos",
    text: "¿Qué intentaste?",
    options: ["Nada", "Destapador", "Agua caliente", "Químicos", "Desarmé sifón/trampa"],
  }),
  req({
    id: "otros_puntos",
    text: "¿Afecta otros puntos?",
    options: ["Solo uno", "Varios del mismo ambiente", "Toda la casa", "No lo sé"],
  }),
  ...GENERIC_QUESTIONS,
];

const PLOM_PRESION_BAJA: Question[] = [
  req({
    id: "alcance",
    text: "¿Afecta a toda la casa o solo un punto?",
    options: ["Toda la casa", "Solo caliente", "Solo fría", "Solo una canilla", "Solo baño"],
  }),
  req({
    id: "desde_cuando",
    text: "¿Es un problema nuevo o de siempre?",
    options: ["Nuevo", "De siempre", "Empeoró con el tiempo", "No lo sé"],
  }),
  req({
    id: "tipo_suministro",
    text: "¿Tenés tanque/bomba o es directo de red?",
    options: ["Tanque elevado", "Cisterna y bomba", "Directo de red", "No lo sé"],
  }),
  req({
    id: "solo_horarios",
    text: "¿Ocurre en ciertos horarios?",
    options: ["Sí, horarios pico", "Sí, de noche", "No, siempre igual", "No lo sé"],
  }),
  req({
    id: "filtros",
    text: "¿Hay filtros/aireadores en la canilla?",
    options: ["Sí", "No", "No lo sé"],
  }),
  ...GENERIC_QUESTIONS,
];

const PLOM_CAMBIO_GRIFERIA: Question[] = [
  req({
    id: "tipo",
    text: "¿Qué grifería vas a instalar?",
    options: ["Monocomando", "Doble comando", "De pared", "Ducha", "No lo sé"],
  }),
  req({
    id: "ambiente",
    text: "¿Dónde se instala?",
    options: ["Cocina", "Lavatorio", "Bidet", "Ducha", "Exterior"],
  }),
  req({
    id: "reemplazo",
    text: "¿Es reemplazo o instalación nueva?",
    options: ["Reemplazo", "Instalación nueva", "No lo sé"],
  }),
  req({
    id: "medidas",
    text: "¿Las conexiones coinciden?",
    options: ["Sí, mismo tipo", "No, hay que adaptar", "No lo sé"],
  }),
  req({
    id: "tenes_producto",
    text: "¿Ya tenés la grifería comprada?",
    options: ["Sí", "No", "Necesito asesoramiento"],
  }),
  ...GENERIC_QUESTIONS,
];

const PLOM_INST_LAVARROPAS: Question[] = [
  req({
    id: "conexiones",
    text: "¿Están listas agua y desagüe?",
    options: ["Sí, todo listo", "Solo agua", "Solo desagüe", "No hay nada", "Es reemplazo"],
  }),
  req({
    id: "tipo_desague",
    text: "¿El desagüe es?",
    options: ["Manguera a pileta", "Salida a pared", "Caño a piso", "No lo sé"],
  }),
  req({
    id: "espacio",
    text: "¿El espacio es suficiente?",
    options: ["Sí", "Justo", "Hay que adaptar", "No lo sé"],
  }),
  req({
    id: "distancia",
    text: "Distancia a tomacorriente y agua",
    options: ["Cerca (<1m)", "Media (1–3m)", "Lejos (>3m)", "No lo sé"],
  }),
  ...GENERIC_QUESTIONS,
];

/* -----------------------
   ELECTRICIDAD - Question sets
------------------------ */

const ELEC_CORTES_LUZ: Question[] = [
  req({
    id: "alcance",
    text: "¿El corte es total o parcial?",
    options: ["Toda la casa", "Algunas habitaciones", "Solo enchufes", "Solo luces", "No lo sé"],
  }),
  req({
    id: "tablero",
    text: "¿Alguna térmica/disyuntor bajó?",
    options: ["Sí, una térmica", "Sí, disyuntor", "No, todo sigue arriba", "No sé mirar"],
  }),
  req({
    id: "vecinos",
    text: "¿Los vecinos tienen luz?",
    options: ["Sí", "No (corte general)", "No me fijé"],
  }),
  req({
    id: "momento",
    text: "¿Cuándo sucede más?",
    options: ["Al prender algo", "Al azar", "Con lluvia/humedad", "Solo de noche", "No lo sé"],
  }),
  req({
    id: "aparatos",
    text: "¿Qué estabas usando cuando pasó?",
    options: ["Aire acondicionado", "Horno/microondas", "Calefactor", "Lavadora", "Nada especial", "No lo sé"],
  }),
  ...GENERIC_QUESTIONS,
];

const ELEC_SALTA_TERMICA: Question[] = [
  req({
    id: "cuando_salta",
    text: "¿Cuándo salta?",
    options: [
      "Al encender un aparato puntual",
      "Al azar/sin motivo",
      "No deja rearmar (salta enseguida)",
      "Después de un rato",
    ],
  }),
  req({
    id: "clima",
    text: "¿Ocurre con lluvia/humedad?",
    options: ["Sí", "A veces", "No", "No lo sé"],
  }),
  req({
    id: "disyuntor",
    text: "¿Tenés disyuntor diferencial?",
    options: ["Sí", "No", "No estoy seguro"],
  }),
  req({
    id: "calentamiento",
    text: "¿Percibiste olor a quemado o calor en algún punto?",
    options: ["Sí, olor", "Sí, calor", "No", "No lo sé"],
  }),
  req({
    id: "circuito",
    text: "¿Sospechás qué sector lo provoca?",
    options: ["Cocina", "Baño", "Aire acondicionado", "Enchufes sala", "No lo sé"],
  }),
  ...GENERIC_QUESTIONS,
];

const ELEC_TOMA_NO_FUNCIONA: Question[] = [
  req({
    id: "cantidad",
    text: "¿Cuántos tomas fallan?",
    options: ["Uno", "Varios misma pared", "Todos del ambiente", "No lo sé"],
  }),
  req({
    id: "signos",
    text: "¿Hay signos de quemadura/calentamiento?",
    options: ["Plástico negro/derretido", "Está caliente", "Chispea", "Nada visible", "No lo sé"],
  }),
  req({
    id: "prueba",
    text: "¿Probaste con otro artefacto/cargador?",
    options: ["Sí, no funciona", "Sí, a veces funciona", "No probé"],
  }),
  req({
    id: "carga",
    text: "¿Qué enchufás ahí normalmente?",
    options: ["Cargadores", "Heladera", "Microondas", "Calefactor", "PC/TV", "No lo sé"],
  }),
  req({
    id: "tipo_toma",
    text: "¿Tipo de toma?",
    options: ["2 patas", "3 patas con tierra", "Adaptador", "No lo sé"],
  }),
  ...GENERIC_QUESTIONS,
];

const ELEC_CHISPAS_ENCHUFE: Question[] = [
  req({
    id: "cuando",
    text: "¿Cuándo viste chispas?",
    options: ["Al enchufar", "Al desenchufar", "Sin tocar", "No lo sé"],
  }),
  req({
    id: "olor",
    text: "¿Hubo olor a quemado?",
    options: ["Sí", "No", "No lo sé"],
  }),
  req({
    id: "calor",
    text: "¿Está caliente la tapa o el enchufe?",
    options: ["Sí", "No", "No lo sé"],
  }),
  req({
    id: "corte",
    text: "¿Podés cortar la luz del circuito/ambiente?",
    options: ["Sí", "No", "No sé hacerlo"],
  }),
  ...ELEC_TOMA_NO_FUNCIONA,
];

const ELEC_CAMBIO_ENCHUFES: Question[] = [
  req({
    id: "cantidad",
    text: "¿Cuántos módulos necesitás cambiar?",
    options: ["1–3", "4–10", "Más de 10", "Toda la casa"],
  }),
  req({
    id: "motivo",
    text: "¿Motivo del cambio?",
    options: ["Estética", "Están flojos/viejos", "Están quemados", "Cambio de norma", "No lo sé"],
  }),
  req({
    id: "tierra",
    text: "¿Querés que queden con toma a tierra (3 patas)?",
    options: ["Sí", "No", "No lo sé"],
  }),
  req({
    id: "marca",
    text: "¿Ya elegiste línea/marca de teclas/tapas?",
    options: ["Sí", "No", "Quiero recomendación"],
  }),
  ...GENERIC_QUESTIONS,
];

const ELEC_LUMINARIA: Question[] = [
  req({
    id: "tipo_trabajo",
    text: "¿Instalación nueva o reemplazo?",
    options: ["Nueva (puede requerir cableado)", "Reemplazo (solo montaje)", "No lo sé"],
  }),
  req({
    id: "tipo_luz",
    text: "¿Qué vas a instalar?",
    options: ["Plafón", "Colgante", "Aplique pared", "Exterior", "Tira LED", "Ventilador con luz"],
  }),
  req({
    id: "altura",
    text: "Altura aproximada",
    options: ["Hasta 2.5m", "2.5–3.5m", "Doble altura (>3.5m)", "No lo sé"],
  }),
  req({
    id: "techo",
    text: "¿Tipo de techo?",
    options: ["Losa/hormigón", "Durlock/yeso", "Madera", "No lo sé"],
  }),
  req({
    id: "producto",
    text: "¿Ya tenés el artefacto?",
    options: ["Sí", "No", "Necesito asesoramiento"],
  }),
  req({
    id: "punto_existente",
    text: "¿Existe punto de luz en ese lugar?",
    options: ["Sí", "No", "No lo sé"],
  }),
  ...GENERIC_QUESTIONS,
];

const ELEC_TABLERO: Question[] = [
  req({
    id: "tipo",
    text: "¿Qué tablero es?",
    options: ["Principal", "Seccional interno", "No lo sé"],
  }),
  req({
    id: "que_necesitas",
    text: "¿Qué necesitás hacer?",
    options: [
      "Cambiar térmicas",
      "Agregar circuitos",
      "Instalar disyuntor",
      "Ordenar/etiquetar",
      "Armado de cero",
    ],
  }),
  req({
    id: "cortes",
    text: "¿Tenés cortes frecuentes o calentamiento?",
    options: ["Sí, cortes", "Sí, calentamiento", "No", "No lo sé"],
  }),
  req({
    id: "potencia",
    text: "¿Tenés artefactos de alto consumo?",
    options: ["Aire", "Horno eléctrico", "Termotanque eléctrico", "Calefactores", "No", "No lo sé"],
  }),
  req({
    id: "antig",
    text: "Antigüedad de la instalación eléctrica",
    options: ["<5 años", "5–15 años", ">15 años", "No lo sé"],
  }),
  ...GENERIC_QUESTIONS,
];

/* -----------------------
   GAS - Question sets
------------------------ */

const GAS_OLOR: Question[] = [
  req({
    id: "donde",
    text: "¿Dónde percibís el olor a gas?",
    options: [
      "Cerca de un artefacto",
      "En el medidor/nicho",
      "En un ambiente cerrado",
      "En varios ambientes",
      "No lo sé",
    ],
  }),
  req({
    id: "constante",
    text: "¿El olor es constante?",
    options: ["Sí, constante", "Solo cuando uso un artefacto", "Solo a veces", "No lo sé"],
  }),
  req({
    id: "llave",
    text: "¿Cerraste la llave de paso?",
    options: ["Sí, general", "Sí, del artefacto", "No", "No sé dónde está"],
  }),
  req({
    id: "ventilacion",
    text: "¿Ventilaste el ambiente?",
    options: ["Sí", "No", "Parcial"],
  }),
  req({
    id: "chispas",
    text: "¿Usaste encendedores/llamas o prendiste/apagaste luces recientemente?",
    options: ["Sí", "No", "No lo sé"],
  }),
  req({
    id: "tipo_gas",
    text: "¿Tipo de gas?",
    options: ["Gas Natural (red)", "Gas envasado (garrafa/tubo)", "No lo sé"],
  }),
  ...GENERIC_QUESTIONS,
];

const GAS_INST_ARTEFACTO: Question[] = [
  req({
    id: "artefacto",
    text: "¿Qué artefacto es?",
    options: ["Cocina", "Estufa", "Calefón", "Termotanque", "Horno", "Otro"],
  }),
  req({
    id: "tipo_gas",
    text: "¿Tipo de gas?",
    options: ["Gas Natural (red)", "Gas envasado (garrafa/tubo)", "No lo sé"],
  }),
  req({
    id: "ubicacion",
    text: "¿Dónde se instala?",
    options: ["Cocina", "Lavadero", "Baño", "Exterior/Balcón", "Otro"],
  }),
  req({
    id: "ventilacion",
    text: "¿El ambiente tiene rejillas de ventilación?",
    options: ["Sí, superior e inferior", "Solo una", "No tiene", "No lo sé"],
  }),
  req({
    id: "salida_humos",
    text: "¿El artefacto tiene salida al exterior?",
    options: ["Tiro balanceado", "Tiro natural", "Sin salida", "No lo sé"],
  }),
  req({
    id: "conex",
    text: "¿La conexión actual es?",
    options: ["Flexible", "Cañería rígida", "No hay conexión", "No lo sé"],
  }),
  req({
    id: "tenes_artefacto",
    text: "¿Ya tenés el artefacto comprado?",
    options: ["Sí", "No", "Necesito asesoramiento"],
  }),
  ...GENERIC_QUESTIONS,
];

const GAS_REVISION: Question[] = [
  req({
    id: "motivo",
    text: "¿Por qué solicitás la revisión?",
    options: [
      "Control preventivo",
      "Solicitud de empresa (Metrogas/Naturgy)",
      "Mudanza (alquilar/comprar)",
      "Sospecha de fuga",
      "Artefacto funciona mal",
    ],
  }),
  req({
    id: "cert",
    text: "¿Necesitás certificado/planilla?",
    options: ["Sí", "No", "No lo sé"],
  }),
  req({
    id: "artefactos",
    text: "¿Cuántos artefactos hay que revisar?",
    options: ["1", "2–3", "4 o más", "No lo sé"],
  }),
  req({
    id: "tipo_inst",
    text: "Tipo de propiedad",
    options: ["Casa", "Departamento", "PH", "Local", "No lo sé"],
  }),
  req({
    id: "planos",
    text: "¿Tenés planos/registro de la instalación?",
    options: ["Sí", "No", "No lo sé"],
  }),
  ...GENERIC_QUESTIONS,
];

/* -----------------------
   ALBAÑILERÍA - Question sets
------------------------ */

const ALBA_HUMEDAD: Question[] = [
  req({
    id: "altura",
    text: "¿A qué altura está la humedad?",
    options: ["Cerca del piso", "Mitad de pared", "Cerca del techo", "Varias alturas", "No lo sé"],
  }),
  req({
    id: "pared_exterior",
    text: "¿La pared da al exterior?",
    options: ["Sí", "No, interior", "Da al vecino", "No lo sé"],
  }),
  req({
    id: "estado",
    text: "¿Cómo está la superficie?",
    options: [
      "Solo mancha",
      "Pintura descascarada",
      "Moho/hongos",
      "Revoque cayéndose",
      "Salitre (polvillo blanco)",
    ],
  }),
  req({
    id: "lluvia",
    text: "¿Empeora con lluvia?",
    options: ["Sí", "No", "No lo sé"],
  }),
  req({
    id: "plomeria_cerca",
    text: "¿Hay baño/cocina del otro lado o cerca?",
    options: ["Sí", "No", "No lo sé"],
  }),
  req({
    id: "ya_reparado",
    text: "¿Se reparó antes?",
    options: ["Sí y volvió", "No", "No lo sé"],
  }),
  ...GENERIC_QUESTIONS,
];

const ALBA_PARED: Question[] = [
  req({
    id: "material",
    text: "¿De qué material es la pared?",
    options: ["Ladrillo", "Durlock/yeso", "Hormigón", "Bloque", "No lo sé"],
  }),
  req({
    id: "danio",
    text: "¿Qué tipo de daño tiene?",
    options: ["Grieta profunda", "Fisuras superficiales", "Agujero/golpe", "Desprendimiento revoque", "No lo sé"],
  }),
  req({
    id: "longitud",
    text: "Tamaño aproximado",
    options: ["<20 cm", "20–50 cm", "50 cm – 1 m", ">1 m", "No lo sé"],
  }),
  req({
    id: "zona",
    text: "¿Dónde está?",
    options: ["Esquina", "Cerca de puerta/ventana", "Centro pared", "Techo", "Exterior", "No lo sé"],
  }),
  req({
    id: "movimiento",
    text: "¿La grieta cambia (abre/cierra) con el tiempo?",
    options: ["Sí", "No", "No lo sé"],
  }),
  ...GENERIC_QUESTIONS,
];

const ALBA_PISO: Question[] = [
  req({
    id: "tipo",
    text: "¿Qué tipo de piso es?",
    options: ["Cerámica/porcelanato", "Madera/parquet", "Cemento", "Baldosa exterior", "No lo sé"],
  }),
  req({
    id: "problema",
    text: "¿Cuál es el problema?",
    options: ["Piezas sueltas/rotas", "Desnivelado", "Humedad que sube", "Juntas deterioradas", "No lo sé"],
  }),
  req({
    id: "area",
    text: "Área aproximada a intervenir",
    options: ["<1 m²", "1–3 m²", "3–10 m²", ">10 m²", "No lo sé"],
  }),
  req({
    id: "transito",
    text: "¿Es zona de alto tránsito?",
    options: ["Sí", "No", "No lo sé"],
  }),
  req({
    id: "bajo_piso",
    text: "¿Qué hay debajo?",
    options: ["Tierra", "Loza", "Otro ambiente", "No lo sé"],
  }),
  ...GENERIC_QUESTIONS,
];

/* -----------------------
   PINTURA - Question sets
------------------------ */

const PINT_UNA_HABITACION: Question[] = [
  req({
    id: "tamaño",
    text: "Tamaño aproximado",
    options: ["Chico (hasta 2x2)", "Medio (3x3)", "Grande (4x4+)", "No lo sé"],
  }),
  req({
    id: "alto",
    text: "Altura de techo",
    options: ["Hasta 2.5m", "2.5–3m", "Más de 3m", "No lo sé"],
  }),
  req({
    id: "techo_incluye",
    text: "¿Incluye techo?",
    options: ["Sí", "No", "No lo sé"],
  }),
  req({
    id: "puertas_ventanas",
    text: "¿Incluye puertas/ventanas/molduras?",
    options: ["Sí, todo", "Solo paredes", "Solo algunos", "No lo sé"],
  }),
  req({
    id: "muebles",
    text: "¿Hay que mover muebles?",
    options: ["Sí, muchos", "Algunos", "No, vacío", "No lo sé"],
  }),
  req({
    id: "estado",
    text: "Estado de paredes",
    options: ["Muy bien", "Arreglos menores", "Muchos huecos/grietas", "Humedad/manchas", "No lo sé"],
  }),
  req({
    id: "color",
    text: "¿Cambio de color?",
    options: ["Sí, cambio fuerte", "Sí, similar", "No, mismo color", "No lo sé"],
  }),
  req({
    id: "tipo_pintura",
    text: "¿Tipo de pintura deseada?",
    options: ["Látex interior", "Lavable", "Antihongos", "No lo sé/quiero recomendación"],
  }),
  ...GENERIC_QUESTIONS,
];

const PINT_EXTERIOR: Question[] = [
  req({
    id: "altura",
    text: "¿A qué altura hay que pintar?",
    options: ["Planta baja", "Primer piso", "2 pisos o más", "Altura compleja", "No lo sé"],
  }),
  req({
    id: "superficie",
    text: "Tipo de superficie",
    options: ["Revoque", "Ladrillo visto", "Texturado/Tarquini", "Madera", "Metal", "No lo sé"],
  }),
  req({
    id: "estado",
    text: "Estado actual",
    options: ["Bien", "Desgastado", "Descascarado", "Humedad/manchas", "No lo sé"],
  }),
  req({
    id: "acceso",
    text: "¿Se requiere andamio/escalera alta?",
    options: ["Sí", "No", "No lo sé"],
  }),
  req({
    id: "metraje",
    text: "Metros aproximados",
    options: ["Pequeño (frente)", "Medio (frente+laterales)", "Grande (casa completa)", "No lo sé"],
  }),
  ...GENERIC_QUESTIONS,
];

const PINT_TECHOS: Question[] = [
  req({
    id: "tipo",
    text: "Tipo de techo",
    options: ["Losa/hormigón", "Yeso/Durlock", "Madera", "No lo sé"],
  }),
  req({
    id: "manchas",
    text: "¿Hay manchas de humedad?",
    options: ["Sí activas", "Sí pero ya reparadas", "No", "No lo sé"],
  }),
  req({
    id: "fisuras",
    text: "¿Hay fisuras/grietas?",
    options: ["Sí", "No", "No lo sé"],
  }),
  req({
    id: "area",
    text: "Área aproximada",
    options: ["Chica", "Media", "Grande", "No lo sé"],
  }),
  ...GENERIC_QUESTIONS,
];

/* -----------------------
   CARPINTERÍA - Question sets
------------------------ */

const CARP_ARMADO_MUEBLE: Question[] = [
  req({
    id: "estado",
    text: "¿El mueble es nuevo en caja?",
    options: ["Sí", "No, es rearmar", "Parcialmente armado", "No lo sé"],
  }),
  req({
    id: "tipo",
    text: "Tipo de mueble",
    options: ["Ropero/placard grande", "Escritorio/mesa", "Biblioteca/cómoda", "Mueble cocina", "Otro"],
  }),
  req({
    id: "tamaño",
    text: "Tamaño aproximado",
    options: ["Chico", "Medio", "Grande", "Muy grande", "No lo sé"],
  }),
  req({
    id: "cantidad",
    text: "Cantidad de muebles",
    options: ["1", "2–3", "4 o más", "No lo sé"],
  }),
  req({
    id: "herramientas",
    text: "¿Tenés herramientas básicas?",
    options: ["Sí", "No, debe traer el profesional", "Tengo algunas"],
  }),
  req({
    id: "anclaje",
    text: "¿Requiere anclaje a pared?",
    options: ["Sí", "No", "No lo sé"],
  }),
  ...GENERIC_QUESTIONS,
];

const CARP_PUERTA: Question[] = [
  req({
    id: "tipo",
    text: "Tipo de puerta",
    options: ["Madera placa", "Madera maciza", "Metal/chapa", "Aluminio/vidrio", "No lo sé"],
  }),
  req({
    id: "problema",
    text: "¿Cuál es el problema?",
    options: ["Roza el piso", "No encastra", "Bisagras rotas", "Hinchada por humedad", "Cerradura falla", "No lo sé"],
  }),
  req({
    id: "roce",
    text: "Si roza, ¿dónde roza?",
    options: ["Abajo", "Arriba", "Lateral", "Marco", "No aplica / no lo sé"],
  }),
  req({
    id: "cierra",
    text: "¿Cierra con llave?",
    options: ["Sí", "No", "A veces", "No aplica / no lo sé"],
  }),
  req({
    id: "ambiente",
    text: "Ubicación",
    options: ["Interior", "Exterior", "Baño (humedad)", "Cocina", "No lo sé"],
  }),
  ...GENERIC_QUESTIONS,
];

const CARP_MUEBLE_REPARACION: Question[] = [
  req({
    id: "material",
    text: "Material del mueble",
    options: ["Melamina/MDF", "Madera maciza", "Pino", "Metal + madera", "No lo sé"],
  }),
  req({
    id: "que_se_rompio",
    text: "¿Qué se rompió?",
    options: ["Estructura/pata", "Puerta", "Cajón", "Correderas", "Bisagras", "Superficie/tapa", "No lo sé"],
  }),
  req({
    id: "grado",
    text: "Grado de daño",
    options: ["Leve", "Medio", "Se desarma/cede", "No lo sé"],
  }),
  req({
    id: "repuesto",
    text: "¿Tenés repuestos (bisagras/correderas/tornillos)?",
    options: ["Sí", "No", "Tengo algunos", "No lo sé"],
  }),
  req({
    id: "uso",
    text: "Uso del mueble",
    options: ["Diario intensivo", "Uso normal", "Poco uso", "No lo sé"],
  }),
  ...GENERIC_QUESTIONS,
];

/* -----------------------
   Diagnosis Data (FULL component export)
------------------------ */

export const DIAGNOSIS_DATA: Trade[] = [
  {
    id: "plomeria",
    label: "Plomería",
    icon: Droplet,
    color: "from-blue-500 to-cyan-500",
    problems: [
      {
        id: "p_canilla_gotea",
        label: "Canilla que gotea constantemente",
        questions: PLOM_CANILLA_GOTEA,
        minPhotos: 3,
        photoGuide: PHOTO_GUIDE_PLOMERIA,
      },
      {
        id: "p_perdida_agua",
        label: "Pérdida de agua en canilla / conexión",
        questions: PLOM_PERDIDA_AGUA_GENERAL,
        minPhotos: 3,
        photoGuide: PHOTO_GUIDE_PLOMERIA,
      },
      {
        id: "p_inodoro_pierde",
        label: "Inodoro pierde agua",
        questions: PLOM_INODORO_PIERDE,
        minPhotos: 3,
        photoGuide: PHOTO_GUIDE_PLOMERIA,
      },
      {
        id: "p_inodoro_no_carga",
        label: "Inodoro no carga agua",
        questions: PLOM_INODORO_NO_CARGA,
        minPhotos: 3,
        photoGuide: PHOTO_GUIDE_PLOMERIA,
      },
      {
        id: "p_inodoro_tapado",
        label: "Inodoro tapado",
        questions: PLOM_INODORO_TAPADO,
        minPhotos: 3,
        photoGuide: PHOTO_GUIDE_PLOMERIA,
      },
      {
        id: "p_desague_tapado",
        label: "Desagüe tapado (cocina / baño / lavadero)",
        questions: PLOM_DESAGUE_TAPADO,
        minPhotos: 3,
        photoGuide: PHOTO_GUIDE_PLOMERIA,
      },
      {
        id: "p_perdida_pared",
        label: "Pérdida de agua en pared o piso",
        questions: PLOM_PERDIDA_AGUA_GENERAL,
        minPhotos: 3,
        photoGuide: PHOTO_GUIDE_PLOMERIA,
      },
      {
        id: "p_presion_baja",
        label: "Baja presión de agua",
        questions: PLOM_PRESION_BAJA,
        minPhotos: 3,
        photoGuide: PHOTO_GUIDE_PLOMERIA,
      },
      {
        id: "p_cambio_griferia",
        label: "Cambio de grifería",
        questions: PLOM_CAMBIO_GRIFERIA,
        minPhotos: 3,
        photoGuide: PHOTO_GUIDE_PLOMERIA,
      },
      {
        id: "p_inst_lavarropas",
        label: "Instalación de lavarropas",
        questions: PLOM_INST_LAVARROPAS,
        minPhotos: 3,
        photoGuide: PHOTO_GUIDE_PLOMERIA,
      },
      {
        id: "p_cano_roto",
        label: "Caño roto / pinchado",
        questions: PLOM_PERDIDA_AGUA_GENERAL,
        minPhotos: 3,
        photoGuide: PHOTO_GUIDE_PLOMERIA,
      },
      {
        id: "p_filtracion_vecino",
        label: "Filtración de agua del vecino",
        questions: PLOM_PERDIDA_AGUA_GENERAL,
        minPhotos: 3,
        photoGuide: PHOTO_GUIDE_PLOMERIA,
      },
      {
        id: "p_termotanque_pierde",
        label: "Termotanque pierde agua (visible)",
        questions: PLOM_PERDIDA_AGUA_GENERAL,
        minPhotos: 3,
        photoGuide: PHOTO_GUIDE_PLOMERIA,
      },
    ],
  },
  {
    id: "electricidad",
    label: "Electricidad",
    icon: Zap,
    color: "from-yellow-400 to-orange-500",
    problems: [
      {
        id: "e_cortes_luz",
        label: "Cortes de luz en parte de la casa",
        questions: ELEC_CORTES_LUZ,
        minPhotos: 3,
        photoGuide: PHOTO_GUIDE_ELECTRICIDAD,
      },
      {
        id: "e_salta_termica",
        label: "Salta la térmica o disyuntor",
        questions: ELEC_SALTA_TERMICA,
        minPhotos: 3,
        photoGuide: PHOTO_GUIDE_ELECTRICIDAD,
      },
      {
        id: "e_toma_no_funciona",
        label: "Tomacorriente no funciona",
        questions: ELEC_TOMA_NO_FUNCIONA,
        minPhotos: 3,
        photoGuide: PHOTO_GUIDE_ELECTRICIDAD,
      },
      {
        id: "e_chispas",
        label: "Chispas en enchufe",
        questions: ELEC_CHISPAS_ENCHUFE,
        minPhotos: 3,
        photoGuide: PHOTO_GUIDE_ELECTRICIDAD,
      },
      {
        id: "e_cambio_enchufes",
        label: "Cambio de enchufes",
        questions: ELEC_CAMBIO_ENCHUFES,
        minPhotos: 3,
        photoGuide: PHOTO_GUIDE_ELECTRICIDAD,
      },
      {
        id: "e_cambio_interruptores",
        label: "Cambio de interruptores",
        questions: ELEC_CAMBIO_ENCHUFES,
        minPhotos: 3,
        photoGuide: PHOTO_GUIDE_ELECTRICIDAD,
      },
      {
        id: "e_inst_luminaria",
        label: "Instalación de luminaria",
        questions: ELEC_LUMINARIA,
        minPhotos: 3,
        photoGuide: PHOTO_GUIDE_ELECTRICIDAD,
      },
      {
        id: "e_inst_ventilador",
        label: "Instalación de ventilador de techo",
        questions: ELEC_LUMINARIA,
        minPhotos: 3,
        photoGuide: PHOTO_GUIDE_ELECTRICIDAD,
      },
      {
        id: "e_inst_tablero",
        label: "Instalación / mejora de tablero eléctrico",
        questions: ELEC_TABLERO,
        minPhotos: 3,
        photoGuide: PHOTO_GUIDE_ELECTRICIDAD,
      },
      {
        id: "e_cables_expuestos",
        label: "Cables expuestos",
        questions: [
          req({
            id: "donde",
            text: "¿Dónde están los cables expuestos?",
            options: ["Techo", "Pared", "Tablero", "Exterior", "No lo sé"],
          }),
          req({
            id: "riesgo",
            text: "¿Hay niños/mascotas cerca o riesgo de contacto?",
            options: ["Sí", "No", "No lo sé"],
          }),
          req({
            id: "mojado",
            text: "¿Están cerca de humedad/agua?",
            options: ["Sí", "No", "No lo sé"],
          }),
          ...GENERIC_QUESTIONS,
        ],
        minPhotos: 3,
        photoGuide: PHOTO_GUIDE_ELECTRICIDAD,
      },
      {
        id: "e_luz_parpadea",
        label: "Luz parpadea",
        questions: [
          req({
            id: "alcance",
            text: "¿Parpadea una luz o varias?",
            options: ["Una", "Varias del ambiente", "Varias de la casa", "No lo sé"],
          }),
          req({
            id: "tipo",
            text: "Tipo de lámpara",
            options: ["LED", "Bajo consumo", "Incandescente", "No lo sé"],
          }),
          req({
            id: "cuando",
            text: "¿Cuándo pasa más?",
            options: ["Al encender artefactos", "Al azar", "Con lluvia/humedad", "Siempre", "No lo sé"],
          }),
          req({
            id: "ruido",
            text: "¿Escuchás zumbido en tecla/aplique?",
            options: ["Sí", "No", "No lo sé"],
          }),
          ...GENERIC_QUESTIONS,
        ],
        minPhotos: 3,
        photoGuide: PHOTO_GUIDE_ELECTRICIDAD,
      },
      {
        id: "e_inst_toma_tierra",
        label: "Instalación de toma a tierra",
        questions: [
          req({
            id: "motivo",
            text: "¿Por qué la necesitás?",
            options: ["Seguridad general", "Aire acondicionado", "PC/Equipos", "Norma/inspección", "No lo sé"],
          }),
          req({
            id: "propiedad",
            text: "Tipo de propiedad",
            options: ["Casa", "Departamento", "PH", "Local", "No lo sé"],
          }),
          req({
            id: "tablero",
            text: "¿Tenés tablero accesible?",
            options: ["Sí", "No", "No lo sé"],
          }),
          ...GENERIC_QUESTIONS,
        ],
        minPhotos: 3,
        photoGuide: PHOTO_GUIDE_ELECTRICIDAD,
      },
      {
        id: "e_aumento_potencia",
        label: "Aumento de potencia",
        questions: ELEC_TABLERO,
        minPhotos: 3,
        photoGuide: PHOTO_GUIDE_ELECTRICIDAD,
      },
      {
        id: "e_inst_completa",
        label: "Instalación eléctrica completa",
        questions: ELEC_TABLERO,
        minPhotos: 3,
        photoGuide: PHOTO_GUIDE_ELECTRICIDAD,
      },
      {
        id: "e_revision_general",
        label: "Revisión eléctrica general",
        questions: [
          req({
            id: "objetivo",
            text: "¿Qué querés revisar principalmente?",
            options: ["Seguridad", "Tablero", "Enchufes", "Luces", "Todo", "No lo sé"],
          }),
          req({
            id: "problemas",
            text: "¿Hay síntomas actuales?",
            options: ["Salta térmica", "Olor a quemado", "Cortes", "Chispas", "No, preventivo"],
          }),
          ...GENERIC_QUESTIONS,
        ],
        minPhotos: 3,
        photoGuide: PHOTO_GUIDE_ELECTRICIDAD,
      },
    ],
  },
  {
    id: "gas",
    label: "Gas",
    icon: Flame,
    color: "from-orange-500 to-red-600",
    problems: [
      {
        id: "g_olor_gas",
        label: "Olor a gas",
        questions: GAS_OLOR,
        minPhotos: 3,
        photoGuide: PHOTO_GUIDE_GAS,
      },
      {
        id: "g_revision_inst",
        label: "Revisión de instalación de gas",
        questions: GAS_REVISION,
        minPhotos: 3,
        photoGuide: PHOTO_GUIDE_GAS,
      },
      {
        id: "g_inst_cocina",
        label: "Instalación de cocina",
        questions: GAS_INST_ARTEFACTO,
        minPhotos: 3,
        photoGuide: PHOTO_GUIDE_GAS,
      },
      {
        id: "g_inst_estufa",
        label: "Instalación de estufa",
        questions: GAS_INST_ARTEFACTO,
        minPhotos: 3,
        photoGuide: PHOTO_GUIDE_GAS,
      },
      {
        id: "g_inst_termotanque",
        label: "Instalación de termotanque",
        questions: GAS_INST_ARTEFACTO,
        minPhotos: 3,
        photoGuide: PHOTO_GUIDE_GAS,
      },
      {
        id: "g_cambio_flexible",
        label: "Cambio de flexible de gas",
        questions: [
          req({
            id: "artefacto",
            text: "¿De qué artefacto es el flexible?",
            options: ["Cocina", "Estufa", "Calefón", "Termotanque", "Otro", "No lo sé"],
          }),
          req({
            id: "motivo",
            text: "¿Por qué lo cambiás?",
            options: ["Vencido", "Rajado", "Olor", "Reubicación", "No lo sé"],
          }),
          req({
            id: "tipo_gas",
            text: "¿Tipo de gas?",
            options: ["Gas Natural", "Envasado", "No lo sé"],
          }),
          ...GENERIC_QUESTIONS,
        ],
        minPhotos: 3,
        photoGuide: PHOTO_GUIDE_GAS,
      },
      {
        id: "g_perdida_gas",
        label: "Pérdida de gas",
        questions: GAS_OLOR,
        minPhotos: 3,
        photoGuide: PHOTO_GUIDE_GAS,
      },
      {
        id: "g_adecuacion",
        label: "Adecuación a normativa",
        questions: GAS_REVISION,
        minPhotos: 3,
        photoGuide: PHOTO_GUIDE_GAS,
      },
      {
        id: "g_certificacion",
        label: "Certificación de gas",
        questions: GAS_REVISION,
        minPhotos: 3,
        photoGuide: PHOTO_GUIDE_GAS,
      },
      {
        id: "g_cambio_llave",
        label: "Cambio de llave de paso",
        questions: [
          req({
            id: "donde",
            text: "¿Qué llave hay que cambiar?",
            options: ["General", "De un artefacto", "En medidor", "No lo sé"],
          }),
          req({
            id: "por_que",
            text: "¿Por qué hay que cambiarla?",
            options: ["No cierra", "Gotea", "Está trabada", "Renovación", "No lo sé"],
          }),
          ...GENERIC_QUESTIONS,
        ],
        minPhotos: 3,
        photoGuide: PHOTO_GUIDE_GAS,
      },
      {
        id: "g_inst_calefon",
        label: "Instalación de calefón",
        questions: GAS_INST_ARTEFACTO,
        minPhotos: 3,
        photoGuide: PHOTO_GUIDE_GAS,
      },
      {
        id: "g_posible_fuga",
        label: "Revisión por posible fuga",
        questions: GAS_OLOR,
        minPhotos: 3,
        photoGuide: PHOTO_GUIDE_GAS,
      },
      {
        id: "g_reubicacion",
        label: "Reubicación de artefacto",
        questions: GAS_INST_ARTEFACTO,
        minPhotos: 3,
        photoGuide: PHOTO_GUIDE_GAS,
      },
      {
        id: "g_inst_horno",
        label: "Instalación de horno",
        questions: GAS_INST_ARTEFACTO,
        minPhotos: 3,
        photoGuide: PHOTO_GUIDE_GAS,
      },
      {
        id: "g_mantenimiento",
        label: "Mantenimiento preventivo",
        questions: GAS_REVISION,
        minPhotos: 3,
        photoGuide: PHOTO_GUIDE_GAS,
      },
    ],
  },
  {
    id: "albañileria",
    label: "Albañilería",
    icon: Hammer,
    color: "from-amber-600 to-orange-700",
    problems: [
      {
        id: "a_pared_agrietada",
        label: "Arreglo de pared agrietada",
        questions: ALBA_PARED,
        minPhotos: 3,
        photoGuide: PHOTO_GUIDE_ALBANILERIA,
      },
      {
        id: "a_humedad_pared",
        label: "Humedad en pared",
        questions: ALBA_HUMEDAD,
        minPhotos: 3,
        photoGuide: PHOTO_GUIDE_ALBANILERIA,
      },
      {
        id: "a_revoque",
        label: "Reparación de revoque",
        questions: ALBA_PARED,
        minPhotos: 3,
        photoGuide: PHOTO_GUIDE_ALBANILERIA,
      },
      {
        id: "a_pared_nueva",
        label: "Construcción de pared nueva",
        questions: [
          req({
            id: "longitud",
            text: "Largo aproximado de la pared",
            options: ["<2m", "2–4m", "4–8m", ">8m", "No lo sé"],
          }),
          req({
            id: "alto",
            text: "Altura aproximada",
            options: ["Hasta 2.5m", "2.5–3m", "Más de 3m", "No lo sé"],
          }),
          req({
            id: "tipo",
            text: "Tipo de pared",
            options: ["Ladrillo", "Bloque", "Durlock/yeso", "No lo sé"],
          }),
          req({
            id: "incluye_revoque",
            text: "¿Incluye revoque/terminación?",
            options: ["Sí", "No", "No lo sé"],
          }),
          req({
            id: "incluye_pintura",
            text: "¿Incluye pintura?",
            options: ["Sí", "No", "No lo sé"],
          }),
          ...GENERIC_QUESTIONS,
        ],
        minPhotos: 3,
        photoGuide: PHOTO_GUIDE_ALBANILERIA,
      },
      {
        id: "a_hueco",
        label: "Apertura de hueco",
        questions: [
          req({
            id: "para_que",
            text: "¿Para qué es el hueco?",
            options: ["Puerta", "Ventana", "Pasa cables/caños", "Nicho", "Otro"],
          }),
          req({
            id: "material",
            text: "Material de la pared",
            options: ["Ladrillo", "Hormigón", "Durlock", "No lo sé"],
          }),
          req({
            id: "tamano",
            text: "Tamaño del hueco",
            options: ["Chico", "Medio", "Grande", "No lo sé"],
          }),
          req({
            id: "estructura",
            text: "¿Es pared estructural?",
            options: ["Sí", "No", "No lo sé"],
          }),
          ...GENERIC_QUESTIONS,
        ],
        minPhotos: 3,
        photoGuide: PHOTO_GUIDE_ALBANILERIA,
      },
      {
        id: "a_cierre_hueco",
        label: "Cierre de hueco",
        questions: [
          req({
            id: "tamano",
            text: "Tamaño del hueco a cerrar",
            options: ["Chico", "Medio", "Grande", "No lo sé"],
          }),
          req({
            id: "terminacion",
            text: "Terminación deseada",
            options: ["Solo cierre", "Cierre + revoque", "Listo para pintar", "No lo sé"],
          }),
          req({
            id: "material",
            text: "Material de pared",
            options: ["Ladrillo", "Durlock", "Hormigón", "No lo sé"],
          }),
          ...GENERIC_QUESTIONS,
        ],
        minPhotos: 3,
        photoGuide: PHOTO_GUIDE_ALBANILERIA,
      },
      {
        id: "a_reparacion_piso",
        label: "Reparación de piso",
        questions: ALBA_PISO,
        minPhotos: 3,
        photoGuide: PHOTO_GUIDE_ALBANILERIA,
      },
      {
        id: "a_colocacion_ceramicos",
        label: "Colocación de cerámicos",
        questions: [
          ...ALBA_PISO,
          req({
            id: "tiene_material",
            text: "¿Tenés las cerámicas/pegamento?",
            options: ["Sí", "No", "Parcial", "Necesito asesoramiento"],
          }),
        ],
        minPhotos: 3,
        photoGuide: PHOTO_GUIDE_ALBANILERIA,
      },
      {
        id: "a_escalones",
        label: "Reparación de escalones",
        questions: [
          req({
            id: "tipo",
            text: "Tipo de escalera",
            options: ["Cemento", "Cerámica", "Madera", "Metal", "No lo sé"],
          }),
          req({
            id: "problema",
            text: "¿Qué problema tiene?",
            options: ["Escalón roto", "Escalón flojo", "Desnivel", "Revestimiento suelto", "No lo sé"],
          }),
          req({
            id: "cantidad",
            text: "Cantidad de escalones a intervenir",
            options: ["1", "2–3", "4–10", ">10", "No lo sé"],
          }),
          ...GENERIC_QUESTIONS,
        ],
        minPhotos: 3,
        photoGuide: PHOTO_GUIDE_ALBANILERIA,
      },
      {
        id: "a_nivelacion",
        label: "Nivelación de piso",
        questions: ALBA_PISO,
        minPhotos: 3,
        photoGuide: PHOTO_GUIDE_ALBANILERIA,
      },
      {
        id: "a_contrapiso",
        label: "Contrapiso",
        questions: [
          req({
            id: "area",
            text: "Área aproximada",
            options: ["<5 m²", "5–15 m²", "15–40 m²", ">40 m²", "No lo sé"],
          }),
          req({
            id: "interior_exterior",
            text: "¿Interior o exterior?",
            options: ["Interior", "Exterior", "No lo sé"],
          }),
          req({
            id: "uso",
            text: "Uso final",
            options: ["Cerámica/porcelanato", "Cemento alisado", "Piso flotante/madera", "No lo sé"],
          }),
          ...GENERIC_QUESTIONS,
        ],
        minPhotos: 3,
        photoGuide: PHOTO_GUIDE_ALBANILERIA,
      },
      {
        id: "a_arreglo_techo",
        label: "Arreglo de techo",
        questions: [
          req({
            id: "tipo",
            text: "Tipo de techo",
            options: ["Losa", "Chapa", "Tejas", "Madera", "No lo sé"],
          }),
          req({
            id: "problema",
            text: "Problema principal",
            options: ["Filtra agua", "Grietas", "Desprendimiento", "No lo sé"],
          }),
          req({
            id: "lluvia",
            text: "¿Filtra con lluvia?",
            options: ["Sí", "No", "No lo sé"],
          }),
          req({
            id: "acceso",
            text: "Acceso al techo",
            options: ["Fácil", "Necesita escalera alta", "Difícil/peligroso", "No lo sé"],
          }),
          ...GENERIC_QUESTIONS,
        ],
        minPhotos: 3,
        photoGuide: PHOTO_GUIDE_ALBANILERIA,
      },
      {
        id: "a_filtraciones",
        label: "Filtraciones",
        questions: ALBA_HUMEDAD,
        minPhotos: 3,
        photoGuide: PHOTO_GUIDE_ALBANILERIA,
      },
      {
        id: "a_remodelacion",
        label: "Pequeña remodelación",
        questions: [
          req({
            id: "zona",
            text: "¿Qué ambiente?",
            options: ["Baño", "Cocina", "Living", "Dormitorio", "Exterior", "Otro"],
          }),
          req({
            id: "alcance",
            text: "Alcance",
            options: ["Solo arreglos", "Cambios medianos", "Remodelación grande", "No lo sé"],
          }),
          req({
            id: "incluye_instalaciones",
            text: "¿Incluye plomería/electricidad?",
            options: ["Sí", "No", "No lo sé"],
          }),
          ...GENERIC_QUESTIONS,
        ],
        minPhotos: 3,
        photoGuide: PHOTO_GUIDE_ALBANILERIA,
      },
      {
        id: "a_estructural_menor",
        label: "Reparación estructural menor",
        questions: ALBA_PARED,
        minPhotos: 3,
        photoGuide: PHOTO_GUIDE_ALBANILERIA,
      },
    ],
  },
  {
    id: "pintura",
    label: "Pintura",
    icon: PaintBucket,
    color: "from-pink-500 to-rose-500",
    problems: [
      {
        id: "pi_interior_completa",
        label: "Pintura interior completa",
        questions: [
          ...PINT_UNA_HABITACION,
          req({
            id: "cantidad_ambientes",
            text: "¿Cuántos ambientes?",
            options: ["1", "2–3", "4–6", "7 o más", "No lo sé"],
          }),
        ],
        minPhotos: 3,
        photoGuide: PHOTO_GUIDE_PINTURA,
      },
      {
        id: "pi_una_habitacion",
        label: "Pintura de una habitación",
        questions: PINT_UNA_HABITACION,
        minPhotos: 3,
        photoGuide: PHOTO_GUIDE_PINTURA,
      },
      {
        id: "pi_exterior",
        label: "Pintura de exterior",
        questions: PINT_EXTERIOR,
        minPhotos: 3,
        photoGuide: PHOTO_GUIDE_PINTURA,
      },
      {
        id: "pi_techo",
        label: "Pintura de techo",
        questions: PINT_TECHOS,
        minPhotos: 3,
        photoGuide: PHOTO_GUIDE_PINTURA,
      },
      {
        id: "pi_humedad",
        label: "Reparación y pintura por humedad",
        questions: [
          ...ALBA_HUMEDAD,
          req({
            id: "solo_pintura",
            text: "¿Querés solo pintura o también reparación de base?",
            options: ["Solo pintar", "Reparar + pintar", "No lo sé"],
          }),
        ],
        minPhotos: 3,
        photoGuide: PHOTO_GUIDE_PINTURA,
      },
      {
        id: "pi_cambio_color",
        label: "Cambio de color",
        questions: PINT_UNA_HABITACION,
        minPhotos: 3,
        photoGuide: PHOTO_GUIDE_PINTURA,
      },
      {
        id: "pi_pintura_vieja",
        label: "Pintura sobre pintura vieja",
        questions: [
          ...PINT_UNA_HABITACION,
          req({
            id: "estado_pintura_vieja",
            text: "Estado de la pintura vieja",
            options: ["Bien adherida", "Descascarada", "Con ampollas", "No lo sé"],
          }),
        ],
        minPhotos: 3,
        photoGuide: PHOTO_GUIDE_PINTURA,
      },
      {
        id: "pi_rejas",
        label: "Pintura de rejas",
        questions: [
          req({
            id: "estado",
            text: "Estado del metal",
            options: ["Bien", "Óxido leve", "Óxido fuerte", "Pintura saltada", "No lo sé"],
          }),
          req({
            id: "cantidad",
            text: "Cantidad aproximada",
            options: ["Pocas (1–2)", "Varias (3–6)", "Muchas (7+)", "No lo sé"],
          }),
          req({
            id: "interior_exterior",
            text: "¿Interior o exterior?",
            options: ["Exterior", "Interior", "Ambas", "No lo sé"],
          }),
          ...GENERIC_QUESTIONS,
        ],
        minPhotos: 3,
        photoGuide: PHOTO_GUIDE_PINTURA,
      },
      {
        id: "pi_puertas",
        label: "Pintura de puertas",
        questions: [
          req({
            id: "material",
            text: "Material de la puerta",
            options: ["Madera", "Metal", "Placa", "No lo sé"],
          }),
          req({
            id: "cantidad",
            text: "Cantidad",
            options: ["1", "2–3", "4–6", "7+", "No lo sé"],
          }),
          req({
            id: "acabado",
            text: "Acabado deseado",
            options: ["Mate", "Satinado", "Brillante", "No lo sé"],
          }),
          ...GENERIC_QUESTIONS,
        ],
        minPhotos: 3,
        photoGuide: PHOTO_GUIDE_PINTURA,
      },
      {
        id: "pi_ventanas",
        label: "Pintura de ventanas",
        questions: [
          req({
            id: "material",
            text: "Material",
            options: ["Metal", "Madera", "Aluminio", "No lo sé"],
          }),
          req({
            id: "cantidad",
            text: "Cantidad",
            options: ["1–2", "3–6", "7+", "No lo sé"],
          }),
          req({
            id: "estado",
            text: "Estado",
            options: ["Bien", "Óxido", "Pintura saltada", "No lo sé"],
          }),
          ...GENERIC_QUESTIONS,
        ],
        minPhotos: 3,
        photoGuide: PHOTO_GUIDE_PINTURA,
      },
      {
        id: "pi_fachada",
        label: "Pintura de fachada",
        questions: PINT_EXTERIOR,
        minPhotos: 3,
        photoGuide: PHOTO_GUIDE_PINTURA,
      },
      {
        id: "pi_local",
        label: "Pintura de local comercial",
        questions: [
          ...PINT_UNA_HABITACION,
          req({
            id: "horario_trabajo",
            text: "¿Se puede trabajar en horario comercial?",
            options: ["Sí", "No, solo fuera de horario", "No lo sé"],
          }),
        ],
        minPhotos: 3,
        photoGuide: PHOTO_GUIDE_PINTURA,
      },
      {
        id: "pi_superficie",
        label: "Preparación de superficie",
        questions: [
          req({
            id: "tipo",
            text: "¿Qué hay que preparar?",
            options: ["Pared interior", "Techo", "Exterior", "Madera", "Metal", "No lo sé"],
          }),
          req({
            id: "estado",
            text: "Estado actual",
            options: ["Manchas", "Humedad", "Grietas", "Descascarado", "Todo bien", "No lo sé"],
          }),
          req({
            id: "incluye_pintura",
            text: "¿Incluye pintura después?",
            options: ["Sí", "No, solo preparación", "No lo sé"],
          }),
          ...GENERIC_QUESTIONS,
        ],
        minPhotos: 3,
        photoGuide: PHOTO_GUIDE_PINTURA,
      },
      {
        id: "pi_sellado",
        label: "Sellado y pintura",
        questions: PINT_EXTERIOR,
        minPhotos: 3,
        photoGuide: PHOTO_GUIDE_PINTURA,
      },
      {
        id: "pi_retoques",
        label: "Retoques puntuales",
        questions: [
          req({
            id: "que",
            text: "¿Qué retoque es?",
            options: ["Manchas", "Grietas pequeñas", "Golpes", "Humedad ya reparada", "No lo sé"],
          }),
          req({
            id: "cantidad",
            text: "Cantidad de zonas",
            options: ["1", "2–3", "4–10", "Muchas", "No lo sé"],
          }),
          ...GENERIC_QUESTIONS,
        ],
        minPhotos: 3,
        photoGuide: PHOTO_GUIDE_PINTURA,
      },
    ],
  },
  {
    id: "carpinteria",
    label: "Carpintería",
    icon: Box,
    color: "from-amber-800 to-orange-950",
    problems: [
      {
        id: "c_reparacion_puerta",
        label: "Reparación de puerta",
        questions: CARP_PUERTA,
        minPhotos: 3,
        photoGuide: PHOTO_GUIDE_CARPINTERIA,
      },
      {
        id: "c_ajuste_puerta",
        label: "Ajuste de puerta",
        questions: CARP_PUERTA,
        minPhotos: 3,
        photoGuide: PHOTO_GUIDE_CARPINTERIA,
      },
      {
        id: "c_puerta_no_cierra",
        label: "Puerta no cierra",
        questions: CARP_PUERTA,
        minPhotos: 3,
        photoGuide: PHOTO_GUIDE_CARPINTERIA,
      },
      {
        id: "c_armado_mueble",
        label: "Armado de mueble",
        questions: CARP_ARMADO_MUEBLE,
        minPhotos: 3,
        photoGuide: PHOTO_GUIDE_CARPINTERIA,
      },
      {
        id: "c_reparacion_mueble",
        label: "Reparación de mueble",
        questions: CARP_MUEBLE_REPARACION,
        minPhotos: 3,
        photoGuide: PHOTO_GUIDE_CARPINTERIA,
      },
      {
        id: "c_mueble_medida",
        label: "Mueble a medida",
        questions: [
          req({
            id: "tipo",
            text: "¿Qué querés hacer a medida?",
            options: ["Placard", "Bajo mesada", "Estantes", "Escritorio", "Biblioteca", "Otro"],
          }),
          req({
            id: "medidas",
            text: "¿Tenés medidas tomadas?",
            options: ["Sí", "No", "Parcial"],
          }),
          req({
            id: "material",
            text: "Material deseado",
            options: ["Melamina", "Madera", "MDF laqueado", "No lo sé"],
          }),
          req({
            id: "acabado",
            text: "Acabado",
            options: ["Básico", "Intermedio", "Premium", "No lo sé"],
          }),
          ...GENERIC_QUESTIONS,
        ],
        minPhotos: 3,
        photoGuide: PHOTO_GUIDE_CARPINTERIA,
      },
      {
        id: "c_estantes",
        label: "Colocación de estantes",
        questions: [
          req({
            id: "cantidad",
            text: "Cantidad de estantes",
            options: ["1", "2–3", "4–6", "7+", "No lo sé"],
          }),
          req({
            id: "material_pared",
            text: "Material de pared",
            options: ["Ladrillo", "Durlock", "Hormigón", "No lo sé"],
          }),
          req({
            id: "carga",
            text: "¿Qué peso soportarán?",
            options: ["Liviano (decoración)", "Medio (libros)", "Pesado", "No lo sé"],
          }),
          req({
            id: "tenes_estantes",
            text: "¿Ya tenés los estantes?",
            options: ["Sí", "No", "Necesito asesoramiento"],
          }),
          ...GENERIC_QUESTIONS,
        ],
        minPhotos: 3,
        photoGuide: PHOTO_GUIDE_CARPINTERIA,
      },
      {
        id: "c_cajones",
        label: "Reparación de cajones",
        questions: CARP_MUEBLE_REPARACION,
        minPhotos: 3,
        photoGuide: PHOTO_GUIDE_CARPINTERIA,
      },
      {
        id: "c_bisagras",
        label: "Cambio de bisagras",
        questions: CARP_MUEBLE_REPARACION,
        minPhotos: 3,
        photoGuide: PHOTO_GUIDE_CARPINTERIA,
      },
      {
        id: "c_correderas",
        label: "Cambio de correderas",
        questions: CARP_MUEBLE_REPARACION,
        minPhotos: 3,
        photoGuide: PHOTO_GUIDE_CARPINTERIA,
      },
      {
        id: "c_placard",
        label: "Ajuste de placard",
        questions: [
          req({
            id: "tipo",
            text: "Tipo de placard",
            options: ["Puertas corredizas", "Puertas batientes", "Mixto", "No lo sé"],
          }),
          req({
            id: "problema",
            text: "¿Qué falla?",
            options: ["No corre", "Se sale de guía", "Roza", "Cierra mal", "No lo sé"],
          }),
          req({
            id: "cantidad",
            text: "Cantidad de puertas",
            options: ["1", "2", "3–4", "5+", "No lo sé"],
          }),
          ...GENERIC_QUESTIONS,
        ],
        minPhotos: 3,
        photoGuide: PHOTO_GUIDE_CARPINTERIA,
      },
      {
        id: "c_marcos",
        label: "Colocación de marcos",
        questions: [
          req({
            id: "tipo",
            text: "¿Qué marco es?",
            options: ["Puerta", "Ventana", "Otro", "No lo sé"],
          }),
          req({
            id: "material",
            text: "Material",
            options: ["Madera", "Metal", "Aluminio", "No lo sé"],
          }),
          req({
            id: "nuevo",
            text: "¿Es instalación nueva o reemplazo?",
            options: ["Nueva", "Reemplazo", "No lo sé"],
          }),
          ...GENERIC_QUESTIONS,
        ],
        minPhotos: 3,
        photoGuide: PHOTO_GUIDE_CARPINTERIA,
      },
      {
        id: "c_ventana",
        label: "Reparación de ventana",
        questions: [
          req({
            id: "material",
            text: "Material",
            options: ["Aluminio", "Madera", "Hierro", "PVC", "No lo sé"],
          }),
          req({
            id: "problema",
            text: "¿Qué pasa?",
            options: ["No corre", "No cierra", "Entra aire/agua", "Vidrio roto", "Herrajes", "No lo sé"],
          }),
          req({
            id: "tipo",
            text: "Tipo de ventana",
            options: ["Corrediza", "Batiente", "Proyectante", "Paño fijo", "No lo sé"],
          }),
          ...GENERIC_QUESTIONS,
        ],
        minPhotos: 3,
        photoGuide: PHOTO_GUIDE_CARPINTERIA,
      },
      {
        id: "c_cerradura",
        label: "Instalación de cerradura",
        questions: [
          req({
            id: "puerta",
            text: "Tipo de puerta",
            options: ["Madera", "Metal", "Aluminio", "No lo sé"],
          }),
          req({
            id: "tipo_cerr",
            text: "Tipo de cerradura",
            options: ["Común", "Doble paleta", "Cerrojo", "Digital", "No lo sé"],
          }),
          req({
            id: "tenes",
            text: "¿Ya la compraste?",
            options: ["Sí", "No", "Necesito recomendación"],
          }),
          req({
            id: "reemplazo",
            text: "¿Es nueva o reemplazo?",
            options: ["Nueva", "Reemplazo", "No lo sé"],
          }),
          ...GENERIC_QUESTIONS,
        ],
        minPhotos: 3,
        photoGuide: PHOTO_GUIDE_CARPINTERIA,
      },
      {
        id: "c_estructural_menor",
        label: "Reparación estructural menor",
        questions: CARP_MUEBLE_REPARACION,
        minPhotos: 3,
        photoGuide: PHOTO_GUIDE_CARPINTERIA,
      },
    ],
  },
];
