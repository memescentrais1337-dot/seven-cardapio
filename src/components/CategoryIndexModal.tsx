import React, { useEffect } from 'react';
import { X, ChevronRight, Flame, Sparkles } from 'lucide-react';
import { Categoria } from '../types/menu';
import { FEATURED_CATEGORY_ID } from './CategoryNav';

interface CategoryIndexModalProps {
  isOpen: boolean;
  onClose: () => void;
  categorias: Categoria[];
  activeCategoryId: number;
  onSelectCategory: (categoryId: number) => void;
  featuredCount?: number;
}

export const CategoryIndexModal: React.FC<CategoryIndexModalProps> = ({
  isOpen,
  onClose,
  categorias,
  activeCategoryId,
  onSelectCategory,
  featuredCount = 6,
}) => {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const countCategoryItems = (cat: Categoria): number => {
    return cat.blocos.reduce((acc, b) => acc + b.produtos.length, 0);
  };

  const isDestaquesActive = activeCategoryId === FEATURED_CATEGORY_ID;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-label="Índice completo de categorias"
    >
      <div
        className="w-full max-w-xl max-h-[85vh] bg-[#141518] border border-[#262930] rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#262930] bg-[#141518] sticky top-0 z-10">
          <div>
            <h2 className="font-display text-lg sm:text-xl font-bold text-[#F5F3EE] uppercase tracking-wide">
              Índice de Categorias
            </h2>
            <p className="text-xs text-[#B9BCC3] mt-0.5">
              {categorias.length + 1} seções organizadas do cardápio Seven
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-[#B9BCC3] hover:text-[#F5F3EE] hover:bg-[#1B1D22] border border-transparent hover:border-[#262930] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5A16]"
            aria-label="Fechar índice"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Categories List */}
        <div className="overflow-y-auto p-3 sm:p-4 divide-y divide-[#262930]/60 space-y-1">
          {/* Destaques item */}
          <button
            onClick={() => {
              onSelectCategory(FEATURED_CATEGORY_ID);
              onClose();
            }}
            className={`w-full text-left p-3.5 rounded-xl transition-all flex items-center justify-between gap-4 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5A16] ${
              isDestaquesActive
                ? 'bg-[#1B1D22] border border-[#FF5A16]/50'
                : 'hover:bg-[#1B1D22]/60 border border-transparent'
            }`}
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <span className="w-6 shrink-0 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-[#FF5A16]" />
              </span>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-display text-sm sm:text-base font-bold text-[#FF9A52] truncate">
                    Destaques
                  </span>
                  <span className="text-[10px] text-[#FF5A16] font-semibold uppercase tracking-wider">
                    Especial
                  </span>
                </div>
                <p className="text-xs text-[#B9BCC3] truncate max-w-sm mt-0.5">
                  Seleção exclusiva de drinks e porções em destaque
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs text-[#B9BCC3] font-mono tabular-nums">
                {featuredCount} itens
              </span>
              <ChevronRight
                className={`w-4 h-4 transition-transform group-hover:translate-x-0.5 ${
                  isDestaquesActive ? 'text-[#FF5A16]' : 'text-[#B9BCC3]/60'
                }`}
              />
            </div>
          </button>

          {categorias.map((cat, index) => {
            const itemCount = countCategoryItems(cat);
            const isActive = activeCategoryId === cat.id;
            const isHappyHour = cat.id === 44862;
            const indexStr = String(index + 1).padStart(2, '0');

            return (
              <button
                key={cat.id}
                onClick={() => {
                  onSelectCategory(cat.id);
                  onClose();
                }}
                className={`w-full text-left p-3.5 rounded-xl transition-all flex items-center justify-between gap-4 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5A16] ${
                  isActive
                    ? 'bg-[#1B1D22] border border-[#FF5A16]/50'
                    : 'hover:bg-[#1B1D22]/60 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <span
                    className={`font-mono text-xs font-bold w-6 shrink-0 tabular-nums ${
                      isActive
                        ? 'text-[#FF5A16]'
                        : isHappyHour
                        ? 'text-[#FF9A52]'
                        : 'text-[#B9BCC3]/60'
                    }`}
                  >
                    {isHappyHour ? (
                      <Flame className="w-4 h-4 text-[#FF5A16]" />
                    ) : (
                      indexStr
                    )}
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-display text-sm sm:text-base font-bold truncate ${
                          isActive
                            ? 'text-[#F5F3EE]'
                            : isHappyHour
                            ? 'text-[#FF9A52]'
                            : 'text-[#F5F3EE] group-hover:text-white'
                        }`}
                      >
                        {cat.titulo.trim()}
                      </span>
                      {isHappyHour && (
                        <span className="text-[10px] text-[#FF5A16] font-semibold uppercase tracking-wider">
                          Especial
                        </span>
                      )}
                    </div>
                    {cat.observacao && (
                      <p className="text-xs text-[#B9BCC3] truncate max-w-sm mt-0.5">
                        {cat.observacao}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-[#B9BCC3] font-mono tabular-nums">
                    {itemCount} {itemCount === 1 ? 'item' : 'itens'}
                  </span>
                  <ChevronRight
                    className={`w-4 h-4 transition-transform group-hover:translate-x-0.5 ${
                      isActive ? 'text-[#FF5A16]' : 'text-[#B9BCC3]/60'
                    }`}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
