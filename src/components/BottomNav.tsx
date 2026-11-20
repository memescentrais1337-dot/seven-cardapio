import React from 'react';
import { Utensils, Heart } from 'lucide-react';

interface BottomNavProps {
  activeView: 'menu' | 'favorites';
  onSelectView: (view: 'menu' | 'favorites') => void;
  favoritesCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeView,
  onSelectView,
  favoritesCount,
}) => {
  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[#08090B]/95 backdrop-blur-md border-t border-[#262930] pb-safe"
      aria-label="Navegação inferior mobile"
    >
      <div className="flex items-center justify-around h-14 px-4 max-w-md mx-auto">
        {/* Cardápio tab */}
        <button
          onClick={() => onSelectView('menu')}
          className={`flex-1 flex flex-col items-center justify-center gap-1 py-1 transition-colors min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5A16] ${
            activeView === 'menu'
              ? 'text-[#FF5A16]'
              : 'text-[#B9BCC3] hover:text-[#F5F3EE]'
          }`}
          aria-current={activeView === 'menu' ? 'page' : undefined}
        >
          <Utensils className="w-4 h-4" />
          <span className="text-[11px] font-semibold tracking-wide">
            Cardápio
          </span>
        </button>

        {/* Divider */}
        <div className="w-[1px] h-6 bg-[#262930]" aria-hidden="true" />

        {/* Favoritos tab */}
        <button
          onClick={() => onSelectView('favorites')}
          className={`flex-1 flex flex-col items-center justify-center gap-1 py-1 transition-colors min-h-[44px] relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5A16] ${
            activeView === 'favorites'
              ? 'text-[#FF5A16]'
              : 'text-[#B9BCC3] hover:text-[#F5F3EE]'
          }`}
          aria-current={activeView === 'favorites' ? 'page' : undefined}
        >
          <div className="relative">
            <Heart
              className={`w-4 h-4 ${
                activeView === 'favorites'
                  ? 'fill-[#FF5A16]'
                  : favoritesCount > 0
                  ? 'fill-[#FF5A16] text-[#FF5A16]'
                  : ''
              }`}
            />
            {favoritesCount > 0 && (
              <span className="absolute -top-1.5 -right-3 px-1 min-w-[16px] h-4 rounded-full bg-[#FF5A16] text-white text-[9px] font-black flex items-center justify-center tabular-nums shadow-sm">
                {favoritesCount}
              </span>
            )}
          </div>
          <span className="text-[11px] font-semibold tracking-wide">
            Favoritos
          </span>
        </button>
      </div>
    </nav>
  );
};
