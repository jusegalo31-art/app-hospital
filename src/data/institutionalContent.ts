import {
  InstitutionalPrinciple,
  SortCardItem,
  ScenarioItem,
  MatchPairItem,
} from '../types/game';

/**
 * FUENTE OFICIAL:
 * 1. Póster "Deberes y Derechos de los Usuarios — DAR Y RECIBIR"
 * 2. Cartel institucional "Carta del Trato Digno del Ciudadano"
 * E.S.E. Hospital Universitario Erasmo Meoz — ¡Un Hospital de Todos!
 */

export const INSTITUTIONAL_PRINCIPLES: InstitutionalPrinciple[] = [
  // ================= LOS TRES DEBERES: DAR =================
  {
    id: 'dar-d',
    category: 'DAR',
    letter: 'D',
    shortTitle: 'Documentación y puntualidad',
    officialText:
      'Debo presentar documentación real y asistir puntualmente a las consultas y procedimientos.',
    citizenExplanation:
      'Presentar tus documentos verdaderos y llegar a tiempo permite brindarte una atención segura y ordenada para todos.',
    practicalExample:
      'Llevar tu documento de identidad real y acudir puntualmente a la hora asignada para tu consulta o examen.',
    icon: 'id-card',
  },
  {
    id: 'dar-a',
    category: 'DAR',
    letter: 'A',
    shortTitle: 'Amabilidad y respeto',
    officialText: 'Debo tratar a las personas con amabilidad y respeto.',
    citizenExplanation:
      'El buen trato se construye entre todos: dirigirse con cordialidad al personal de salud, demás pacientes y acompañantes.',
    practicalExample:
      'Hablar con respeto al personal asistencial, de admisiones, vigilancia y demás usuarios en la sala de espera.',
    icon: 'heart-handshake',
  },
  {
    id: 'dar-r',
    category: 'DAR',
    letter: 'R',
    shortTitle: 'Reconocimiento de las normas',
    officialText:
      'Debo reconocer y cumplir las normas y reglamentos de la institución.',
    citizenExplanation:
      'Las normas de bioseguridad, horarios y convivencia del hospital existen para proteger la salud y tranquilidad de todos.',
    practicalExample:
      'Respetar los horarios de visita, las normas de higiene y las indicaciones del personal en cada servicio.',
    icon: 'clipboard-check',
  },

  // ================= LOS SIETE DERECHOS: RECIBIR =================
  {
    id: 'recibir-r1',
    category: 'RECIBIR',
    letter: 'R',
    shortTitle: 'Recibir atención integral y oportuna',
    officialText:
      'Recibir atención integral, oportuna y de calidad en salud, así como un trato prioritario y diferencial según mi condición.',
    citizenExplanation:
      'Tienes derecho a una atención completa, de calidad y que tenga en cuenta tus necesidades particulares o prioridad.',
    practicalExample:
      'Recibir valoración médica completa y atención prioritaria si eres adulto mayor, gestante, niño o persona con discapacidad.',
    icon: 'stethoscope',
  },
  {
    id: 'recibir-e',
    category: 'RECIBIR',
    letter: 'E',
    shortTitle: 'Expresar opiniones e inconformidades',
    officialText: 'Expresar mis opiniones e inconformidades.',
    citizenExplanation:
      'Puedes manifestar tus peticiones, quejas, reclamos, sugerencias o felicitaciones de manera libre y respetuosa.',
    practicalExample:
      'Usar el buzón de sugerencias, el código QR de PQRSDF o acudir a la Oficina del SIAU en la entrada principal.',
    icon: 'message-square',
  },
  {
    id: 'recibir-c',
    category: 'RECIBIR',
    letter: 'C',
    shortTitle: 'Consentimiento y segunda opinión',
    officialText:
      'Dar mi consentimiento previo para tratamientos y estudios de investigación, así como solicitar una segunda opinión médica.',
    citizenExplanation:
      'Ningún procedimiento o estudio de investigación se realiza sin tu autorización informada, y puedes pedir otro concepto médico.',
    practicalExample:
      'Recibir explicación antes de autorizar un procedimiento y poder solicitar una segunda opinión médica cuando tengas dudas.',
    icon: 'file-signature',
  },
  {
    id: 'recibir-i1',
    category: 'RECIBIR',
    letter: 'I',
    shortTitle: 'Información clara y confidencial',
    officialText: 'Recibir información clara y confidencial.',
    citizenExplanation:
      'El equipo de salud debe explicarte tu estado y tratamiento en palabras sencillas, protegiendo siempre tu privacidad.',
    practicalExample:
      'Preguntar qué significan las indicaciones médicas y confiar en que tu historia clínica es privada y reservada.',
    icon: 'shield-check',
  },
  {
    id: 'recibir-b',
    category: 'RECIBIR',
    letter: 'B',
    shortTitle: 'Beneficio de acompañamiento',
    officialText:
      'Beneficiarme de un acompañante y de apoyo psicosocial o religioso si lo requiero.',
    citizenExplanation:
      'Cuando tu condición y el servicio lo permitan, tienes derecho a estar acompañado y a recibir apoyo emocional o espiritual.',
    practicalExample:
      'Contar con el apoyo de un familiar autorizado o solicitar acompañamiento psicosocial o espiritual respetando tu fe.',
    icon: 'users',
  },
  {
    id: 'recibir-i2',
    category: 'RECIBIR',
    letter: 'I',
    shortTitle: 'Identificación por mi nombre',
    officialText:
      'Conocer el nombre de quien me atiende y ser llamado por mi propio nombre.',
    citizenExplanation:
      'La atención cercana empieza por saber cómo se llama el profesional que te cuida y que te llamen por tu nombre.',
    practicalExample:
      'Ser llamado por tu nombre propio (no por un número de cama) y conocer el nombre y cargo de quien te atiende.',
    icon: 'user-check',
  },
  {
    id: 'recibir-r2',
    category: 'RECIBIR',
    letter: 'R',
    shortTitle: 'Respeto y trato humanizado',
    officialText:
      'Recibir respeto y trato humanizado frente a mi condición socioeconómica, cultural e ideológica, así como disfrutar de cualquier otro derecho reconocido por la Constitución y las leyes.',
    citizenExplanation:
      'Todas las personas merecen un trato digno, cálido y sin discriminación por su origen, cultura, creencias o situación económica.',
    practicalExample:
      'Ser atendido con dignidad, calidez humana y respeto por tus creencias culturales e ideológicas en todo momento.',
    icon: 'scale',
  },
];

