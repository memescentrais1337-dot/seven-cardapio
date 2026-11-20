import React from 'react';
import { Flame, Sparkles } from 'lucide-react';
import { Categoria } from '../types/menu';
import { FEATURED_CATEGORY_ID } from './CategoryNav';

interface SidebarNavProps {
  categorias: Categoria[];
  activeCategoryId: number;
  onSelectCategory: (categoryId: number) => void;
  featuredCount?: number;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({
  categorias,
  activeCategoryId,
  onSelectCategory,
  featuredCount = 6,
}) => {
  const countItems = (cat: Categoria): number => {
    return cat.blocos.reduce((acc, b) => acc + b.produtos.length, 0);
  };

  const isDestaquesActive = activeCategoryId === FEATURED_CATEGORY_ID;

  return (
    <aside
      className="hidden lg:block w-64 shrink-0"
      aria-label="Navegação lateral de categorias"
    >
      <div className="sticky top-40 bg-[#141518] border border-[#262930] rounded-2xl p-4 shadow-xl">
        <div className="pb-3 mb-2 border-b border-[#262930] flex items-center justify-between">
          <span className="font-display text-xs font-bold uppercase tracking-wider text-[#F5F3EE]">
            Categorias
          </span>
          <span className="text-[11px] font-mono text-[#FF5A16] font-bold">
            {categorias.length + 1} seções
          </span>
        </div>

        <nav className="space-y-1 max-h-[calc(100vh-240px)] overflow-y-auto pr-1">
          {/* Destaques Item */}
          <button
            onClick={() => onSelectCategory(FEATURED_CATEGORY_ID)}
            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-between group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5A16] ${
              isDestaquesActive
                ? 'bg-[#1B1D22] text-[#FF5A16] font-semibold border-l-2 border-[#FF5A16]'
                : 'text-[#B9BCC3] hover:text-[#F5F3EE] hover:bg-[#1B1D22]/50'
            }`}
          >
            <div className="flex items-center gap-2.5 truncate">
              <Sparkles className="w-3.5 h-3.5 text-[#FF5A16] shrink-0" />
              <span className="truncate">Destaques</span>
            </div>
            <span
              className={`text-[10px] font-mono tabular-nums shrink-0 ml-2 ${
                isDestaquesActive ? 'text-[#FF5A16]' : 'text-[#B9BCC3]/50'
              }`}
            >
              {featuredCount}
            </span>
          </button>

          {categorias.map((cat, index) => {
            const isActive = activeCategoryId === cat.id;
            const isHappyHour = cat.id === 44862;
            const itemCount = countItems(cat);
            const indexStr = String(index + 1).padStart(2, '0');

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-between group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5A16] ${
                  isActive
                    ? 'bg-[#1B1D22] text-[#F5F3EE] font-semibold border-l-2 border-[#FF5A16]'
                    : 'text-[#B9BCC3] hover:text-[#F5F3EE] hover:bg-[#1B1D22]/50'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  {isHappyHour ? (
                    <Flame
                      className={`w-3.5 h-3.5 shrink-0 ${
                        isActive ? 'text-[#FF5A16]' : 'text-[#FF9A52]'
                      }`}
                    />
                  ) : (
                    <span
                      className={`font-mono text-[10px] tabular-nums shrink-0 ${
                        isActive ? 'text-[#FF5A16]' : 'text-[#B9BCC3]/60'
                      }`}
                    >
                      {indexStr}
                    </span>
                  )}
                  <span className="truncate">{cat.titulo.trim()}</span>
                </div>

                <span
                  className={`text-[10px] font-mono tabular-nums shrink-0 ml-2 ${
                    isActive ? 'text-[#FF5A16]' : 'text-[#B9BCC3]/50'
                  }`}
                >
                  {itemCount}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};
