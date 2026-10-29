/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Home, BookOpen, Trophy, PhoneCall, Sparkles } from 'lucide-react';

export type TabType = 'inicio' | 'cartilla' | 'retos' | 'siau' | 'dari';

interface BottomNavBarProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  retosCount?: number;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  onSelectTab,
  retosCount = 3,
}) => {
  const tabs = [
    { id: 'inicio', label: 'Inicio', icon: Home },
    { id: 'cartilla', label: 'Cartilla', icon: BookOpen },
    { id: 'retos', label: 'Retos', icon: Trophy, badge: `${retosCount}` },
    { id: 'siau', label: 'SIAU', icon: PhoneCall },
    { id: 'dari', label: 'Dari', icon: Sparkles },
  ] as const;

  return (
    <nav
      className="sticky bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 shadow-lg px-2 py-1 safe-bottom"
      aria-label="Navegación principal inferior"
    >
      <div className="grid grid-cols-5 items-center max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id as TabType)}
              className={`min-h-[48px] flex flex-col items-center justify-center relative py-1 px-1 transition-colors rounded-xl ${
                isActive
                  ? 'text-teal-700 font-semibold'
                  : 'text-slate-500 hover:text-slate-900 font-normal'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className="relative flex items-center justify-center">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'scale-110 stroke-[2.4]' : 'stroke-[1.8]'
                  }`}
                />
                {tab.id === 'retos' && (
                  <span className="absolute -top-1 -right-2.5 text-[9px] font-bold bg-teal-600 text-white rounded-full w-4 h-4 flex items-center justify-center leading-none">
                    {retosCount}
                  </span>
                )}
              </div>
              <span
                className={`text-[11px] leading-tight mt-1 truncate ${
                  isActive ? 'text-teal-800 font-semibold' : 'text-slate-500'
                }`}
              >
                {tab.label}
              </span>
              {isActive && (
                <span className="w-4 h-0.5 bg-teal-600 rounded-full mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