/**
 * BANCO DE TARJETAS PARA EL RETO 1: "¿DÓNDE VA CADA UNO?"
 * Cubre los 3 deberes (DAR) y los 7 derechos (RECIBIR).
 */
export const CHALLENGE_1_BANK: SortCardItem[] = [
  // --- DEBERES (DAR) ---
  {
    id: 'c1-dar-1',
    principleId: 'dar-d',
    text: 'Presentar documentación real y llegar puntualmente a las citas y procedimientos.',
    category: 'DAR',
    letter: 'D',
    conceptTitle: 'Documentación y puntualidad',
    icon: 'id-card',
    correctFeedback:
      '¡Muy bien! Presentar documentos reales y asistir puntualmente es un deber (D de DAR) que facilita la atención oportuna.',
    incorrectFeedback:
      '¡Vamos a aprenderlo juntos! Presentar documentación real y asistir puntualmente es un deber que cumplimos como usuarios (DAR).',
  },
  {
    id: 'c1-dar-2',
    principleId: 'dar-a',
    text: 'Tratar con amabilidad y respeto al personal del hospital y a las demás personas.',
    category: 'DAR',
    letter: 'A',
    conceptTitle: 'Amabilidad y respeto',
    icon: 'heart-handshake',
    correctFeedback:
      '¡Excelente! Tratar a los demás con amabilidad y respeto es un deber (A de DAR) para convivir en armonía.',
    incorrectFeedback:
      '¡Vamos a aprenderlo juntos! La amabilidad y el respeto hacia los demás es un deber que aportamos (DAR). Un derecho es lo que recibes.',
  },
  {
    id: 'c1-dar-3',
    principleId: 'dar-r',
    text: 'Reconocer y cumplir las normas y reglamentos del hospital.',
    category: 'DAR',
    letter: 'R',
    conceptTitle: 'Reconocimiento de las normas',
    icon: 'clipboard-check',
    correctFeedback:
      '¡Correcto! Reconocer y cumplir las normas del hospital es un deber (R de DAR) que cuida la seguridad de todos.',
    incorrectFeedback:
      '¡Vamos a aprenderlo juntos! Cumplir las normas y reglamentos de la institución es un deber del usuario (DAR).',
  },

  // --- DERECHOS (RECIBIR) ---
  {
    id: 'c1-rec-1',
    principleId: 'recibir-r1',
    text: 'Recibir atención integral, oportuna y de calidad, con trato prioritario según mi condición.',
    category: 'RECIBIR',
    letter: 'R',
    conceptTitle: 'Atención integral y oportuna',
    icon: 'stethoscope',
    correctFeedback:
      '¡Muy bien! Recibir atención integral, oportuna y de calidad es el primer derecho del acrónimo RECIBIR.',
    incorrectFeedback:
      '¡Vamos a aprenderlo juntos! Contar con atención integral, oportuna y de calidad es un derecho que te protege como usuario (RECIBIR).',
  },
  {
    id: 'c1-rec-2',
    principleId: 'recibir-e',
    text: 'Poder expresar mis opiniones, sugerencias e inconformidades sobre la atención.',
    category: 'RECIBIR',
    letter: 'E',
    conceptTitle: 'Expresar opiniones',
    icon: 'message-square',
    correctFeedback:
      '¡Excelente! Expresar tus opiniones e inconformidades es un derecho (E de RECIBIR) que ayuda a mejorar el servicio.',
    incorrectFeedback:
      '¡Vamos a aprenderlo juntos! Expresar opiniones e inconformidades es un derecho que puedes ejercer como usuario (RECIBIR).',
  },
  {
    id: 'c1-rec-3',
    principleId: 'recibir-c',
    text: 'Dar mi consentimiento previo para tratamientos y solicitar una segunda opinión médica.',
    category: 'RECIBIR',
    letter: 'C',
    conceptTitle: 'Consentimiento y segunda opinión',
    icon: 'file-signature',
    correctFeedback:
      '¡Muy bien! Otorgar consentimiento previo y poder pedir una segunda opinión médica es un derecho (C de RECIBIR).',
    incorrectFeedback:
      '¡Vamos a aprenderlo juntos! Decidir mediante el consentimiento previo y pedir una segunda opinión médica es tu derecho (RECIBIR).',
  },
  {
    id: 'c1-rec-4',
    principleId: 'recibir-i1',
    text: 'Recibir información clara sobre mi atención y que se proteja su confidencialidad.',
    category: 'RECIBIR',
    letter: 'I',
    conceptTitle: 'Información clara y confidencial',
    icon: 'shield-check',
    correctFeedback:
      '¡Correcto! Recibir información clara y confidencial es un derecho fundamental del usuario (I de RECIBIR).',
    incorrectFeedback:
      '¡Vamos a aprenderlo juntos! Recibir información comprensible y privada sobre tu salud es un derecho (RECIBIR), no un deber.',
  },
  {
    id: 'c1-rec-5',
    principleId: 'recibir-b',
    text: 'Contar con el beneficio de un acompañante y apoyo psicosocial o religioso si lo requiero.',
    category: 'RECIBIR',
    letter: 'B',
    conceptTitle: 'Beneficio de acompañamiento',
    icon: 'users',
    correctFeedback:
      '¡Muy bien! El beneficio de un acompañante y de apoyo psicosocial o religioso es un derecho (B de RECIBIR).',
    incorrectFeedback:
      '¡Vamos a aprenderlo juntos! Contar con acompañante o apoyo psicosocial y religioso es un derecho del usuario (RECIBIR).',
  },
  {
    id: 'c1-rec-6',
    principleId: 'recibir-i2',
    text: 'Conocer el nombre de quien me atiende y ser llamado por mi propio nombre.',
    category: 'RECIBIR',
    letter: 'I',
    conceptTitle: 'Identificación por mi nombre',
    icon: 'user-check',
    correctFeedback:
      '¡Excelente! Saber quién te atiende y ser llamado por tu nombre es un derecho de trato digno (I de RECIBIR).',
    incorrectFeedback:
      '¡Vamos a aprenderlo juntos! Ser llamado por tu nombre y conocer el nombre de quien te atiende es un derecho (RECIBIR).',
  },
  {
    id: 'c1-rec-7',
    principleId: 'recibir-r2',
    text: 'Recibir respeto y trato humanizado sin importar mi condición socioeconómica, cultural o ideológica.',
    category: 'RECIBIR',
    letter: 'R',
    conceptTitle: 'Respeto y trato humanizado',
    icon: 'scale',
    correctFeedback:
      '¡Muy bien! Recibir respeto y trato humanizado sin discriminación es un derecho garantizado (R de RECIBIR).',
    incorrectFeedback:
      '¡Vamos a aprenderlo juntos! Recibir un trato humanizado y respetuoso de tu condición cultural o socioeconómica es tu derecho (RECIBIR).',
  },
];

