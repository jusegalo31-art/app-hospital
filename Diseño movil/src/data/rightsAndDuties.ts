/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface DutyItem {
  id: string;
  letter: 'D' | 'A' | 'R';
  title: string;
  shortDesc: string;
  fullDesc: string;
  practicalTip: string;
  category: 'duty';
  iconName: string;
}

export interface RightItem {
  id: string;
  letter: 'R' | 'E' | 'C' | 'I' | 'B' | 'R';
  index: number;
  title: string;
  shortDesc: string;
  fullDesc: string;
  practicalTip: string;
  category: 'right';
  iconName: string;
}

export interface ChallengeCard {
  id: string;
  text: string;
  correctCategory: 'DAR' | 'RECIBIR';
  explanation: string;
  relatedCode: string;
  itemTitle: string;
}

export interface CaseDilemma {
  id: string;
  context: 'Urgencias' | 'Consulta Externa' | 'Hospitalización' | 'Atención SIAU';
  situation: string;
  question: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    feedback: string;
  }[];
  lesson: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

// DAR: Los 3 Deberes del Usuario (E.S.E. Hospital Universitario Erasmo Meoz)
export const DUTIES_DATA: DutyItem[] = [
  {
    id: 'duty-d',
    letter: 'D',
    title: 'Documentación y puntualidad',
    shortDesc: 'Presentar documentos verdaderos y llegar a tiempo a citas y procedimientos.',
    fullDesc: 'Debo presentar documentación real y asistir puntualmente a las consultas y procedimientos médicos asignados.',
    practicalTip: 'Llega con 20 minutos de anticipación y ten a mano tu documento de identidad vigente y autorizaciones requeridas.',
    category: 'duty',
    iconName: 'FileText',
  },
  {
    id: 'duty-a',
    letter: 'A',
    title: 'Amabilidad y respeto',
    shortDesc: 'Tratar con cordialidad y dignidad a todo el personal de salud y demás usuarios.',
    fullDesc: 'Debo tratar a todas las personas con amabilidad y respeto, construyendo un ambiente seguro y humanizado.',
    practicalTip: 'El trato digno es recíproco. Dirígete con calma y consideración al personal médico, de enfermería, administrativo y a otros pacientes.',
    category: 'duty',
    iconName: 'HeartHandshake',
  },
  {
    id: 'duty-r',
    letter: 'R',
    title: 'Reconocimiento de las normas',
    shortDesc: 'Cumplir los reglamentos institucionales, horarios y normas de bioseguridad.',
    fullDesc: 'Debo reconocer y cumplir las normas y reglamentos de la institución para garantizar la seguridad de todos.',
    practicalTip: 'Respeta los horarios de visita, el uso de tapabocas en áreas restringidas y la prohibición de fumar en el hospital.',
    category: 'duty',
    iconName: 'ShieldCheck',
  },
];

