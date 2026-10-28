export type CategoryType = 'DAR' | 'RECIBIR';

export type ScreenStage =
  | 'welcome'
  | 'challenge1'
  | 'challenge2'
  | 'challenge3'
  | 'results';

export type IconName =
  | 'id-card'
  | 'clock'
  | 'heart-handshake'
  | 'clipboard-check'
  | 'stethoscope'
  | 'message-square'
  | 'file-signature'
  | 'shield-check'
  | 'users'
  | 'user-check'
  | 'scale'
  | 'sparkles';

/**
 * Estados visuales y emocionales del avatar guía "Dari"
 */
export type DariPose =
  | 'welcome'      // Saludo y bienvenida
  | 'explaining'   // Explicación de instrucciones o conceptos
  | 'listening'    // Escucha o espera atenta mientras el usuario interactúa
  | 'happy'        // Alegría al acertar una actividad
  | 'encouraging'  // Ánimo comprensivo ante un error o pista
  | 'celebrating'; // Celebración al superar un reto o aprobar el juego

/**
 * Eventos de la máquina de estados de diálogo de Dari
 */
export type DariDialogueEvent =
  | 'welcome_start'
  | 'welcome_instructions'
  | 'challenge_enter'
  | 'case_present'
  | 'answer_correct'
  | 'answer_incorrect'
  | 'hint_requested'
  | 'challenge_transition'
  | 'game_result'
  | 'game_restart';

export interface DariDialogue {
  id: string;
  event: DariDialogueEvent;
  pose: DariPose;
  speakerTitle: string;
  text: string;
  spokenText?: string; // Texto optimizado fonéticamente para síntesis de voz si difiere
  preRecordedAudioUrl?: string; // Ruta opcional si se dispone de grabación humana
}

export interface InstitutionalPrinciple {
  id: string;
  category: CategoryType;
  letter: string;
  shortTitle: string;
  officialText: string;
  citizenExplanation: string;
  practicalExample: string;
  icon: IconName;
}

export interface SortCardItem {
  id: string;
  principleId: string;
  text: string;
  category: CategoryType;
  letter: string;
  conceptTitle: string;
  icon: IconName;
  correctFeedback: string;
  incorrectFeedback: string;
}

export interface ScenarioOption {
  id: string;
  text: string;
  isCorrect: boolean;
  categoryLabel: CategoryType;
  feedback: string;
}

export interface ScenarioItem {
  id: string;
  principleId: string;
  title: string;
  categoryBadge: string;
  situationText: string;
  question: string;
  illustrationType:
    | 'medical-info'
    | 'punctual-arrival'
    | 'express-opinion'
    | 'informed-consent'
    | 'respectful-name'
    | 'companion-support';
  options: ScenarioOption[];
  reinforcementTip: string;
}

export interface MatchPairItem {
  id: string;
  principleId: string;
  concept: string;
  category: CategoryType;
  letter: string;
  description: string;
  icon: IconName;
  hintOnError: string;
  successNote: string;
}

export interface ChallengeScoreDetail {
  challenge1Points: number; // Max 30
  challenge2Points: number; // Max 40
  challenge3Points: number; // Max 30
  totalScore: number;       // Max 100
  challenge1CorrectFirstTry: number;
  challenge1Total: number;
  challenge2CorrectFirstTry: number;
  challenge2Total: number;
  challenge3CorrectFirstTry: number;
  challenge3Total: number;
  missedPrincipleIds: string[];
}
