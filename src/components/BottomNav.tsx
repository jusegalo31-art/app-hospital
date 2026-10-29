import React from 'react';
import {
  Home,
  BookOpen,
  Trophy,
  PhoneCall,
  Sparkles,
} from 'lucide-react';

export type MainTabId = 'inicio' | 'cartilla' | 'retos' | 'siau' | 'dari';

interface BottomNavProps {
  activeTab: MainTabId;
  onSelectTab: (tab: MainTabId) => void;
  retosBadge?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  retosBadge = 3,
}) => {
  const navItems: {
    id: MainTabId;
    label: string;
    icon: React.FC<{ className?: string; size?: number }>;
    badge?: string;
  }[] = [
    { id: 'inicio', label: 'Inicio', icon: Home },
    { id: 'cartilla', label: 'Cartilla', icon: BookOpen },
    { id: 'retos', label: 'Retos', icon: Trophy, badge: `${retosBadge}` },
    { id: 'siau', label: 'SIAU', icon: PhoneCall },
    { id: 'dari', label: 'Dari', icon: Sparkles },
  ];

  return (
    <nav
      className="mobile-bottom-nav"
      aria-label="Navegación principal inferior"
    >
      <div className="mobile-bottom-nav-inner">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              id={`nav-tab-${item.id}`}
              onClick={() => onSelectTab(item.id)}
              className={`bottom-nav-btn ${isActive ? 'bottom-nav-btn-active' : ''}`}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className="bottom-nav-icon-wrap">
                <IconComponent
                  size={20}
                  className={`bottom-nav-icon ${isActive ? 'icon-active' : ''}`}
                />
                {item.badge && (
                  <span className="bottom-nav-badge" aria-hidden="true">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="bottom-nav-label">{item.label}</span>
              {isActive && <span className="bottom-nav-indicator" />}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