// RECIBIR: Los 7 Derechos del Usuario (E.S.E. Hospital Universitario Erasmo Meoz)
export const RIGHTS_DATA: RightItem[] = [
  {
    id: 'right-r1',
    letter: 'R',
    index: 1,
    title: 'Recibir atención integral y oportuna',
    shortDesc: 'Atención continua, de calidad y con enfoque diferencial prioritario.',
    fullDesc: 'Recibir atención integral, oportuna y de calidad en salud, así como un trato prioritario y diferencial según mi condición.',
    practicalTip: 'Si tienes alguna discapacidad, eres adulto mayor, menor de edad o gestante, el hospital cuenta con rutas prioritarias de triage.',
    category: 'right',
    iconName: 'Activity',
  },
  {
    id: 'right-e',
    letter: 'E',
    index: 2,
    title: 'Expresar opiniones e inconformidades',
    shortDesc: 'Manifestar libremente peticiones, quejas, reclamos, sugerencias o felicitaciones.',
    fullDesc: 'Expresar mis opiniones e inconformidades de forma respetuosa a través de los canales institucionales habilitados.',
    practicalTip: 'Puedes depositar tu opinión en los buzones de sugerencias o acercarte a la oficina del SIAU en la entrada principal sin represalias.',
    category: 'right',
    iconName: 'MessageSquare',
  },
  {
    id: 'right-c',
    letter: 'C',
    index: 3,
    title: 'Consentimiento y segunda opinión',
    shortDesc: 'Autorización previa informada para tratamientos y derecho a otro concepto médico.',
    fullDesc: 'Dar mi consentimiento previo para tratamientos y estudios de investigación, así como solicitar una segunda opinión médica.',
    practicalTip: 'Nadie puede someterte a cirugías o procedimientos sin explicarte previamente riesgos, beneficios y alternativas.',
    category: 'right',
    iconName: 'ClipboardCheck',
  },
  {
    id: 'right-i1',
    letter: 'I',
    index: 4,
    title: 'Información clara y confidencial',
    shortDesc: 'Explicaciones en lenguaje sencillo y estricta privacidad de tu historia clínica.',
    fullDesc: 'Recibir información clara y confidencial sobre mi diagnóstico, pronóstico y tratamiento.',
    practicalTip: 'Si no entiendes algún término médico, tienes todo el derecho de pedirle al médico o enfermera que te lo explique de manera sencilla.',
    category: 'right',
    iconName: 'HelpCircle',
  },
  {
    id: 'right-b',
    letter: 'B',
    index: 5,
    title: 'Beneficio de acompañamiento',
    shortDesc: 'Contar con un acompañante familiar y apoyo psicosocial o espiritual si lo requieres.',
    fullDesc: 'Beneficiarme de un acompañante y de apoyo psicosocial o religioso cuando mi condición y el servicio lo permitan.',
    practicalTip: 'Especialmente vital para pacientes pediátricos, adultos mayores y personas en estado vulnerable según normas de cada servicio.',
    category: 'right',
    iconName: 'Users',
  },
  {
    id: 'right-i2',
    letter: 'I',
    index: 6,
    title: 'Identificación por mi propio nombre',
    shortDesc: 'Conocer quién te atiende y ser llamado respetuosamente por tu nombre.',
    fullDesc: 'Conocer el nombre de quien me atiende y ser llamado por mi propio nombre, nunca por número de cama o diagnóstico.',
    practicalTip: 'El personal porta carné visible. Eres una persona digna con nombre propio, no la "cama 12" ni "el caso de apendicitis".',
    category: 'right',
    iconName: 'UserCheck',
  },
  {
    id: 'right-r2',
    letter: 'R',
    index: 7,
    title: 'Respeto y trato humanizado',
    shortDesc: 'Dignidad absoluta sin discriminación económica, cultural, de género o credo.',
    fullDesc: 'Recibir respeto y trato humanizado frente a mi condición socioeconómica, cultural e ideológica, y gozar de los derechos de ley.',
    practicalTip: 'El personal médico y asistencial debe brindarte un trato cálido, empático, sin prejuicios ni tratos despectivos.',
    category: 'right',
    iconName: 'Sparkles',
  },
];

// Cards for Reto 1: Clasificación DAR vs RECIBIR
export const CHALLENGE_CARDS: ChallengeCard[] = [
  {
    id: 'card-1',
    text: 'Tratar con amabilidad y respeto al personal médico, de enfermería y a los demás usuarios.',
    correctCategory: 'DAR',
    explanation: '¡Exacto! El trato digno y cordial es un deber primordial (A de DAR) que todos debemos aportar para una convivencia sana.',
    relatedCode: 'A (Amabilidad)',
    itemTitle: 'Amabilidad y respeto',
  },
  {
    id: 'card-2',
    text: 'Recibir explicaciones claras y en palabras sencillas sobre mi diagnóstico y tratamiento.',
    correctCategory: 'RECIBIR',
    explanation: '¡Muy bien! Tienes el derecho fundamental a que el equipo médico te hable con claridad y sin tecnicismos difíciles (I de RECIBIR).',
    relatedCode: 'I (Información clara)',
    itemTitle: 'Información clara y confidencial',
  },
  {
    id: 'card-3',
    text: 'Presentar mi cédula o documento de identidad real y llegar a la hora indicada para mi cita.',
    correctCategory: 'DAR',
    explanation: '¡Correcto! Entregar documentos auténticos y ser puntual es tu deber (D de DAR) para garantizar la seguridad clínica.',
    relatedCode: 'D (Documentación)',
    itemTitle: 'Documentación y puntualidad',
  },
  {
    id: 'card-4',
    text: 'Estar acompañado por un familiar y recibir apoyo emocional o espiritual durante mi atención.',
    correctCategory: 'RECIBIR',
    explanation: '¡Excelente! El acompañamiento familiar y psicosocial es un derecho humano esencial (B de RECIBIR) cuando el servicio lo permite.',
    relatedCode: 'B (Beneficio de acompañante)',
    itemTitle: 'Beneficio de acompañamiento',
  },
  {
    id: 'card-5',
    text: 'Cumplir las normas de bioseguridad, horarios de visita y reglamentos del hospital.',
    correctCategory: 'DAR',
    explanation: '¡Así es! Respetar las normas institucionales (R de DAR) previene infecciones y cuida la salud de todos los hospitalizados.',
    relatedCode: 'R (Reconocimiento)',
    itemTitle: 'Reconocimiento de las normas',
  },
  {
    id: 'card-6',
    text: 'Poder solicitar una segunda opinión médica antes de autorizar una intervención quirúrgica.',
    correctCategory: 'RECIBIR',
    explanation: '¡Perfecto! Tienes pleno derecho a un segundo concepto médico y a firmar tu consentimiento informado (C de RECIBIR).',
    relatedCode: 'C (Consentimiento)',
    itemTitle: 'Consentimiento y segunda opinión',
  },
];

