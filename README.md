# Videojuego Educativo: “DAR Y RECIBIR: ¡Conoce tus derechos, cumple tus deberes!”
### Con el Avatar Guía Interactivo **“Dari”** • E.S.E. Hospital Universitario Erasmo Meoz

Aplicación web educativa, interactiva, accesible y *mobile-first* diseñada para pacientes, familiares y acompañantes durante sus tiempos de espera en la **E.S.E. Hospital Universitario Erasmo Meoz**, con el apoyo del **Programa de Enfermería de la Universidad Francisco de Paula Santander (UFPS)**.

---

## 1. Propósito y Características Principales

- **Compañero Guía Interactivo (“Dari”)**: Orientador ciudadano hospitalario con 6 estados emocionales y visuales (`welcome`, `explaining`, `listening`, `happy`, `encouraging`, `celebrating`), microanimaciones suaves (parpadeo, balanceo ligero, saludo, ondas de voz) y diálogos contextuales sincronizados con cada etapa y acción del usuario.
- **Acceso inmediato por código QR**: Sin registro, sin inicio de sesión, sin formularios y sin recopilación de datos personales.
- **Duración ágil (3 a 5 minutos)**: Experiencia guiada dividida en una bienvenida y **3 retos interactivos**.
- **Fidelidad institucional**: Basada íntegramente en los afiches oficiales *“Deberes y Derechos de los Usuarios (DAR Y RECIBIR)”* y *“Carta del Trato Digno del Ciudadano”*.
- **Aprendizaje progresivo con voz natural**: Cada acierto o error brinda retroalimentación inmediata, amable y respetuosa de parte de Dari, sin bloquear al usuario ni penalizarlo con frustración.

---

## 2. Arquitectura de Voz Natural y Configuración

El sistema de voz en [`src/hooks/useSpeech.ts`](./src/hooks/useSpeech.ts) está desacoplado de la lógica de los retos y admite tres modalidades jerárquicas sin enviar jamás información personal:

### Opción B (Activa por defecto, 100% local y sin costo): Voces del Navegador con Prosodia Conversacional
- Detecta y clasifica automáticamente las voces en español disponibles en el teléfono o computador del usuario, **priorizando voces Neurales / Naturales en Español de Colombia (`es-CO`)** (como *Microsoft Salome Online (Natural) - Spanish (Colombia)* o *Microsoft Gonzalo Online (Natural)* en Edge/Windows, *Google español* en Android/Chrome, o voces mejoradas en iOS) y Español Latinoamericano (`es-419`, `es-MX`, `es-US`).
- Incluye el normalizador fonético `normalizeTextForNaturalSpeech` y segmentación por oraciones con pausas conversacionales de `110 ms`, logrando una lectura cálida y pausada.
- Si el dispositivo cuenta con varias voces en español, aparece el botón **“Voz”** en la barra de Dari para que el usuario elija su voz preferida.

### Opción A (Opcional): Servicio de Voz Neural Externo de Alta Calidad
- Si la institución desea conectar un servicio de síntesis neural en la nube (por ejemplo, a través de un proxy institucional seguro hacia Google Cloud TTS Neural2/Journey, Azure AI Speech `es-CO-SalomeNeural` o ElevenLabs sin exponer claves privadas en el navegador):
  1. Crea un archivo `.env` en la raíz del proyecto con la URL del endpoint institucional:
     ```env
     VITE_NEURAL_TTS_URL=https://tu-endpoint-institucional.gov.co/api/tts
     ```
  2. El hook enviará únicamente el texto educativo (`{ text, lang: "es-CO", voice: "dari-colombia-warm" }`), mostrará el indicador *"Preparando voz..."*, almacenará en caché el audio generado (`Blob URL`) para que repetir el mensaje sea instantáneo y, si no hay conexión o el servidor falla, **recurrirá automáticamente a la voz del navegador (Opción B)** sin interrumpir la partida.

### Opción C (Opcional): Audios Humanos Pregrabados
- Cualquier diálogo en [`src/data/dariDialogues.ts`](./src/data/dariDialogues.ts) admite la propiedad opcional `preRecordedAudioUrl` (por ejemplo, `preRecordedAudioUrl: '/recursos/audio/welcome_greeting.mp3'`). Si se proporciona el archivo en `public/recursos/audio/`, Dari reproducirá la grabación humana y usará la síntesis del navegador como respaldo automático.

