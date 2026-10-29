import asyncio
import json
import os
import re
from pathlib import Path
import edge_tts

ROOT = Path(__file__).resolve().parent.parent
AUDIO_DIR = ROOT / "public" / "recursos" / "audio"

VOICES = {
    "gonzalo": "es-CO-GonzaloNeural",
    "salome": "es-CO-SalomeNeural",
}


def normalize_for_colombian_tts(text: str) -> str:
    """
    Prepara el texto para que las voces neurales colombianas (Gonzalo / Salomé)
    pronuncien cada palabra, sigla y pausa con total naturalidad humana.
    """
    s = text
    # Abreviaturas ordinales
    s = s.replace("2.ª", "segunda")
    s = s.replace("1.er", "primer")
    s = s.replace("2.º", "segundo")
    # Siglas institucionales
    s = s.replace("PQRSDF", "peticiones, quejas, reclamos y sugerencias")
    s = s.replace("SIAU", "Siau")
    s = s.replace("E.S.E.", "E. S. E.")
    # Evitar que "DAR" en mayúsculas sea deletreado como sigla D-A-R por el motor neural
    s = re.sub(r"\bDAR Y RECIBIR\b", "Dar y Recibir", s)
    s = re.sub(r"\bDAR\b", "Dar", s)
    s = re.sub(r"\bRECIBIR\b", "Recibir", s)
    # Mejorar lectura de letras entre paréntesis: "(D de Dar)" -> ", letra D de Dar,"
    s = re.sub(r"\(([A-Z]) de (Dar|Recibir)\)", r", letra \1 de \2,", s)
    s = re.sub(r"\((Dar|Recibir), letra ([A-Z])\)", r", de \1, letra \2,", s)
    s = re.sub(r"\((Dar|Recibir)\)", r", \1,", s)
    # Comillas y signos tipográficos
    s = re.sub(r"[“”\"«»]", "", s)
    s = re.sub(r"[•·]", ", ", s)
    s = re.sub(r"\s+", " ", s).strip()
    return s


# Datos exactos sincronizados con src/data/institutionalContent.ts y src/data/dariDialogues.ts
PRINCIPLES = [
    {
        "id": "dar-d",
        "category": "DAR",
        "letter": "D",
        "shortTitle": "Documentación y puntualidad",
        "officialText": "Debo presentar documentación real y asistir puntualmente a las consultas y procedimientos.",
        "citizenExplanation": "Presentar tus documentos verdaderos y llegar a tiempo permite brindarte una atención segura y ordenada para todos.",
    },
    {
        "id": "dar-a",
        "category": "DAR",
        "letter": "A",
        "shortTitle": "Amabilidad y respeto",
        "officialText": "Debo tratar a las personas con amabilidad y respeto.",
        "citizenExplanation": "El buen trato se construye entre todos: dirigirse con cordialidad al personal de salud, demás pacientes y acompañantes.",
    },
    {
        "id": "dar-r",
        "category": "DAR",
        "letter": "R",
        "shortTitle": "Reconocimiento de las normas",
        "officialText": "Debo reconocer y cumplir las normas y reglamentos de la institución.",
        "citizenExplanation": "Las normas de bioseguridad, horarios y convivencia del hospital existen para proteger la salud y tranquilidad de todos.",
    },
    {
        "id": "recibir-r1",
        "category": "RECIBIR",
        "letter": "R",
        "shortTitle": "Recibir atención integral y oportuna",
        "officialText": "Recibir atención integral, oportuna y de calidad en salud, así como un trato prioritario y diferencial según mi condición.",
        "citizenExplanation": "Tienes derecho a una atención completa, de calidad y que tenga en cuenta tus necesidades particulares o prioridad.",
    },
    {
        "id": "recibir-e",
        "category": "RECIBIR",
        "letter": "E",
        "shortTitle": "Expresar opiniones e inconformidades",
        "officialText": "Expresar mis opiniones e inconformidades.",
        "citizenExplanation": "Puedes manifestar tus peticiones, quejas, reclamos, sugerencias o felicitaciones de manera libre y respetuosa.",
    },
    {
        "id": "recibir-c",
        "category": "RECIBIR",
        "letter": "C",
        "shortTitle": "Consentimiento y segunda opinión",
        "officialText": "Dar mi consentimiento previo para tratamientos y estudios de investigación, así como solicitar una segunda opinión médica.",
        "citizenExplanation": "Ningún procedimiento o estudio de investigación se realiza sin tu autorización informada, y puedes pedir otro concepto médico.",
    },
    {
        "id": "recibir-i1",
        "category": "RECIBIR",
        "letter": "I",
        "shortTitle": "Información clara y confidencial",
        "officialText": "Recibir información clara y confidencial.",
        "citizenExplanation": "El equipo de salud debe explicarte tu estado y tratamiento en palabras sencillas, protegiendo siempre tu privacidad.",
    },
    {
        "id": "recibir-b",
        "category": "RECIBIR",
        "letter": "B",
        "shortTitle": "Beneficio de acompañamiento",
        "officialText": "Beneficiarme de un acompañante y de apoyo psicosocial o religioso si lo requiero.",
        "citizenExplanation": "Cuando tu condición y el servicio lo permitan, tienes derecho a estar acompañado y a recibir apoyo emocional o espiritual.",
    },
    {
        "id": "recibir-i2",
        "category": "RECIBIR",
        "letter": "I",
        "shortTitle": "Identificación por mi nombre",
        "officialText": "Conocer el nombre de quien me atiende y ser llamado por mi propio nombre.",
        "citizenExplanation": "La atención cercana empieza por saber cómo se llama el profesional que te cuida y que te llamen por tu nombre.",
    },
    {
        "id": "recibir-r2",
        "category": "RECIBIR",
        "letter": "R",
        "shortTitle": "Respeto y trato humanizado",
        "officialText": "Recibir respeto y trato humanizado frente a mi condición socioeconómica, cultural e ideológica, así como disfrutar de cualquier otro derecho reconocido por la Constitución y las leyes.",
        "citizenExplanation": "Todas las personas merecen un trato digno, cálido y sin discriminación por su origen, cultura, creencias o situación económica.",
    },
]