// Dilemas de la vida real para Reto 2
export const CASE_DILEMMAS: CaseDilemma[] = [
  {
    id: 'case-1',
    context: 'Urgencias',
    situation: 'Don Carlos llega a Urgencias. Al ser valorado en Triage, observa que pasan primero a una persona que llegó después de él pero tiene dificultad respiratoria severa.',
    question: '¿Qué principio de derechos y deberes se aplica en esta situación?',
    options: [
      {
        id: 'opt-1a',
        text: 'Don Carlos debe exigir que lo atiendan a él primero porque llegó antes por orden de llegada.',
        isCorrect: false,
        feedback: 'No es correcto. En el área de urgencias la atención se clasifica por Triage clínico de riesgo vital, no por estricto orden de llegada.',
      },
      {
        id: 'opt-1b',
        text: 'El hospital aplica el derecho a la atención integral y prioritaria según la gravedad clínica del paciente (RECIBIR), y Don Carlos colabora respetando las normas del servicio (DAR).',
        isCorrect: true,
        feedback: '¡Exacto! El Triage clasifica la urgencia por riesgo de vida. Reconocer esta norma es un deber y garantiza que los casos críticos no fallezcan.',
      },
      {
        id: 'opt-1c',
        text: 'El personal de salud está cometiendo una falta y Don Carlos debe elevar una queja inmediata.',
        isCorrect: false,
        feedback: 'No. El personal está cumpliendo con los protocolos de salvamento del Triage nacional normado por el Ministerio de Salud.',
      },
    ],
    lesson: 'En Urgencias se atiende por gravedad y prioridad vital (Triage), protegiendo la vida como bien supremo.',
  },
  {
    id: 'case-2',
    context: 'Consulta Externa',
    situation: 'Durante su consulta, la doctora le habla a Mariana con muchos términos técnicos y siglas que ella no logra comprender.',
    question: '¿Qué derecho tiene Mariana y cómo debe actuar con base en sus deberes?',
    options: [
      {
        id: 'opt-2a',
        text: 'Quedarse callada por pena y luego buscar en internet por su cuenta.',
        isCorrect: false,
        feedback: 'Buscar en fuentes dudosas puede generar temores infundados. El médico tiene la obligación ética y legal de aclarar todo.',
      },
      {
        id: 'opt-2b',
        text: 'Gritar a la profesional acusándola de mala atención frente a la sala de espera.',
        isCorrect: false,
        feedback: 'El deber de amabilidad y respeto exige comunicarse asertivamente y sin agresiones.',
      },
      {
        id: 'opt-2c',
        text: 'Ejercer su derecho a la Información Clara pidiendo amablemente que le explique en palabras sencillas el diagnóstico y cómo tomar su medicina.',
        isCorrect: true,
        feedback: '¡Correcto! Tienes el derecho fundamental a entender plenamente tu estado de salud y prescripciones en un lenguaje accesible.',
      },
    ],
    lesson: 'La información clara es un derecho; pedir explicaciones respetuosamente empodera tu autocuidado.',
  },
  {
    id: 'case-3',
    context: 'Hospitalización',
    situation: 'Un enfermero entra a la habitación y llama a la paciente diciendo: "¿Cómo sigue la abuelita de la cama 4?". La paciente prefiere que la llamen por su nombre.',
    question: '¿Cuál es el derecho que respalda a la paciente en este caso?',
    options: [
      {
        id: 'opt-3a',
        text: 'Derecho a la Identificación por mi propio nombre y a un trato humanizado digno y personalizado.',
        isCorrect: true,
        feedback: '¡Excelente! Todo usuario tiene derecho a conocer el nombre del profesional y a ser llamado siempre por su nombre propio.',
      },
      {
        id: 'opt-3b',
        text: 'No tiene derecho a quejarse porque "abuelita" es una palabra de cariño común.',
        isCorrect: false,
        feedback: 'Aunque no haya mala intención, la atención humanizada exige respetar la identidad y no reducir a la persona a un número de cama ni a un apodo.',
      },
      {
        id: 'opt-3c',
        text: 'Solo aplica si la paciente está en una habitación privada de pago.',
        isCorrect: false,
        feedback: 'Los derechos de trato humanizado son universales e iguales para todos los pacientes sin distinción.',
      },
    ],
    lesson: 'El trato humanizado inicia por tu identidad: conocer el nombre de tu cuidador y ser llamado por el tuyo.',
  },
];

