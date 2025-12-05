
import React from 'react';
import { Home, Scan, Activity, Map, ShoppingBag } from 'lucide-react';
import { AppView } from '../types';

interface NavigationProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentView, onNavigate }) => {
  const navItems = [
    { view: AppView.HOME, icon: Home, label: 'Home' },
    { view: AppView.SCAN, icon: Scan, label: 'Scan' },
    { view: AppView.DASHBOARD, icon: Activity, label: 'Stats' },
    { view: AppView.MARKET, icon: ShoppingBag, label: 'Market' },
    { view: AppView.MAP, icon: Map, label: 'Map' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 pb-safe pt-2 px-2 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50">
      <div className="flex justify-between items-center max-w-md mx-auto pb-4 px-2">
        {navItems.map((item) => {
          const isActive = currentView === item.view;
          const Icon = item.icon;
          
          return (
            <button
              key={item.view}
              onClick={() => onNavigate(item.view)}
              className={`flex flex-col items-center space-y-1 transition-all duration-200 w-16 ${
                isActive ? 'text-emerald-600 -translate-y-1' : 'text-stone-400'
              }`}
            >
              <div className={`p-2 rounded-full ${isActive ? 'bg-emerald-50' : 'bg-transparent'}`}>
                <Icon size={isActive ? 24 : 22} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