---

## 3. Estructura de Archivos del Proyecto

```text
├── Recursos/                              # Archivos originales institucionales de referencia
├── public/
│   └── recursos/                          # Recursos estáticos servidos por la aplicación web
│       ├── logo-hospital.jpeg             # Logotipo oficial E.S.E. Hospital Universitario Erasmo Meoz
│       ├── logo-ufps.png                  # Logotipo oficial UFPS - Programa de Enfermería
│       ├── poster-derechos-deberes.jpeg   # Afiche oficial Deberes y Derechos (DAR Y RECIBIR)
│       ├── poster-trato-digno.jpeg        # Afiche oficial Carta del Trato Digno del Ciudadano
│       └── paleta-colores.png             # Paleta cromática de referencia
├── src/
│   ├── components/
│   │   ├── DariAvatar.tsx                 # Personaje animado "Dari" con 6 poses y microanimaciones SVG
│   │   ├── DariGuideBar.tsx               # Globo de diálogo contextual y controles accesibles de voz
│   │   ├── Header.tsx                     # Barra institucional, progreso, selector de letra y cartilla
│   │   ├── WelcomeScreen.tsx              # Pantalla 1: Bienvenida con saludo y explicación de Dari
│   │   ├── Challenge1Sort.tsx             # Pantalla 2: Reto 1 "¿Dónde va cada uno?" (Táctil + Drag & Drop)
│   │   ├── Challenge2Situations.tsx       # Pantalla 3: Reto 2 "¿Qué harías en esta situación?"
│   │   ├── Challenge3Match.tsx            # Pantalla 4: Reto 3 "Conecta y completa" (2 grupos de 3)
│   │   ├── ResultsScreen.tsx              # Pantalla 5: Resultados (< 60 repetir / >= 60 felicitación)
│   │   ├── ReferenceModal.tsx             # Cartilla completa DAR Y RECIBIR, canales SIAU y afiches
│   │   ├── Illustrations.tsx              # Ilustraciones SVG sanitarias de escenas y bienvenida
│   │   └── IconBadge.tsx                  # Iconografía accesible unificada
│   ├── data/
│   │   ├── dariDialogues.ts               # Banco centralizado de diálogos contextuales de Dari
│   │   └── institutionalContent.ts        # Banco de los 3 deberes, 7 derechos, casos, parejas y canales SIAU
│   ├── hooks/
│   │   └── useSpeech.ts                   # Arquitectura de voz (Pregrabada / Neural / Navegador es-CO)
│   ├── styles/
│   │   └── app.css                        # Estilos mobile-first, microanimaciones de Dari y accesibilidad
│   ├── types/
│   │   └── game.ts                        # Tipado estricto en TypeScript (DariPose, DariDialogue, etc.)
│   ├── utils/
│   │   └── scoring.ts                     # Lógica documentada de puntuación sobre 100 puntos
│   ├── App.tsx                            # Orquestador de estado de la partida y navegación
│   └── main.tsx                           # Punto de entrada React
├── tests/
│   └── run-browser-qa.mjs                 # Suite de pruebas automatizadas E2E en navegador real
└── README.md                              # Documentación técnica y guía de despliegue
```

---

## 4. Sistema de Puntuación (Sobre 100 Puntos)

Documentado en [`src/utils/scoring.ts`](./src/utils/scoring.ts):
- **Reto 1 (30 puntos máx.)**: 6 tarjetas × 5 puntos cada una (`5 pts` al 1.er intento, `2 pts` tras 1 corrección, `0 pts` tras 2+ errores).
- **Reto 2 (40 puntos máx.)**: 5 situaciones × 8 puntos cada una (`8 pts` al 1.er intento, `4 pts` en el 2.º intento, `0 pts` tras 2+ errores).
- **Reto 3 (30 puntos máx.)**: 6 parejas × 5 puntos cada una (`5 pts` al 1.er intento, `2 pts` tras 1 pista, `0 pts` tras 2+ errores).
- **Umbral de aprobación**: **60 puntos**.

---

## 5. Instalación, Desarrollo y Construcción para Producción

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar en modo desarrollo
npm run dev

# 3. Construir versión optimizada de producción en dist/
npm run build

# 4. Ejecutar pruebas automatizadas E2E en navegador real
node tests/run-browser-qa.mjs
```