// Preguntas para Reto 3 (Desafío de Consolidación)
export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'quiz-1',
    question: '¿Qué significa la sigla DAR en el Hospital Universitario Erasmo Meoz?',
    options: [
      'Documentación y puntualidad · Amabilidad y respeto · Reconocimiento de las normas',
      'Diagnóstico oportuno · Atención médica · Receta médica',
      'Derecho al trabajo · Asistencia legal · Rehabilitación física',
    ],
    correctIndex: 0,
    explanation: 'DAR representa los 3 grandes deberes de los usuarios: Documentación, Amabilidad y Reconocimiento de normas.',
  },
  {
    id: 'quiz-2',
    question: '¿Cuántos derechos fundamentales componen la sigla RECIBIR en la cartilla del hospital?',
    options: [
      '3 derechos',
      '5 derechos',
      '7 derechos integrales',
    ],
    correctIndex: 2,
    explanation: 'RECIBIR resume los 7 derechos que te protegen desde la atención oportuna hasta el trato digno.',
  },
  {
    id: 'quiz-3',
    question: 'Si tienes una sugerencia, reclamo o felicitación para el hospital, ¿cuál es la dependencia encargada?',
    options: [
      'Oficina del SIAU (Sistema de Información y Atención al Usuario) y buzones oficiales',
      'El departamento de compras e insumos',
      'El laboratorio clínico central',
    ],
    correctIndex: 0,
    explanation: 'El SIAU escucha y tramita formalmente todas las PQRSDF de los usuarios con acompañamiento directo.',
  },
];

// Directorio y Canales SIAU
export const SIAU_CHANNELS = {
  institution: 'E.S.E. Hospital Universitario Erasmo Meoz (HUEM)',
  slogan: '¡Un Hospital de Todos!',
  partner: 'Universidad Francisco de Paula Santander (UFPS) — Programa de Enfermería',
  phoneLines: [
    { label: 'PBX Conmutador', number: '(607) 589 2850', telUrl: 'tel:+576075892850', note: 'Extensiones SIAU: 1126 y 1188' },
    { label: 'Chatbot Citas WhatsApp', number: '+57 314 429 1269', telUrl: 'https://wa.me/573144291269?text=Hola,%20solicito%20información%20sobre%20asignación%20de%20citas%20HUEM', note: 'Atención automatizada 24/7' },
    { label: 'WhatsApp Línea Amiga IAMII', number: '315 349 9073', telUrl: 'https://wa.me/573153499073?text=Hola,%20comunicación%20con%20Línea%20Amiga%20IAMII', note: 'Atención a madres, gestantes e infantes' },
    { label: 'Línea Telefónica IAMII', number: '(607) 589 2850', telUrl: 'tel:+576075892850', note: 'Extensión 1431' },
  ],
  emails: [
    { label: 'Información General', email: 'info@herasmomeoz.gov.co' },
    { label: 'Asignación de Citas', email: 'asignaciondecitas@herasmomeoz.gov.co' },
    { label: 'Línea Amiga IAMII', email: 'lineaiamii@herasmomeoz.gov.co' },
  ],
  physicalLocations: [
    { service: 'Oficina Central SIAU', location: 'Entrada principal del hospital, planta baja', hours: 'Lun-Jue 7am-12m / 2pm-6pm · Vie 7am-12m / 2pm-5pm' },
    { service: 'Buzones de Sugerencias', location: 'Ubicados en salas de espera de Urgencias, Consulta Externa y Pisos de Hospitalización', hours: 'Apertura periódica con veeduría ciudadana' },
  ],
  socials: [
    { network: 'Página Web Oficial', handle: 'herasmomeoz.gov.co', url: 'https://herasmomeoz.gov.co/' },
    { network: 'Facebook', handle: 'Hospital Universitario Erasmo Meoz', url: 'https://facebook.com' },
    { network: 'Instagram y YouTube', handle: 'ESE HUEM', url: 'https://instagram.com' },
    { network: 'X (Twitter)', handle: '@ese_huem', url: 'https://x.com' },
  ],
};