CHALLENGE_1_BANK = [
    {
        "id": "c1-dar-1",
        "text": "Presentar documentación real y llegar puntualmente a las citas y procedimientos.",
        "category": "DAR",
        "letter": "D",
        "conceptTitle": "Documentación y puntualidad",
        "incorrectFeedback": "¡Vamos a aprenderlo juntos! Presentar documentación real y asistir puntualmente es un deber que cumplimos como usuarios (DAR).",
    },
    {
        "id": "c1-dar-2",
        "text": "Tratar con amabilidad y respeto al personal del hospital y a las demás personas.",
        "category": "DAR",
        "letter": "A",
        "conceptTitle": "Amabilidad y respeto",
        "incorrectFeedback": "¡Vamos a aprenderlo juntos! La amabilidad y el respeto hacia los demás es un deber que aportamos (DAR). Un derecho es lo que recibes.",
    },
    {
        "id": "c1-dar-3",
        "text": "Reconocer y cumplir las normas y reglamentos del hospital.",
        "category": "DAR",
        "letter": "R",
        "conceptTitle": "Reconocimiento de las normas",
        "incorrectFeedback": "¡Vamos a aprenderlo juntos! Cumplir las normas y reglamentos de la institución es un deber del usuario (DAR).",
    },
    {
        "id": "c1-rec-1",
        "text": "Recibir atención integral, oportuna y de calidad, con trato prioritario según mi condición.",
        "category": "RECIBIR",
        "letter": "R",
        "conceptTitle": "Atención integral y oportuna",
        "incorrectFeedback": "¡Vamos a aprenderlo juntos! Contar con atención integral, oportuna y de calidad es un derecho que te protege como usuario (RECIBIR).",
    },
    {
        "id": "c1-rec-2",
        "text": "Poder expresar mis opiniones, sugerencias e inconformidades sobre la atención.",
        "category": "RECIBIR",
        "letter": "E",
        "conceptTitle": "Expresar opiniones",
        "incorrectFeedback": "¡Vamos a aprenderlo juntos! Expresar opiniones e inconformidades es un derecho que puedes ejercer como usuario (RECIBIR).",
    },
    {
        "id": "c1-rec-3",
        "text": "Dar mi consentimiento previo para tratamientos y solicitar una segunda opinión médica.",
        "category": "RECIBIR",
        "letter": "C",
        "conceptTitle": "Consentimiento y segunda opinión",
        "incorrectFeedback": "¡Vamos a aprenderlo juntos! Decidir mediante el consentimiento previo y pedir una segunda opinión médica es tu derecho (RECIBIR).",
    },
    {
        "id": "c1-rec-4",
        "text": "Recibir información clara sobre mi atención y que se proteja su confidencialidad.",
        "category": "RECIBIR",
        "letter": "I",
        "conceptTitle": "Información clara y confidencial",
        "incorrectFeedback": "¡Vamos a aprenderlo juntos! Recibir información comprensible y privada sobre tu salud es un derecho (RECIBIR), no un deber.",
    },
    {
        "id": "c1-rec-5",
        "text": "Contar con el beneficio de un acompañante y apoyo psicosocial o religioso si lo requiero.",
        "category": "RECIBIR",
        "letter": "B",
        "conceptTitle": "Beneficio de acompañamiento",
        "incorrectFeedback": "¡Vamos a aprenderlo juntos! Contar con acompañante o apoyo psicosocial y religioso es un derecho del usuario (RECIBIR).",
    },
    {
        "id": "c1-rec-6",
        "text": "Conocer el nombre de quien me atiende y ser llamado por mi propio nombre.",
        "category": "RECIBIR",
        "letter": "I",
        "conceptTitle": "Identificación por mi nombre",
        "incorrectFeedback": "¡Vamos a aprenderlo juntos! Ser llamado por tu nombre y conocer el nombre de quien te atiende es un derecho (RECIBIR).",
    },
    {
        "id": "c1-rec-7",
        "text": "Recibir respeto y trato humanizado sin importar mi condición socioeconómica, cultural o ideológica.",
        "category": "RECIBIR",
        "letter": "R",
        "conceptTitle": "Respeto y trato humanizado",
        "incorrectFeedback": "¡Vamos a aprenderlo juntos! Recibir un trato humanizado y respetuoso de tu condición cultural o socioeconómica es tu derecho (RECIBIR).",
    },
]

