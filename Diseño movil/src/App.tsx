/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TopHeader } from './components/TopHeader';
import { BottomNavBar, TabType } from './components/BottomNavBar';
import { HomeView } from './components/HomeView';
import { CartillaView } from './components/CartillaView';
import { RetosView } from './components/RetosView';
import { SiauView } from './components/SiauView';
import { DariGuideView } from './components/DariGuideView';
import { RedesignAuditModal } from './components/RedesignAuditModal';
import { useSpeechNarrator } from './utils/useSpeechNarrator';
import {
  Smartphone,
  Monitor,
  Wifi,
  Battery,
  Signal,
  Sparkles,
  HelpCircle,
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('inicio');
  const [isLargeFont, setIsLargeFont] = useState(false);
  const [isMockupMode, setIsMockupMode] = useState(true);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);

  // Accessible Speech Synthesis
  const {
    isSpeaking,
    currentText,
    isVoiceMuted,
    speak,
    stop,
    toggleMute,
  } = useSpeechNarrator();

  // Active view router
  const renderActiveView = () => {
    switch (activeTab) {
      case 'inicio':
        return (
          <HomeView
            onNavigate={(tab) => {
              stop();
              setActiveTab(tab);
            }}
            onSpeak={speak}
            isSpeaking={isSpeaking}
            isLargeFont={isLargeFont}
          />
        );
      case 'cartilla':
        return (
          <CartillaView
            onSpeak={speak}
            isSpeaking={isSpeaking}
            currentSpeakingText={currentText}
            isLargeFont={isLargeFont}
          />
        );
      case 'retos':
        return (
          <RetosView
            onSpeak={speak}
            isSpeaking={isSpeaking}
            isLargeFont={isLargeFont}
          />
        );
      case 'siau':
        return <SiauView isLargeFont={isLargeFont} />;
      case 'dari':
        return (
          <DariGuideView
            onSpeak={speak}
            isSpeaking={isSpeaking}
            isLargeFont={isLargeFont}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-800 flex flex-col items-center justify-start p-0 sm:py-6 sm:px-4 font-sans selection:bg-teal-100 selection:text-teal-900">
      {/* Desktop Helper Toolbar */}
      <div className="w-full max-w-4xl mb-3 px-3 hidden sm:flex items-center justify-between text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-teal-400" />
          <span className="font-semibold text-white">
            DAR Y RECIBIR • E.S.E. Hospital Universitario Erasmo Meoz
          </span>
          <span className="text-slate-400">|</span>
          <span className="text-slate-400">Mockup Móvil Interactivo</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAuditModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/30 font-medium transition-colors cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Ver Análisis del Rediseño (Antes vs Ahora)</span>
          </button>

          <button
            onClick={() => setIsMockupMode(!isMockupMode)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium transition-colors cursor-pointer"
          >
            {isMockupMode ? (
              <>
                <Monitor className="w-3.5 h-3.5 text-slate-400" />
                <span>Vista Completa</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-teal-400" />
                <span>Enmarcar en Celular</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Container - either Phone Frame or Responsive Full Width */}
      <div
        className={`w-full transition-all duration-300 flex flex-col ${
          isMockupMode
            ? 'max-w-[400px] bg-slate-950 sm:rounded-[44px] sm:p-2.5 sm:shadow-2xl sm:border-[4px] sm:border-slate-800 sm:ring-1 sm:ring-slate-700/50'
            : 'max-w-4xl bg-slate-950 sm:rounded-3xl sm:p-2 sm:shadow-2xl sm:border border-slate-800'
        }`}
      >
        {/* Device Outer Frame */}
        <div className="w-full bg-slate-50 min-h-screen sm:h-[780px] sm:rounded-[36px] overflow-hidden flex flex-col relative shadow-inner">
          {/* Simulated Mobile Status Bar (Mockup mode only) */}
          {isMockupMode && (
            <div className="hidden sm:flex items-center justify-between px-6 pt-3 pb-1.5 bg-white text-slate-800 text-[11px] font-semibold select-none border-b border-slate-100/50 shrink-0">
              <span>9:41</span>
              {/* Dynamic Island / Speaker Pill */}
              <div className="w-24 h-4 bg-slate-900 rounded-full flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-slate-950" />
              </div>
              <div className="flex items-center gap-1.5 text-slate-600">
                <Signal className="w-3 h-3" />
                <Wifi className="w-3 h-3" />
                <Battery className="w-3.5 h-3.5" />
              </div>
            </div>
          )}

          {/* Institutional Top Header */}
          <TopHeader
            isLargeFont={isLargeFont}
            onToggleLargeFont={() => setIsLargeFont((prev) => !prev)}
            isVoiceMuted={isVoiceMuted}
            onToggleVoiceMute={toggleMute}
            onOpenAudit={() => setIsAuditModalOpen(true)}
          />

          {/* Main Scrollable Viewport */}
          <main
            id="main-content"
            className="flex-1 overflow-y-auto px-4 py-4 overscroll-contain"
          >
            {renderActiveView()}
          </main>

          {/* Fixed Thumb-Zone Bottom Navigation */}
          <BottomNavBar
            activeTab={activeTab}
            onSelectTab={(tab) => {
              stop();
              setActiveTab(tab);
            }}
            retosCount={3}
          />

          {/* Mobile Home Indicator bar */}
          {isMockupMode && (
            <div className="hidden sm:flex justify-center pb-2 pt-1 bg-white select-none shrink-0">
              <div className="w-32 h-1 bg-slate-300 rounded-full" />
            </div>
          )}
        </div>
      </div>

      {/* UX Audit & Diagnosis Modal */}
      <RedesignAuditModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
      />
    </div>
  );
}
