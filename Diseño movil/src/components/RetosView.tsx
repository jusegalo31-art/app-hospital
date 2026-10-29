/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  CHALLENGE_CARDS,
  CASE_DILEMMAS,
  QUIZ_QUESTIONS,
  ChallengeCard,
} from '../data/rightsAndDuties';
import {
  calculateProgress,
  evaluateChallengeCard,
  getScoreLevel,
} from '../utils/gameLogic';
import { DariAvatar } from './DariAvatar';
import {
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Trophy,
  Award,
  Share2,
  Sparkles,
  HelpCircle,
  FileCheck2,
  Volume2,
} from 'lucide-react';

interface RetosViewProps {
  onSpeak: (text: string) => void;
  isSpeaking: boolean;
  isLargeFont: boolean;
}

export const RetosView: React.FC<RetosViewProps> = ({
  onSpeak,
  isSpeaking,
  isLargeFont,
}) => {
  // Navigation between the 3 challenges
  const [activeReto, setActiveReto] = useState<1 | 2 | 3>(1);

  // --- RETO 1 STATE: Card Classification (DAR vs RECIBIR) ---
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [cardFeedback, setCardFeedback] = useState<{
    isAnswered: boolean;
    isCorrect: boolean;
    message: string;
  } | null>(null);
  const [reto1Score, setReto1Score] = useState(0);
  const [reto1Completed, setReto1Completed] = useState(false);

  // --- RETO 2 STATE: Real Clinical Dilemmas ---
  const [currentCaseIndex, setCurrentCaseIndex] = useState(0);
  const [selectedCaseOption, setSelectedCaseOption] = useState<string | null>(null);
  const [caseSubmitted, setCaseSubmitted] = useState(false);
  const [reto2Score, setReto2Score] = useState(0);
  const [reto2Completed, setReto2Completed] = useState(false);

  // --- RETO 3 STATE: Quiz & Certification ---
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [reto3Score, setReto3Score] = useState(0);
  const [reto3Completed, setReto3Completed] = useState(false);

  // Certificate / Final completion state
  const [userName, setUserName] = useState('');
  const [showCertificate, setShowCertificate] = useState(false);

  // --- RETO 1 HANDLERS ---
  const currentCard: ChallengeCard = CHALLENGE_CARDS[currentCardIndex];

  const handleClassify = (chosenCategory: 'DAR' | 'RECIBIR') => {
    if (cardFeedback?.isAnswered) return;

    const isCorrect = evaluateChallengeCard(chosenCategory, currentCard.correctCategory);
    if (isCorrect) {
      setReto1Score((prev) => prev + 1);
    }

    setCardFeedback({
      isAnswered: true,
      isCorrect,
      message: currentCard.explanation,
    });

    onSpeak(
      `${isCorrect ? '¡Correcto!' : '¡Ten cuidado!'} ${currentCard.explanation}`
    );
  };

  const handleNextCard = () => {
    setCardFeedback(null);
    if (currentCardIndex + 1 < CHALLENGE_CARDS.length) {
      setCurrentCardIndex((prev) => prev + 1);
    } else {
      setReto1Completed(true);
    }
  };

  const resetReto1 = () => {
    setCurrentCardIndex(0);
    setCardFeedback(null);
    setReto1Score(0);
    setReto1Completed(false);
  };

  // --- RETO 2 HANDLERS ---
  const currentCase = CASE_DILEMMAS[currentCaseIndex];

  const handleSelectCaseOption = (optionId: string) => {
    if (caseSubmitted) return;
    setSelectedCaseOption(optionId);
  };

  const handleSubmitCase = () => {
    if (!selectedCaseOption) return;
    setCaseSubmitted(true);
    const chosen = currentCase.options.find((o) => o.id === selectedCaseOption);
    if (chosen?.isCorrect) {
      setReto2Score((prev) => prev + 1);
      onSpeak(`¡Excelente decisión! ${chosen.feedback}`);
    } else {
      onSpeak(`Atención: ${chosen?.feedback || ''}`);
    }
  };

  const handleNextCase = () => {
    setSelectedCaseOption(null);
    setCaseSubmitted(false);
    if (currentCaseIndex + 1 < CASE_DILEMMAS.length) {
      setCurrentCaseIndex((prev) => prev + 1);
    } else {
      setReto2Completed(true);
    }
  };

  const resetReto2 = () => {
    setCurrentCaseIndex(0);
    setSelectedCaseOption(null);
    setCaseSubmitted(false);
    setReto2Score(0);
    setReto2Completed(false);
  };

  // --- RETO 3 HANDLERS ---
  const currentQuiz = QUIZ_QUESTIONS[currentQuizIndex];

  const handleSelectQuiz = (index: number) => {
    if (quizSubmitted) return;
    setSelectedQuizAnswer(index);
  };

  const handleSubmitQuiz = () => {
    if (selectedQuizAnswer === null) return;
    setQuizSubmitted(true);
    const isCorrect = selectedQuizAnswer === currentQuiz.correctIndex;
    if (isCorrect) {
      setReto3Score((prev) => prev + 1);
      onSpeak(`¡Respuesta acertada! ${currentQuiz.explanation}`);
    } else {
      onSpeak(`Recuerda: ${currentQuiz.explanation}`);
    }
  };

  const handleNextQuiz = () => {
    setSelectedQuizAnswer(null);
    setQuizSubmitted(false);
    if (currentQuizIndex + 1 < QUIZ_QUESTIONS.length) {
      setCurrentQuizIndex((prev) => prev + 1);
    } else {
      setReto3Completed(true);
    }
  };

  const resetReto3 = () => {
    setCurrentQuizIndex(0);
    setSelectedQuizAnswer(null);
    setQuizSubmitted(false);
    setReto3Score(0);
    setReto3Completed(false);
    setShowCertificate(false);
  };

  // Total scores
  const totalCorrect = reto1Score + reto2Score + reto3Score;
  const totalQuestions =
    CHALLENGE_CARDS.length + CASE_DILEMMAS.length + QUIZ_QUESTIONS.length;
  const overallPercentage = calculateProgress(totalCorrect, totalQuestions);
  const badgeInfo = getScoreLevel(totalCorrect, totalQuestions);

  return (
    <div className={`space-y-4 pb-8 ${isLargeFont ? 'text-lg' : 'text-sm'}`}>
      {/* Retos Selector Header */}
      <div className="bg-white rounded-2xl p-3 border border-slate-200/90 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-teal-800">
            Juego Educativo • Trato Digno
          </span>
          <span className="text-xs font-semibold text-slate-700">
            Puntos: {totalCorrect}/{totalQuestions}
          </span>
        </div>

        {/* Retos Tab Strip */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => setActiveReto(1)}
            className={`py-2 px-1 text-center rounded-lg transition-all min-h-[44px] flex flex-col items-center justify-center ${
              activeReto === 1
                ? 'bg-white text-teal-900 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900 font-medium'
            }`}
          >
            <span className="text-xs leading-none">Reto 1</span>
            <span className="text-[10px] text-slate-500 mt-0.5">
              {reto1Completed ? '✓ Completado' : 'Clasificador'}
            </span>
          </button>

          <button
            onClick={() => setActiveReto(2)}
            className={`py-2 px-1 text-center rounded-lg transition-all min-h-[44px] flex flex-col items-center justify-center ${
              activeReto === 2
                ? 'bg-white text-teal-900 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900 font-medium'
            }`}
          >
            <span className="text-xs leading-none">Reto 2</span>
            <span className="text-[10px] text-slate-500 mt-0.5">
              {reto2Completed ? '✓ Completado' : 'Casos Reales'}
            </span>
          </button>

          <button
            onClick={() => setActiveReto(3)}
            className={`py-2 px-1 text-center rounded-lg transition-all min-h-[44px] flex flex-col items-center justify-center ${
              activeReto === 3
                ? 'bg-white text-teal-900 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900 font-medium'
            }`}
          >
            <span className="text-xs leading-none">Reto 3</span>
            <span className="text-[10px] text-slate-500 mt-0.5">
              {reto3Completed ? '✓ Insignia' : 'Trivia Final'}
            </span>
          </button>
        </div>
      </div>

      {/* ================================================================ */}
      {/* RETO 1: CLASIFICADOR DE TARJETAS (DAR vs RECIBIR)                */}
      {/* ================================================================ */}
      {activeReto === 1 && (
        <div className="space-y-4">
          {!reto1Completed ? (
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs space-y-4">
              {/* Progress and instructions */}
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-teal-800">
                  Tarjeta {currentCardIndex + 1} de {CHALLENGE_CARDS.length}
                </span>
                <span className="text-slate-500">
                  Progreso: {calculateProgress(currentCardIndex, CHALLENGE_CARDS.length)}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-teal-600 h-1.5 rounded-full transition-all duration-300"
                  style={{
                    width: `${calculateProgress(currentCardIndex, CHALLENGE_CARDS.length)}%`,
                  }}
                />
              </div>

              {/* Dari Speech Prompt */}
              <div className="flex items-start gap-2.5 bg-teal-50/70 p-3 rounded-xl border border-teal-100">
                <DariAvatar size="sm" isSpeaking={isSpeaking} />
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-slate-700 leading-relaxed">
                    Lee la situación y decide si es un deber que cumplimos (<strong>DAR</strong>) o un derecho que nos protege (<strong>RECIBIR</strong>).
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onSpeak(currentCard.text)}
                  className="p-1 text-teal-700 hover:text-teal-900 shrink-0"
                  title="Escuchar texto de la tarjeta"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              {/* Situation Card */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 text-center space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Situación a clasificar
                </span>
                <p className="text-sm sm:text-base font-semibold text-slate-900 leading-snug">
                  “{currentCard.text}”
                </p>
              </div>

              {/* Decision Buttons (Touch targets in thumb reach) */}
              {!cardFeedback?.isAnswered ? (
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <button
                    onClick={() => handleClassify('DAR')}
                    className="py-3.5 px-3 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-200/90 font-bold text-center transition-transform active:scale-[0.98] min-h-[54px] flex flex-col items-center justify-center shadow-2xs"
                  >
                    <span className="text-base tracking-wide">DAR</span>
                    <span className="text-[10px] text-teal-700 font-normal">Mis Deberes</span>
                  </button>

                  <button
                    onClick={() => handleClassify('RECIBIR')}
                    className="py-3.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200/90 font-bold text-center transition-transform active:scale-[0.98] min-h-[54px] flex flex-col items-center justify-center shadow-2xs"
                  >
                    <span className="text-base tracking-wide">RECIBIR</span>
                    <span className="text-[10px] text-emerald-700 font-normal">Mis Derechos</span>
                  </button>
                </div>
              ) : (
                /* Immediate Educational Feedback */
                <div
                  className={`p-4 rounded-xl border space-y-2 ${
                    cardFeedback.isCorrect
                      ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                      : 'bg-amber-50/80 border-amber-200 text-amber-950'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {cardFeedback.isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-amber-600 shrink-0" />
                    )}
                    <span className="font-bold text-sm">
                      {cardFeedback.isCorrect ? '¡Excelente!' : '¡Ten presente!'}
                    </span>
                  </div>

                  <p className="text-xs leading-relaxed text-slate-700">
                    {cardFeedback.message}
                  </p>

                  <button
                    onClick={handleNextCard}
                    className="mt-2 w-full py-2.5 rounded-lg bg-slate-900 text-white font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-slate-800 transition-colors"
                  >
                    <span>
                      {currentCardIndex + 1 < CHALLENGE_CARDS.length
                        ? 'Siguiente Tarjeta'
                        : 'Ver Resultado del Reto 1'}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Reto 1 Completion Card */
            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs text-center space-y-4">
              <div className="w-14 h-14 bg-teal-50 text-teal-700 rounded-full flex items-center justify-center mx-auto border border-teal-200">
                <Trophy className="w-7 h-7" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  ¡Reto 1 Completado!
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  Has clasificado las 6 tarjetas con éxito. Obtuviste {reto1Score} de {CHALLENGE_CARDS.length} aciertos.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <button
                  onClick={() => setActiveReto(2)}
                  className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <span>Continuar con Reto 2 (Casos Reales)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={resetReto1}
                  className="py-3 px-4 rounded-xl bg-white border border-slate-200 text-slate-700 font-medium text-xs flex items-center justify-center gap-1.5 hover:bg-slate-50"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Repetir Reto 1</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================================================================ */}
      {/* RETO 2: CASOS CLÍNICOS Y DILEMAS EN EL HOSPITAL                 */}
      {/* ================================================================ */}
      {activeReto === 2 && (
        <div className="space-y-4">
          {!reto2Completed ? (
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-teal-800">
                  Caso {currentCaseIndex + 1} de {CASE_DILEMMAS.length} • {currentCase.context}
                </span>
                <span className="text-slate-500">
                  Puntos: {reto2Score}
                </span>
              </div>

              {/* Situation Box */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-teal-800 uppercase">
                    Situación en {currentCase.context}
                  </span>
                  <button
                    onClick={() => onSpeak(currentCase.situation)}
                    className="p-1 text-slate-500 hover:text-teal-700"
                    title="Escuchar caso"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                  {currentCase.situation}
                </p>
              </div>

              {/* Question */}
              <div className="space-y-2">
                <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                  {currentCase.question}
                </h4>

                {/* Options List */}
                <div className="space-y-2 pt-1">
                  {currentCase.options.map((opt) => {
                    const isSelected = selectedCaseOption === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => handleSelectCaseOption(opt.id)}
                        disabled={caseSubmitted}
                        className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm transition-all flex items-start gap-3 min-h-[48px] ${
                          isSelected
                            ? 'bg-teal-50 border-teal-500 text-teal-950 font-medium'
                            : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        <span
                          className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold ${
                            isSelected
                              ? 'border-teal-600 bg-teal-600 text-white'
                              : 'border-slate-300 text-slate-500'
                          }`}
                        >
                          {isSelected ? '✓' : ''}
                        </span>
                        <span className="leading-snug">{opt.text}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submit or Next Button */}
              {!caseSubmitted ? (
                <button
                  onClick={handleSubmitCase}
                  disabled={!selectedCaseOption}
                  className={`w-full py-3 rounded-xl font-semibold text-xs transition-colors min-h-[44px] ${
                    selectedCaseOption
                      ? 'bg-teal-700 hover:bg-teal-800 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  Confirmar mi respuesta
                </button>
              ) : (
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-teal-900">
                    <Sparkles className="w-4 h-4 text-teal-600" />
                    <span>Lección clave aprendida:</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {currentCase.lesson}
                  </p>
                  <button
                    onClick={handleNextCase}
                    className="w-full py-2.5 rounded-lg bg-slate-900 text-white font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-slate-800"
                  >
                    <span>
                      {currentCaseIndex + 1 < CASE_DILEMMAS.length
                        ? 'Siguiente Caso Clínico'
                        : 'Finalizar Reto 2'}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs text-center space-y-4">
              <div className="w-14 h-14 bg-emerald-50 text-emerald-700 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
                <FileCheck2 className="w-7 h-7" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  ¡Excelente dominio de casos!
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  Completaste los 3 casos clínicos reales con {reto2Score} aciertos.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <button
                  onClick={() => setActiveReto(3)}
                  className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs flex items-center justify-center gap-1.5"
                >
                  <span>Ir a Reto 3 (Certificado de Trato Digno)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={resetReto2}
                  className="py-3 px-4 rounded-xl bg-white border border-slate-200 text-slate-700 font-medium text-xs flex items-center justify-center gap-1.5 hover:bg-slate-50"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Repetir Casos</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================================================================ */}
      {/* RETO 3: TRIVIA FINAL Y CERTIFICADO DE TRATO DIGNO                */}
      {/* ================================================================ */}
      {activeReto === 3 && (
        <div className="space-y-4">
          {!reto3Completed ? (
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-teal-800">
                  Pregunta {currentQuizIndex + 1} de {QUIZ_QUESTIONS.length}
                </span>
                <span className="text-slate-500">
                  Puntaje: {reto3Score}
                </span>
              </div>

              <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                {currentQuiz.question}
              </h4>

              <div className="space-y-2 pt-1">
                {currentQuiz.options.map((optionText, idx) => {
                  const isSelected = selectedQuizAnswer === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectQuiz(idx)}
                      disabled={quizSubmitted}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm transition-all flex items-start gap-3 min-h-[48px] ${
                        isSelected
                          ? 'bg-teal-50 border-teal-500 text-teal-950 font-medium'
                          : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <span
                        className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold ${
                          isSelected
                            ? 'border-teal-600 bg-teal-600 text-white'
                            : 'border-slate-300 text-slate-500'
                        }`}
                      >
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="leading-snug">{optionText}</span>
                    </button>
                  );
                })}
              </div>

              {!quizSubmitted ? (
                <button
                  onClick={handleSubmitQuiz}
                  disabled={selectedQuizAnswer === null}
                  className={`w-full py-3 rounded-xl font-semibold text-xs transition-colors min-h-[44px] ${
                    selectedQuizAnswer !== null
                      ? 'bg-teal-700 hover:bg-teal-800 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  Verificar Respuesta
                </button>
              ) : (
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {currentQuiz.explanation}
                  </p>
                  <button
                    onClick={handleNextQuiz}
                    className="w-full py-2.5 rounded-lg bg-slate-900 text-white font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-slate-800"
                  >
                    <span>
                      {currentQuizIndex + 1 < QUIZ_QUESTIONS.length
                        ? 'Siguiente Pregunta'
                        : 'Generar Certificado'}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* CERTIFICADO INTERACTIVO PERSONALIZADO */
            <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm space-y-4">
              <div className="text-center space-y-1">
                <span className="text-3xl">{badgeInfo.badge}</span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  ¡Felicidades! Has completado todos los retos
                </h3>
                <p className="text-xs text-slate-600">
                  Has demostrado tu compromiso con el respeto, los derechos y deberes en salud.
                </p>
              </div>

              {/* Name Input for Certificate */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                <label className="block text-xs font-semibold text-slate-700">
                  Ingresa tu nombre para personalizar tu insignia:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Ej. Juan Pérez"
                    className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:border-teal-500"
                  />
                  <button
                    onClick={() => setShowCertificate(true)}
                    className="px-3.5 py-2 rounded-lg bg-teal-700 text-white text-xs font-semibold hover:bg-teal-800 transition-colors"
                  >
                    Generar
                  </button>
                </div>
              </div>

              {/* Printable / Viewable Certificate Badge */}
              <div className="border-2 border-dashed border-teal-200 bg-gradient-to-b from-teal-50/50 to-white rounded-2xl p-5 text-center space-y-3 relative overflow-hidden">
                <div className="absolute top-2 right-2 text-teal-200 font-bold text-4xl select-none opacity-40">
                  HUEM
                </div>

                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-bold tracking-widest text-teal-800">
                    E.S.E. Hospital Universitario Erasmo Meoz
                  </p>
                  <p className="text-[10px] text-slate-500">
                    Programa de Enfermería UFPS • DAR y RECIBIR
                  </p>
                </div>

                <div className="py-2">
                  <p className="text-xs text-slate-500">Certifica que:</p>
                  <h4 className="text-base sm:text-lg font-extrabold text-slate-900 mt-0.5">
                    {userName.trim() ? userName : 'Usuario Ejemplar en Salud'}
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 max-w-xs mx-auto">
                    Conoce activamente sus 7 derechos, practica sus 3 deberes y promueve el trato digno y humanizado.
                  </p>
                </div>

                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-100/80 text-teal-900 text-xs font-bold">
                  <Award className="w-4 h-4 text-teal-700" />
                  <span>{badgeInfo.title}</span>
                </div>

                <p className="text-[10px] text-slate-400">
                  Fecha de expedición: {new Date().toLocaleDateString('es-CO')}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-1">
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: 'Certificado DAR y RECIBIR',
                        text: `¡Completé la guía de Derechos y Deberes en el Hospital Erasmo Meoz como ${badgeInfo.title}!`,
                      }).catch(() => {});
                    } else {
                      alert('¡Copia el enlace para compartir tu logro con amigos y familiares!');
                    }
                  }}
                  className="w-full sm:flex-1 py-2.5 rounded-xl bg-slate-900 text-white font-medium text-xs flex items-center justify-center gap-1.5 hover:bg-slate-800"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Compartir Logro</span>
                </button>

                <button
                  onClick={resetReto3}
                  className="py-2.5 px-3 rounded-xl bg-white border border-slate-200 text-slate-700 font-medium text-xs flex items-center justify-center gap-1.5 hover:bg-slate-50"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reiniciar Reto 3</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