CHALLENGE_2_DATA = [
    {
        "id": "caso-1-info",
        "index": 0,
        "isLast": False,
        "prompt": "Imagina que necesitas comprender mejor la información sobre tu atención. ¿Qué derecho te permite recibir información clara y confidencial? ¡Busca la respuesta!",
        "success": "¡Exactamente! Recibir información clara y confidencial es uno de tus derechos. Si algo no te queda claro, puedes solicitar con tranquilidad que te lo expliquen.",
        "wrongOptions": [
            (
                "c1-opt-b",
                "¡Vamos a revisarlo! Como usuario no tienes que quedarte con dudas. Tienes el derecho a recibir explicaciones claras y comprensibles.",
            ),
            (
                "c1-opt-c",
                "Cumplir las normas del hospital es un deber importante, pero en este caso la persona necesita ejercer su derecho a comprender la información médica.",
            ),
        ],
    },
    {
        "id": "caso-2-consulta",
        "index": 1,
        "isLast": False,
        "prompt": "Piensa en cuando tienes una cita o examen programado en el hospital. ¿Qué deber del acrónimo DAR nos ayuda a que la atención sea segura y puntual?",
        "success": "¡Exactamente! Presentar documentación real y asistir puntualmente es nuestro primer deber en DAR. Así cuidamos el tiempo y la seguridad de todos.",
        "wrongOptions": [
            (
                "c2-opt-b",
                "La segunda opinión médica es un derecho frente a un diagnóstico o tratamiento, pero para asistir a una cita programada debemos recordar el deber de puntualidad y documentación.",
            ),
            (
                "c2-opt-c",
                "¡Atención! Por tu seguridad clínica y legal, el deber institucional exige presentar siempre documentación real y propia.",
            ),
        ],
    },
    {
        "id": "caso-3-inconformidad",
        "index": 2,
        "isLast": False,
        "prompt": "Si tienes una sugerencia o no estás de acuerdo con algún aspecto del servicio, tienes canales como el SIAU o los buzones. ¿Qué derecho puedes ejercer con respeto?",
        "success": "¡Muy bien! Expresar opiniones e inconformidades es tu derecho, y podemos ejercerlo en el SIAU o en los buzones manteniendo siempre un trato amable.",
        "wrongOptions": [
            (
                "c3-opt-b",
                "¡Tenlo presente! Podemos expresar cualquier inconformidad sin perder nuestro deber de tratar a las personas con amabilidad y respeto.",
            ),
            (
                "c3-opt-c",
                "¡Al contrario! Para el Hospital Universitario Erasmo Meoz es muy importante escuchar tus peticiones, quejas, reclamos, sugerencias o felicitaciones.",
            ),
        ],
    },
    {
        "id": "caso-4-consentimiento",
        "index": 3,
        "isLast": False,
        "prompt": "Cuando te proponen un procedimiento médico o participar en una investigación, tu voz cuenta. ¿Qué derecho te permite decidir con información previa o pedir otra opinión médica?",
        "success": "¡Exactamente! Dar tu consentimiento previo e informado y poder solicitar una segunda opinión médica son derechos fundamentales sobre tu salud.",
        "wrongOptions": [
            (
                "c4-opt-b",
                "¡Vamos a aprenderlo juntos! Antes de dar tu consentimiento previo tienes derecho a comprender el procedimiento y resolver tus dudas.",
            ),
            (
                "c4-opt-c",
                "Ningún estudio de investigación o tratamiento requiere que renuncies a tu voluntad: tienes derecho al consentimiento previo y a pedir una segunda opinión.",
            ),
        ],
    },
    {
        "id": "caso-5-trato-respetuoso",
        "index": 4,
        "isLast": True,
        "prompt": "En el hospital todas las personas merecen calidez humana, respeto por su cultura y ser llamadas por su propio nombre. ¿Cuál opción refleja este derecho?",
        "success": "¡Así es! Conocer el nombre de quien te atiende, ser llamado por tu propio nombre y recibir un trato humanizado sin discriminación son tus derechos.",
        "wrongOptions": [
            (
                "c5-opt-b",
                "¡Recuerda! En el Hospital Universitario Erasmo Meoz el respeto y el trato humanizado son para todas las personas, sin distinción socioeconómica, cultural o ideológica.",
            ),
            (
                "c5-opt-c",
                "Uno de tus derechos en RECIBIR (letra I) es que el personal se identifique por su nombre y te llame siempre por tu propio nombre.",
            ),
        ],
    },
]