/**
 * BANCO DE SITUACIONES PARA EL RETO 2: "¿QUÉ HARÍAS EN ESTA SITUACIÓN?"
 * Incluye los 5 casos clave especificados y un 6° caso complementario.
 */
export const CHALLENGE_2_SCENARIOS: ScenarioItem[] = [
  {
    id: 'caso-1-info',
    principleId: 'recibir-i1',
    title: 'Caso 1: Información médica',
    categoryBadge: 'Derecho • RECIBIR (I)',
    situationText:
      'Durante la consulta, una persona escucha términos médicos que no comprende bien y desea entender con claridad las indicaciones para su cuidado, con tranquilidad y privacidad.',
    question: '¿Qué derecho le ayuda en esta situación?',
    illustrationType: 'medical-info',
    options: [
      {
        id: 'c1-opt-a',
        text: 'Recibir información clara y confidencial sobre su atención.',
        isCorrect: true,
        categoryLabel: 'RECIBIR',
        feedback:
          '¡Muy bien! Recibir información clara y confidencial es un derecho (I de RECIBIR). Puedes pedir con confianza que te expliquen todo lo relacionado con tu atención.',
      },
      {
        id: 'c1-opt-b',
        text: 'Quedarse con la duda para no hacer preguntas durante la consulta.',
        isCorrect: false,
        categoryLabel: 'DAR',
        feedback:
          '¡Vamos a revisarlo! Como usuario no tienes que quedarte con dudas. Tienes el derecho a recibir explicaciones claras y comprensibles.',
      },
      {
        id: 'c1-opt-c',
        text: 'Reconocer las normas de horario de visitas de la institución.',
        isCorrect: false,
        categoryLabel: 'DAR',
        feedback:
          'Cumplir las normas del hospital es un deber importante, pero en este caso la persona necesita ejercer su derecho a comprender la información médica.',
      },
    ],
    reinforcementTip:
      'Recuerda: En el reto anterior vimos que la "I" de RECIBIR protege tu derecho a una información clara y confidencial.',
  },
  {
    id: 'caso-2-consulta',
    principleId: 'dar-d',
    title: 'Caso 2: Llegada a una consulta',
    categoryBadge: 'Deber • DAR (D)',
    situationText:
      'Un usuario tiene una consulta externa o procedimiento programado en el Hospital Universitario Erasmo Meoz y se está preparando antes de salir de casa.',
    question: '¿Qué deber debe recordar cumplir?',
    illustrationType: 'punctual-arrival',
    options: [
      {
        id: 'c2-opt-a',
        text: 'Presentar documentación real y asistir puntualmente a su consulta.',
        isCorrect: true,
        categoryLabel: 'DAR',
        feedback:
          '¡Excelente! Presentar documentación real y asistir puntualmente es el primer deber (D de DAR). Así contribuyes a una atención segura y ordenada.',
      },
      {
        id: 'c2-opt-b',
        text: 'Solicitar una segunda opinión médica antes de registrarse en admisiones.',
        isCorrect: false,
        categoryLabel: 'RECIBIR',
        feedback:
          'La segunda opinión médica es un derecho frente a un diagnóstico o tratamiento, pero para asistir a una cita programada debemos recordar el deber de puntualidad y documentación.',
      },
      {
        id: 'c2-opt-c',
        text: 'Presentar el documento de otra persona para agilizar el turno.',
        isCorrect: false,
        categoryLabel: 'DAR',
        feedback:
          '¡Atención! Por tu seguridad clínica y legal, el deber institucional exige presentar siempre documentación real y propia.',
      },
    ],
    reinforcementTip:
      'Recuerda: La "D" de DAR nos invita a presentar documentación real y asistir puntualmente a las consultas y procedimientos.',
  },
  {
    id: 'caso-3-inconformidad',
    principleId: 'recibir-e',
    title: 'Caso 3: Una inconformidad o sugerencia',
    situationText:
      'Un usuario o su acompañante tiene una inquietud o no está de acuerdo con algún aspecto de la atención recibida y desea manifestarlo por las vías adecuadas del hospital.',
    categoryBadge: 'Derecho • RECIBIR (E)',
    question: '¿Qué derecho puede ejercer?',
    illustrationType: 'express-opinion',
    options: [
      {
        id: 'c3-opt-a',
        text: 'Expresar sus opiniones e inconformidades mediante los canales del hospital.',
        isCorrect: true,
        categoryLabel: 'RECIBIR',
        feedback:
          '¡Muy bien! Expresar opiniones e inconformidades es tu derecho (E de RECIBIR). Puedes hacerlo en los buzones de sugerencias, código QR de PQRSDF o en la Oficina del SIAU.',
      },
      {
        id: 'c3-opt-b',
        text: 'Faltar al respeto a las personas que se encuentran en el servicio.',
        isCorrect: false,
        categoryLabel: 'DAR',
        feedback:
          '¡Tenlo presente! Podemos expresar cualquier inconformidad sin perder nuestro deber de tratar a las personas con amabilidad y respeto.',
      },
      {
        id: 'c3-opt-c',
        text: 'Guardar silencio porque los usuarios no pueden presentar reclamos ni sugerencias.',
        isCorrect: false,
        categoryLabel: 'RECIBIR',
        feedback:
          '¡Al contrario! Para el Hospital Universitario Erasmo Meoz es muy importante escuchar tus peticiones, quejas, reclamos, sugerencias o felicitaciones.',
      },
    ],
    reinforcementTip:
      'Recuerda: Ejercer el derecho a expresar opiniones (E de RECIBIR) va de la mano con el deber de amabilidad y respeto (A de DAR).',
  },
  {
    id: 'caso-4-consentimiento',
    principleId: 'recibir-c',
    title: 'Caso 4: Decisiones sobre el tratamiento',
    categoryBadge: 'Derecho • RECIBIR (C)',
    situationText:
      'A una persona le proponen realizar un procedimiento médico o participar en un estudio de investigación, y quiere tomar una decisión informada.',
    question: '¿Qué derecho debe conocer en este momento?',
    illustrationType: 'informed-consent',
    options: [
      {
        id: 'c4-opt-a',
        text: 'Dar su consentimiento previo e informado, además de poder solicitar una segunda opinión médica.',
        isCorrect: true,
        categoryLabel: 'RECIBIR',
        feedback:
          '¡Correcto! La "C" de RECIBIR garantiza tu derecho a dar consentimiento previo para tratamientos o estudios de investigación y a solicitar una segunda opinión médica.',
      },
      {
        id: 'c4-opt-b',
        text: 'Firmar cualquier documento sin leer ni preguntar en qué consiste el procedimiento.',
        isCorrect: false,
        categoryLabel: 'DAR',
        feedback:
          '¡Vamos a aprenderlo juntos! Antes de dar tu consentimiento previo tienes derecho a comprender el procedimiento y resolver tus dudas.',
      },
      {
        id: 'c4-opt-c',
        text: 'Aceptar obligatoriamente cualquier estudio de investigación sin poder decidir.',
        isCorrect: false,
        categoryLabel: 'RECIBIR',
        feedback:
          'Ningún estudio de investigación o tratamiento requiere que renuncies a tu voluntad: tienes derecho al consentimiento previo y a pedir una segunda opinión.',
      },
    ],
    reinforcementTip:
      'Recuerda: Consentimiento previo y segunda opinión médica (C de RECIBIR) te permiten participar activamente en las decisiones sobre tu salud.',
  },
  {
    id: 'caso-5-trato-respetuoso',
    principleId: 'recibir-r2',
    title: 'Caso 5: Trato respetuoso e identidad',
    categoryBadge: 'Derechos • RECIBIR (I y R)',
    situationText:
      'Una persona acude al hospital y espera que se valore su dignidad, se respeten sus creencias culturales y condición personal, y se le trate de manera cercana.',
    question: '¿Qué derechos corresponden en esta situación?',
    illustrationType: 'respectful-name',
    options: [
      {
        id: 'c5-opt-a',
        text: 'Recibir respeto, trato humanizado, conocer quién le atiende y ser llamado por su propio nombre.',
        isCorrect: true,
        categoryLabel: 'RECIBIR',
        feedback:
          '¡Excelente! Tienes derecho a ser llamado por tu nombre, conocer el nombre de quien te atiende y recibir un trato humanizado sin discriminación alguna.',
      },
      {
        id: 'c5-opt-b',
        text: 'Recibir buen trato únicamente si pertenece a determinada condición socioeconómica.',
        isCorrect: false,
        categoryLabel: 'RECIBIR',
        feedback:
          '¡Recuerda! En el Hospital Universitario Erasmo Meoz el respeto y el trato humanizado son para todas las personas, sin distinción socioeconómica, cultural o ideológica.',
      },
      {
        id: 'c5-opt-c',
        text: 'Ser identificado solamente por un número de turno o de habitación sin importar su nombre.',
        isCorrect: false,
        categoryLabel: 'RECIBIR',
        feedback:
          'Uno de tus derechos en RECIBIR (letra I) es que el personal se identifique por su nombre y te llame siempre por tu propio nombre.',
      },
    ],
    reinforcementTip:
      'Recuerda: "¡Un Hospital de Todos!" significa trato digno, humanizado y por tu propio nombre para cada ciudadano.',
  },
];

