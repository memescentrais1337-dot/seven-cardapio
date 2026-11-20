import React from 'react';
import { Search, Grid, Heart } from 'lucide-react';
import { Logo } from './Logo';
import headerLogo from '../assets/images/regenerated_image_1794500465792.png';

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenCategories: () => void;
  onSelectFavorites: () => void;
  onSelectCategory?: (categoryId: number) => void;
  activeView: 'menu' | 'favorites';
  favoritesCount: number;
  isHappyHourActive?: boolean;
  categoriesCount?: number;
  logoUrl?: string;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  onOpenCategories,
  onSelectFavorites,
  onSelectCategory,
  activeView,
  favoritesCount,
  isHappyHourActive = false,
  categoriesCount = 14,
  logoUrl = headerLogo,
}) => {
  const handleCategoryJump = (catId: number) => {
    if (onSelectCategory) {
      onSelectCategory(catId);
      return;
    }
    const el = document.getElementById(`categoria-${catId}`);
    if (el) {
      const yOffset = -130;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#08090B]/95 backdrop-blur-md border-b border-[#262930] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4 md:gap-8">
        {/* Zone 1: Brand */}
        <a
          href="#topo"
          className="flex items-center shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5A16] rounded-sm py-1"
          aria-label="Seven Lounge & Drinks — Início"
        >
          <Logo size="header" logoUrl={logoUrl} />
        </a>

        {/* Zone 2: Nav Links (Desktop quick jumps) */}
        <nav
          className="hidden md:flex items-center gap-6 text-sm font-medium text-[#B9BCC3]"
          aria-label="Navegação rápida"
        >
          <button
            onClick={() => handleCategoryJump(45216)}
            className="hover:text-[#F5F3EE] hover:underline underline-offset-8 transition-colors whitespace-nowrap shrink-0 py-2"
          >
            Drinks
          </button>
          {isHappyHourActive && (
            <button
              onClick={() => handleCategoryJump(44862)}
              className="text-[#FF9A52] hover:text-[#FF5A16] hover:underline underline-offset-8 transition-colors whitespace-nowrap shrink-0 py-2 font-semibold"
            >
              Happy Hour
            </button>
          )}
          <button
            onClick={() => handleCategoryJump(44858)}
            className="hover:text-[#F5F3EE] hover:underline underline-offset-8 transition-colors whitespace-nowrap shrink-0 py-2"
          >
            Cervejas
          </button>
          <button
            onClick={() => handleCategoryJump(45041)}
            className="hover:text-[#F5F3EE] hover:underline underline-offset-8 transition-colors whitespace-nowrap shrink-0 py-2"
          >
            Petiscos
          </button>
        </nav>

        {/* Zone 3: Actions (Search, Categorias, Favoritos) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Quick Search Button */}
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#141518] hover:bg-[#1B1D22] text-[#B9BCC3] hover:text-[#F5F3EE] border border-[#262930] transition-colors text-xs sm:text-sm font-medium min-h-[44px] min-w-[44px] justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5A16]"
            aria-label="Buscar drinks e porções"
            title="Buscar (Ctrl+K)"
          >
            <Search className="w-4 h-4 text-[#FF5A16]" />
            <span className="hidden sm:inline">Buscar</span>
          </button>

          {/* All Categories Button */}
          <button
            onClick={onOpenCategories}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#141518] hover:bg-[#1B1D22] text-[#B9BCC3] hover:text-[#F5F3EE] border border-[#262930] transition-colors text-xs sm:text-sm font-medium min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5A16]"
            aria-label={`Ver todas as ${categoriesCount} categorias`}
          >
            <Grid className="w-4 h-4 text-[#FF5A16]" />
            <span className="hidden sm:inline">Categorias</span>
          </button>

          {/* Favoritos Button */}
          <button
            onClick={onSelectFavorites}
            className={`relative flex items-center justify-center p-2.5 rounded-lg border transition-colors min-h-[44px] min-w-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5A16] ${
              activeView === 'favorites'
                ? 'bg-[#FF5A16] border-[#FF5A16] text-white'
                : 'bg-[#141518] border-[#262930] text-[#B9BCC3] hover:text-[#F5F3EE]'
            }`}
            aria-label={`Favoritos (${favoritesCount} itens)`}
            title="Ver favoritos salvos"
          >
            <Heart
              className={`w-4 h-4 ${
                activeView === 'favorites'
                  ? 'fill-white text-white'
                  : favoritesCount > 0
                  ? 'fill-[#FF5A16] text-[#FF5A16]'
                  : ''
              }`}
            />
            {favoritesCount > 0 && activeView !== 'favorites' && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#FF5A16] text-white text-[10px] font-extrabold flex items-center justify-center tabular-nums shadow-sm">
                {favoritesCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