CHALLENGE_3_PAIRS = [
    {
        "id": "m-consentimiento",
        "concept": "Consentimiento y 2.ª opinión",
        "category": "RECIBIR",
        "letter": "C",
        "statement": "Como usuario del hospital, tengo derecho a dar mi consentimiento previo antes de un tratamiento o estudio de investigación, y también puedo solicitar una segunda opinión médica.",
        "isTrue": True,
        "hintOnError": "Recuerda: Autorizar previamente un tratamiento o estudio de investigación y pedir una segunda opinión médica sí es un derecho real (letra C de RECIBIR).",
        "successNote": "¡Es Verdadero! El consentimiento previo y la segunda opinión médica son tu derecho en la letra C de RECIBIR.",
    },
    {
        "id": "m-confidencialidad",
        "concept": "Información clara y confidencial",
        "category": "RECIBIR",
        "letter": "I",
        "statement": "Mi historia clínica y mi diagnóstico son públicos, por lo que cualquier persona ajena a mi atención puede exigir verlos sin mi autorización.",
        "isTrue": False,
        "hintOnError": "Piénsalo bien: Tu historia clínica es privada y reservada. La letra I de RECIBIR protege siempre tu confidencialidad.",
        "successNote": "¡Es Falso! Tienes derecho a recibir información clara y a la reserva y confidencialidad absoluta de tu historia clínica (letra I de RECIBIR).",
    },
    {
        "id": "m-acompanamiento",
        "concept": "Beneficio de acompañamiento",
        "category": "RECIBIR",
        "letter": "B",
        "statement": "Si lo requiero durante mi atención en el hospital, tengo derecho a beneficiarme de un acompañante y a recibir apoyo psicosocial o religioso.",
        "isTrue": True,
        "hintOnError": "Recuerda: Contar con un acompañante y recibir apoyo psicosocial o espiritual cuando lo requieras sí es uno de tus derechos (letra B de RECIBIR).",
        "successNote": "¡Es Verdadero! El acompañamiento y el apoyo psicosocial o religioso hacen parte del cuidado humanizado (letra B de RECIBIR).",
    },
    {
        "id": "m-puntualidad",
        "concept": "Documentación y puntualidad",
        "category": "DAR",
        "letter": "D",
        "statement": "Para agilizar mi turno en una consulta o procedimiento, puedo presentar el documento de identidad de un familiar o llegar a cualquier hora sin avisar.",
        "isTrue": False,
        "hintOnError": "¡Ten cuidado! Presentar el documento de otra persona pone en riesgo tu historia clínica. Nuestro deber (letra D de DAR) es presentar documentación real y ser puntuales.",
        "successNote": "¡Es Falso! Nuestro primer deber del acrónimo DAR (letra D) es presentar siempre documentación real y asistir puntualmente a las consultas y procedimientos.",
    },
    {
        "id": "m-amabilidad",
        "concept": "Amabilidad y respeto",
        "category": "DAR",
        "letter": "A",
        "statement": "Es mi deber como usuario o acompañante tratar con amabilidad, consideración y respeto al personal de salud y a las demás personas en el hospital.",
        "isTrue": True,
        "hintOnError": "Recuerda: Tratar con amabilidad y respeto a todas las personas en el hospital sí es un deber ciudadano fundamental (letra A de DAR).",
        "successNote": "¡Es Verdadero! La amabilidad y el respeto (letra A de DAR) construyen un ambiente seguro y cálido para todos.",
    },
    {
        "id": "m-normas",
        "concept": "Reconocimiento de las normas",
        "category": "DAR",
        "letter": "R",
        "statement": "Los horarios de visita, las normas de bioseguridad y los reglamentos del hospital son opcionales y solo deben cumplirlos los médicos y enfermeras.",
        "isTrue": False,
        "hintOnError": "Piénsalo de nuevo: Las normas y reglamentos del hospital nos protegen a todos y no son opcionales; cumplirlos es nuestro deber (letra R de DAR).",
        "successNote": "¡Es Falso! Reconocer y cumplir las normas y reglamentos de la institución es un deber de todos los usuarios y acompañantes (letra R de DAR).",
    },
    {
        "id": "m-atencion-integral",
        "concept": "Atención integral y oportuna",
        "category": "RECIBIR",
        "letter": "R",
        "statement": "Tengo derecho a recibir atención integral, oportuna y de calidad en salud, así como un trato prioritario y diferencial según mi condición.",
        "isTrue": True,
        "hintOnError": "Recuerda: Recibir atención en salud integral, oportuna, de calidad y con enfoque diferencial sí es tu primer derecho en RECIBIR (letra R).",
        "successNote": "¡Es Verdadero! La atención integral, oportuna y con enfoque diferencial encabeza tus derechos en RECIBIR (letra R).",
    },
    {
        "id": "m-inconformidades",
        "concept": "Expresar opiniones",
        "category": "RECIBIR",
        "letter": "E",
        "statement": "Puedo expresar mis opiniones, sugerencias, quejas, reclamos o felicitaciones de manera respetuosa a través de la oficina del SIAU o los buzones del hospital.",
        "isTrue": True,
        "hintOnError": "Recuerda: En el hospital sí tienes derecho a manifestar tus opiniones e inconformidades por los canales oficiales (letra E de RECIBIR).",
        "successNote": "¡Es Verdadero! Expresar tus opiniones e inconformidades (letra E de RECIBIR) mediante el SIAU o los buzones fortalece la calidad del servicio.",
    },
    {
        "id": "m-identificacion",
        "concept": "Identificación por mi nombre",
        "category": "RECIBIR",
        "letter": "I",
        "statement": "Durante mi atención en el hospital, el personal de salud no tiene por qué decirme su nombre y debe llamarme únicamente por el número de mi cama o turno.",
        "isTrue": False,
        "hintOnError": "Piénsalo bien: Tú no eres un número de cama ni de turno. Tienes derecho a conocer el nombre de quien te atiende y a ser llamado por tu propio nombre (letra I de RECIBIR).",
        "successNote": "¡Es Falso! Conocer el nombre de la persona que te atiende y ser llamado siempre por tu propio nombre es tu derecho (letra I de RECIBIR).",
    },
    {
        "id": "m-trato-humanizado",
        "concept": "Respeto y trato humanizado",
        "category": "RECIBIR",
        "letter": "R",
        "statement": "Tengo derecho a recibir respeto y un trato humanizado y digno sin importar mi condición socioeconómica, cultural, religiosa o ideológica.",
        "isTrue": True,
        "hintOnError": "Recuerda: El respeto y trato humanizado sin ningún tipo de discriminación sí es un derecho fundamental garantizado en la última R de RECIBIR.",
        "successNote": "¡Es Verdadero! El respeto y trato humanizado sin distinción alguna cierra con broche de oro el acrónimo RECIBIR.",
    },
]


