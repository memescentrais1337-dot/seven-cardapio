import React, { useRef, useEffect } from 'react';
import { Categoria } from '../types/menu';
import { Grid, Flame, Sparkles } from 'lucide-react';

export const FEATURED_CATEGORY_ID = -1;

interface CategoryNavProps {
  categorias: Categoria[];
  activeCategoryId: number;
  onSelectCategory: (categoryId: number) => void;
  onOpenCategoriesModal: () => void;
}

export const CategoryNav: React.FC<CategoryNavProps> = ({
  categorias,
  activeCategoryId,
  onSelectCategory,
  onOpenCategoriesModal,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll the active category button into horizontal view
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const activeButton = container.querySelector(
      `[data-category-id="${activeCategoryId}"]`
    ) as HTMLElement | null;

    if (activeButton) {
      const containerRect = container.getBoundingClientRect();
      const buttonRect = activeButton.getBoundingClientRect();

      // Check if button is out of horizontal bounds
      if (
        buttonRect.left < containerRect.left + 20 ||
        buttonRect.right > containerRect.right - 20
      ) {
        activeButton.scrollIntoView({
          behavior: 'smooth',
          inline: 'center',
          block: 'nearest',
        });
      }
    }
  }, [activeCategoryId]);

  const isDestaquesActive = activeCategoryId === FEATURED_CATEGORY_ID;

  return (
    <div className="sticky top-16 sm:top-20 z-30 w-full bg-[#08090B]/95 backdrop-blur-md border-b border-[#262930] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2">
        {/* Quick button to open full categories index modal */}
        <button
          onClick={onOpenCategoriesModal}
          className="shrink-0 flex items-center gap-1.5 px-3 py-2.5 my-2 rounded-lg bg-[#141518] hover:bg-[#1B1D22] text-[#F5F3EE] border border-[#262930] hover:border-[#FF5A16]/50 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5A16] min-h-[40px]"
          aria-label="Abrir lista de todas as categorias"
          title="Ver índice de categorias"
        >
          <Grid className="w-3.5 h-3.5 text-[#FF5A16]" />
          <span className="whitespace-nowrap">Todas ({categorias.length + 1})</span>
        </button>

        {/* Vertical divider */}
        <div className="w-[1px] h-6 bg-[#262930] shrink-0" aria-hidden="true" />

        {/* Scrollable category pills */}
        <div
          ref={scrollContainerRef}
          className="flex items-center gap-2 overflow-x-auto py-2.5 no-scrollbar scroll-smooth"
          role="tablist"
          aria-label="Categorias do cardápio"
        >
          {/* First Option: Destaques */}
          <button
            data-category-id={FEATURED_CATEGORY_ID}
            role="tab"
            aria-selected={isDestaquesActive}
            onClick={() => onSelectCategory(FEATURED_CATEGORY_ID)}
            className={`group relative shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5A16] min-h-[40px] ${
              isDestaquesActive
                ? 'bg-[#141518] text-[#FF5A16] border border-[#FF5A16]/70 shadow-sm'
                : 'bg-transparent text-[#B9BCC3] hover:text-[#F5F3EE] hover:bg-[#141518]/60 border border-transparent'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#FF5A16]" />
            <span>Destaques</span>
            {isDestaquesActive && (
              <span
                className="absolute -bottom-2.5 left-3 right-3 h-[2px] bg-[#FF5A16] rounded-full"
                aria-hidden="true"
              />
            )}
          </button>

          {categorias.map((cat, index) => {
            const isActive = activeCategoryId === cat.id;
            const isHappyHour = cat.id === 44862;
            const indexStr = String(index + 1).padStart(2, '0');

            return (
              <button
                key={cat.id}
                data-category-id={cat.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => onSelectCategory(cat.id)}
                className={`group relative shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5A16] min-h-[40px] ${
                  isActive
                    ? 'bg-[#141518] text-[#F5F3EE] border border-[#FF5A16]/70 shadow-sm'
                    : 'bg-transparent text-[#B9BCC3] hover:text-[#F5F3EE] hover:bg-[#141518]/60 border border-transparent'
                }`}
              >
                {/* Number or flame for Happy Hour */}
                {isHappyHour ? (
                  <Flame
                    className={`w-3.5 h-3.5 ${
                      isActive ? 'text-[#FF5A16]' : 'text-[#FF9A52]'
                    }`}
                  />
                ) : (
                  <span
                    className={`text-[10px] font-mono tabular-nums ${
                      isActive ? 'text-[#FF5A16]' : 'text-[#B9BCC3]/60'
                    }`}
                  >
                    {indexStr}
                  </span>
                )}

                {/* Category title */}
                <span>{cat.titulo.trim()}</span>

                {/* Subtle orange underline for active category */}
                {isActive && (
                  <span
                    className="absolute -bottom-2.5 left-3 right-3 h-[2px] bg-[#FF5A16] rounded-full"
                    aria-hidden="true"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