/**
 * BANCO COMPLETO DE PAREJAS PARA EL RETO 3: "CONECTA Y COMPLETA"
 * Cubre los 7 derechos (RECIBIR) y los 3 deberes (DAR).
 * Se organizan en 2 rondas manejables de 3 conceptos cada una (6 por partida),
 * seleccionando de los 10 conceptos oficiales para cubrir tanto DAR como RECIBIR.
 */
export const CHALLENGE_3_PAIRS: MatchPairItem[] = [
  {
    id: 'm-consentimiento',
    principleId: 'recibir-c',
    concept: 'Consentimiento y 2.ª opinión',
    category: 'RECIBIR',
    letter: 'C',
    description:
      'Decidir con información previa sobre tratamientos o estudios de investigación y poder solicitar otra opinión médica.',
    icon: 'file-signature',
    hintOnError:
      'Pista: Busca la definición que habla de autorizar previamente un tratamiento o estudio y pedir otra opinión médica.',
    successNote:
      '¡Conectado! El consentimiento previo y la segunda opinión son tu derecho (C de RECIBIR).',
  },
  {
    id: 'm-confidencialidad',
    principleId: 'recibir-i1',
    concept: 'Información clara y confidencial',
    category: 'RECIBIR',
    letter: 'I',
    description:
      'Comprender las explicaciones sobre tu salud con respeto absoluto al carácter privado de tu información.',
    icon: 'shield-check',
    hintOnError:
      'Pista: Busca la opción que menciona explicaciones comprensibles y el respeto al carácter privado de tu información.',
    successNote:
      '¡Conectado! Tienes derecho a explicaciones comprensibles y a la reserva de tu historia clínica (I de RECIBIR).',
  },
  {
    id: 'm-acompanamiento',
    principleId: 'recibir-b',
    concept: 'Beneficio de acompañamiento',
    category: 'RECIBIR',
    letter: 'B',
    description:
      'Contar con un acompañante y recibir apoyo psicosocial o religioso si lo requieres.',
    icon: 'users',
    hintOnError:
      'Pista: Piensa en la compañía de un familiar y el apoyo emocional, psicosocial o espiritual.',
    successNote:
      '¡Conectado! El acompañamiento y el apoyo psicosocial o religioso hacen parte del cuidado humanizado (B de RECIBIR).',
  },
  {
    id: 'm-puntualidad',
    principleId: 'dar-d',
    concept: 'Documentación y puntualidad',
    category: 'DAR',
    letter: 'D',
    description:
      'Cumplir el deber de presentar documentación real y asistir puntualmente a las consultas y procedimientos.',
    icon: 'clock',
    hintOnError:
      'Pista: Es un deber (D de DAR) relacionado con tus documentos de identidad y llegar a tiempo a tus citas.',
    successNote:
      '¡Conectado! La puntualidad y la documentación real son el primer deber del acrónimo DAR.',
  },
  {
    id: 'm-amabilidad',
    principleId: 'dar-a',
    concept: 'Amabilidad y respeto',
    category: 'DAR',
    letter: 'A',
    description:
      'Relacionarse con trato cordial, respeto y consideración hacia el personal y demás usuarios.',
    icon: 'heart-handshake',
    hintOnError:
      'Pista: Es un deber (A de DAR) sobre cómo tratamos a las demás personas en el hospital.',
    successNote:
      '¡Conectado! La amabilidad y el respeto (A de DAR) construyen un ambiente seguro y cálido para todos.',
  },
  {
    id: 'm-normas',
    principleId: 'dar-r',
    concept: 'Reconocimiento de las normas',
    category: 'DAR',
    letter: 'R',
    description:
      'Conocer y cumplir los reglamentos, horarios y medidas de seguridad de la institución.',
    icon: 'clipboard-check',
    hintOnError:
      'Pista: Es un deber (R de DAR) enfocado en respetar los reglamentos y horarios del hospital.',
    successNote:
      '¡Conectado! Reconocer y cumplir las normas y reglamentos es el tercer deber del acrónimo DAR.',
  },
  {
    id: 'm-atencion-integral',
    principleId: 'recibir-r1',
    concept: 'Atención integral y oportuna',
    category: 'RECIBIR',
    letter: 'R',
    description:
      'Recibir servicios de salud de calidad, oportunos y con trato prioritario y diferencial según tu condición.',
    icon: 'stethoscope',
    hintOnError:
      'Pista: Busca la definición que habla de atención en salud completa, de calidad y con trato prioritario.',
    successNote:
      '¡Conectado! La atención integral, oportuna y con enfoque diferencial encabeza tus derechos RECIBIR.',
  },
  {
    id: 'm-inconformidades',
    principleId: 'recibir-e',
    concept: 'Expresar opiniones',
    category: 'RECIBIR',
    letter: 'E',
    description:
      'Manifestar peticiones, quejas, reclamos, sugerencias o felicitaciones sobre el servicio recibido.',
    icon: 'message-square',
    hintOnError:
      'Pista: Busca la descripción sobre manifestar tus sugerencias, opiniones o inconformidades.',
    successNote:
      '¡Conectado! Expresar tus opiniones e inconformidades (E de RECIBIR) fortalece la calidad del hospital.',
  },
  {
    id: 'm-identificacion',
    principleId: 'recibir-i2',
    concept: 'Identificación por mi nombre',
    category: 'RECIBIR',
    letter: 'I',
    description:
      'Saber el nombre de la persona que te atiende y ser llamado siempre por tu propio nombre.',
    icon: 'user-check',
    hintOnError:
      'Pista: Busca la opción que menciona conocer cómo se llama quien te atiende y que te llamen por tu nombre.',
    successNote:
      '¡Conectado! Conocer el nombre del personal y ser llamado por tu nombre es parte del trato digno (I de RECIBIR).',
  },
  {
    id: 'm-trato-humanizado',
    principleId: 'recibir-r2',
    concept: 'Respeto y trato humanizado',
    category: 'RECIBIR',
    letter: 'R',
    description:
      'Ser atendido con dignidad frente a tu condición socioeconómica, cultural e ideológica, y demás derechos de ley.',
    icon: 'scale',
    hintOnError:
      'Pista: Busca la definición sobre dignidad y no discriminación por razones socioeconómicas, culturales o ideológicas.',
    successNote:
      '¡Conectado! El respeto y trato humanizado sin distinción cierra con broche de oro el acrónimo RECIBIR.',
  },
];