def build_all_dialogues() -> dict[str, str]:
    items: dict[str, str] = {}

    # 1. Core dialogues
    c1_intro_text = (
        "¡Primer reto! Vamos a descubrir la diferencia entre DAR y RECIBIR. "
        "DAR nos recuerda nuestros deberes, como tratar a los demás con respeto. "
        "RECIBIR nos recuerda nuestros derechos, como recibir información clara sobre nuestra atención. "
        "Ahora, toca una tarjeta y llévala a la categoría correcta. ¡Vamos paso a paso!"
    )
    items["welcome_greeting"] = (
        "¡Hola! Soy Dari y voy a acompañarte en esta pequeña aventura. "
        "Hoy vamos a descubrir algo muy importante: tus derechos como usuario del hospital "
        "y los deberes que nos ayudan a convivir con respeto. "
        "Jugaremos tres retos cortitos y, al final, conocerás tu resultado. ¿Empezamos?"
    )
    items["welcome_instructions"] = (
        "¡Muy bien! Es muy fácil jugar. Lee cada tarjeta y sigue las indicaciones que aparecen en pantalla. "
        "Si necesitas ayuda, puedes escucharme otra vez. "
        "Y recuerda: aquí estamos para aprender, así que no te preocupes si te equivocas."
    )
    items["c1_intro"] = c1_intro_text
    items["c1_streak"] = (
        "¡Lo estás haciendo muy bien! Ya estás aprendiendo a reconocer la diferencia entre tus derechos y tus deberes."
    )
    items["c1_transition"] = (
        "¡Reto superado! Has aprendido algo nuevo sobre DAR y RECIBIR. "
        "Ahora vamos a ponerlo en práctica con situaciones cotidianas del hospital."
    )
    items["c2_intro"] = (
        "Ahora vamos a imaginar algunas situaciones que pueden ocurrir en el hospital. "
        "Lee cada caso y elige el derecho o el deber que corresponda. "
        "Piensa qué podría hacer una persona para recibir un trato respetuoso o cumplir sus deberes."
    )
    items["c2_transition"] = (
        "¡Excelente trabajo resolviendo las situaciones cotidianas! Ya estamos listos para el tercer y último reto."
    )
    items["c3_intro_g1"] = (
        "¡Llegamos al último reto! Ahora vamos a conectar algunos conceptos con su significado. "
        "Por ejemplo, el consentimiento previo está relacionado con las decisiones informadas sobre los tratamientos y los estudios de investigación. "
        "Lee las tarjetas y busca las parejas correctas. ¡Ya casi terminamos!"
    )
    items["c3_intro_g2"] = (
        "¡Muy bien! Completaste el primer grupo de conexiones. "
        "Vamos con las últimas tres parejas para conocer tu calificación final."
    )
    items["results_below_60"] = (
        "¡Buen esfuerzo! Todavía puedes aprender un poquito más. "
        "Necesitas obtener al menos 60 puntos para completar el juego. "
        "Vamos a repasar lo que te resultó más difícil y a intentarlo de nuevo. ¡Tú puedes!"
    )
    items["results_passed_60"] = (
        "¡Lo lograste! ¡Felicitaciones! Has completado el recorrido DAR Y RECIBIR. "
        "Ahora conoces mejor tus derechos como usuario y los deberes que ayudan a construir una atención respetuosa. "
        "Gracias por participar. ¡Recuerda que tus derechos son importantes!"
    )

    # 2. Challenge 1 cards
    for card in CHALLENGE_1_BANK:
        cid = card["id"]
        items[f"c1_prompt_first_{cid}"] = (
            f"{c1_intro_text} Mira esta primera tarjeta: “{card['text']}”."
        )
        items[f"c1_prompt_{cid}"] = (
            f"Leamos esta tarjeta: “{card['text']}”. "
            "¿Crees que es un deber que debemos cumplir (DAR) o un derecho que podemos recibir (RECIBIR)?"
        )

        if card["category"] == "DAR":
            cat_exp = (
                f"¡Muy bien! Esa es la categoría correcta. Recuerda: {card['text'].lower()} "
                f"es un deber ({card['letter']} de DAR) que debemos procurar cumplir."
            )
            target_label = "un deber (DAR)"
        else:
            cat_exp = (
                f"¡Muy bien! Esa es la categoría correcta. En la letra {card['letter']} de RECIBIR "
                f"recordamos nuestro derecho a {card['conceptTitle'].lower()}."
            )
            target_label = "un derecho (RECIBIR)"

        items[f"c1_ok_{cid}"] = cat_exp
        items[f"c1_ok_streak_{cid}"] = (
            f"{cat_exp} ¡Lo estás haciendo muy bien! Ya estás aprendiendo a reconocer tus derechos y deberes."
        )
        items[f"c1_ok_last_{cid}"] = (
            f"{cat_exp} ¡Reto superado! Has aprendido algo nuevo. Ahora vamos a ponerlo en práctica con una situación cotidiana."
        )

        clean_inc = card["incorrectFeedback"].replace(
            "¡Vamos a aprenderlo juntos! ", ""
        )
        items[f"c1_err_{cid}"] = (
            f"¡No pasa nada! Estamos aquí para aprender. Esta tarjeta corresponde a {target_label}. "
            f"{clean_inc} ¡Toca el botón {card['category']} para continuar!"
        )

    # 3. Challenge 2 scenarios
    for sc in CHALLENGE_2_DATA:
        sid = sc["id"]
        prefix = (
            "Ahora vamos a imaginar algunas situaciones que pueden ocurrir en el hospital. "
            if sc["index"] == 0
            else ""
        )
        items[f"c2_prompt_{sid}"] = f"{prefix}{sc['prompt']}"

        transition = (
            " ¡Has superado el segundo reto! Vamos ahora al último reto para conectar lo aprendido."
            if sc["isLast"]
            else ""
        )
        items[f"c2_ok_{sid}"] = f"{sc['success']}{transition}"

        for opt_id, opt_feedback in sc["wrongOptions"]:
            items[f"c2_err_{opt_id}"] = (
                "Casi lo tienes. Pensemos juntos: ¿estamos hablando de algo que la persona tiene derecho a recibir "
                f"o de un deber que debe cumplir? {opt_feedback}"
            )

    # 4. Challenge 3 pairs
    items["c3_group_done_0"] = (
        "¡Excelente! Conectaste las tres parejas de este grupo. Toca el botón de abajo para pasar al segundo grupo."
    )
    items["c3_group_done_1"] = (
        "¡Felicitaciones! Has conectado todos los conceptos de DAR y RECIBIR. Toca el botón para conocer tu calificación final."
    )

    for pair in CHALLENGE_3_PAIRS:
        pid = pair["id"]
        items[f"c3_tf_first_{pid}"] = (
            f"¡Llegamos al tercer y último reto: Verdadero o Falso! "
            f"Analicemos esta afirmación sobre “{pair['concept']}”: “{pair['statement']}”. "
            "¿Crees que es verdadero o falso?"
        )
        items[f"c3_tf_prompt_{pid}"] = (
            f"Leamos esta afirmación sobre “{pair['concept']}”: “{pair['statement']}”. "
            "¿Crees que es verdadero o falso?"
        )
        items[f"c3_tf_ok_{pid}"] = f"¡Muy bien! {pair['successNote']}"
        target_btn = "Verdadero" if pair["isTrue"] else "Falso"
        items[f"c3_tf_err_{pid}"] = (
            f"¡No te preocupes, aprendamos juntos! {pair['hintOnError']} "
            f"Toca el botón {target_btn} para continuar."
        )

    # 5. Institutional Principles (Cartilla y Repaso)
    for p in PRINCIPLES:
        pid = p["id"]
        kind = "Deber" if p["category"] == "DAR" else "Derecho"
        items[f"principle_{pid}"] = (
            f"{kind} con la letra {p['letter']} de {p['category']}: {p['shortTitle']}. "
            f"{p['officialText']} {p['citizenExplanation']}"
        )

    # 6. Nuevos diálogos del diseño móvil intuitivo (Inicio, FAQs de Dari, lectura de tarjetas y trivia)
    items["home_dari_welcome"] = (
        "¡Hola! Soy Dari, tu guía de Trato Digno en el Hospital Erasmo Meoz. "
        "Hoy descubriremos juntos tus derechos en salud y los deberes que nos permiten convivir con respeto y calidez."
    )

    faqs = [
        (
            "faq_0",
            "En Urgencias no se atiende por orden de llegada, sino por la gravedad de la persona según el sistema nacional de Triage. Un dolor severo de pecho, asfixia o pérdida del conocimiento siempre tendrán prioridad vital sobre casos que pueden esperar sin riesgo de muerte. Comprender esto salva vidas.",
        ),
        (
            "faq_1",
            "¡Totalmente! Es tu derecho fundamental. Si el médico o enfermera usa palabras médicas complejas que no entiendes, puedes decir con tranquilidad: Doctor, por favor explíqueme en palabras sencillas qué tengo y cómo debo cuidarme. El equipo de salud tiene el deber de hacértelo entender.",
        ),
        (
            "faq_2",
            "Sí. Tienes derecho a pedir otro concepto profesional ante diagnósticos de alta complejidad o cirugías mayores, y ningún tratamiento experimental o quirúrgico puede realizarse sin tu consentimiento informado previo firmado.",
        ),
        (
            "faq_3",
            "Los niños, adultos mayores, personas con discapacidad o mujeres en trabajo de parto tienen derecho prioritario a contar con un acompañante permanente según las condiciones de bioseguridad del servicio. Además, tienes derecho a recibir apoyo psicológico o espiritual de tu fe.",
        ),
        (
            "faq_4",
            "Presentar tu documento real garantiza que no se confunda tu historia clínica con la de otra persona, protegiendo tus exámenes y prescripciones. La puntualidad permite que el tiempo asignado a tu salud se aproveche al máximo sin retrasar a otros pacientes.",
        ),
    ]
    for fid, ftext in faqs:
        items[fid] = ftext

    for card in CHALLENGE_1_BANK:
        cid = card["id"]
        items[f"c1_read_{cid}"] = (
            f"Situación a clasificar: {card['text']} "
            "Decide si es un deber que cumplimos, Dar, o un derecho que nos protege, Recibir."
        )

    return items


async def generate_one(
    sem: asyncio.Semaphore,
    voice_key: str,
    voice_id: str,
    clip_id: str,
    raw_text: str,
) -> None:
    out_dir = AUDIO_DIR / voice_key
    out_dir.mkdir(parents=True, exist_ok=True)
    out_file = out_dir / f"{clip_id}.mp3"

    if out_file.exists() and out_file.stat().st_size > 500:
        return

    spoken = normalize_for_colombian_tts(raw_text)
    async with sem:
        for attempt in range(3):
            try:
                communicate = edge_tts.Communicate(
                    text=spoken,
                    voice=voice_id,
                    rate="+0%",
                    pitch="+0Hz",
                )
                await communicate.save(str(out_file))
                return
            except Exception as exc:
                if attempt == 2:
                    print(f"[ERROR] {voice_key}/{clip_id}: {exc}")
                await asyncio.sleep(0.8 * (attempt + 1))


async def main() -> None:
    dialogues = build_all_dialogues()
    print(f"Total dialogues per voice: {len(dialogues)}")

    sem = asyncio.Semaphore(10)
    for voice_key, voice_id in VOICES.items():
        print(f"Generating Colombian neural voice pack: {voice_key} ({voice_id})...")
        tasks = [
            generate_one(sem, voice_key, voice_id, clip_id, text)
            for clip_id, text in dialogues.items()
        ]
        await asyncio.gather(*tasks)
        out_dir = AUDIO_DIR / voice_key
        generated_count = len(list(out_dir.glob("*.mp3")))
        print(f"Completed {voice_key}: {generated_count}/{len(dialogues)} MP3 files.")


if __name__ == "__main__":
    asyncio.run(main())