/**
 * CANALES OFICIALES DE ATENCIÓN AL CIUDADANO (Póster 2: Carta del Trato Digno)
 */
export const OFFICIAL_ATTENTION_CHANNELS = {
  presencial: [
    'Buzón de Sugerencias: Ubicados en los diferentes servicios de la institución.',
    'Oficina del SIAU (Sistema de Información y Atención al Usuario): Ubicada en la entrada principal.',
  ],
  telefonica: [
    'Asignación de Citas (Chatbot): +57 314 429 1269',
    'Líneas Telefónicas: (607) 589 2850 — Ext. 1126 - 1188',
    'Línea Amiga IAMII: (607) 589 2850 — Ext. 1431',
    'WhatsApp Línea Amiga IAMII: 315 349 9073',
  ],
  virtual: [
    'Correo institucional: info@herasmomeoz.gov.co',
    'Correo de citas: asignaciondecitas@herasmomeoz.gov.co',
    'Correo Línea Amiga IAMII: lineaiamii@herasmomeoz.gov.co',
    'Página Web: https://herasmomeoz.gov.co/',
  ],
  horarios: [
    'Lunes a Jueves: 7:00 a. m. - 12:00 m. y 2:00 p. m. - 6:00 p. m.',
    'Viernes: 7:00 a. m. - 12:00 m. y 2:00 p. m. - 5:00 p. m.',
  ],
  redes: [
    'Facebook: Hospital Universitario Erasmo Meoz',
    'Instagram y YouTube: ESE HUEM',
    'X (Twitter): @ese_huem',
  ],
};

/**
 * Utilidad para mezclar arreglos de forma aleatoria (Fisher-Yates)
 */
export function shuffleArray<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Selecciona 6 tarjetas equilibradas para el Reto 1:
 * Los 3 deberes DAR + 3 derechos RECIBIR variados en cada partida.
 */
export function generateChallenge1Cards(): SortCardItem[] {
  const darCards = CHALLENGE_1_BANK.filter((c) => c.category === 'DAR');
  const recibirCards = shuffleArray(
    CHALLENGE_1_BANK.filter((c) => c.category === 'RECIBIR')
  ).slice(0, 3);
  return shuffleArray([...darCards, ...recibirCards]);
}

/**
 * Prepara las 5 situaciones del Reto 2 mezclando el orden de las opciones de cada caso.
 */
export function generateChallenge2Scenarios(): ScenarioItem[] {
  return CHALLENGE_2_SCENARIOS.map((scenario) => ({
    ...scenario,
    options: shuffleArray(scenario.options),
  }));
}

/**
 * Selecciona 2 grupos de 3 parejas (6 en total) para el Reto 3,
 * garantizando que se incluyan tanto deberes DAR como derechos RECIBIR
 * y los conceptos clave requeridos.
 */
export function generateChallenge3Groups(): [MatchPairItem[], MatchPairItem[]] {
  const darPool = shuffleArray(
    CHALLENGE_3_PAIRS.filter((p) => p.category === 'DAR')
  );
  const recibirPool = shuffleArray(
    CHALLENGE_3_PAIRS.filter((p) => p.category === 'RECIBIR')
  );

  // Grupo 1: 1 Deber DAR + 2 Derechos RECIBIR (3 conceptos manejables)
  const group1 = shuffleArray([darPool[0], recibirPool[0], recibirPool[1]]);
  // Grupo 2: 1 Deber DAR + 2 Derechos RECIBIR (3 conceptos manejables)
  const group2 = shuffleArray([darPool[1], recibirPool[2], recibirPool[3]]);

  return [group1, group2];
}
