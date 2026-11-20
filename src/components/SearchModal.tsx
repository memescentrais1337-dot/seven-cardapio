import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search, X, Flame, ChevronRight } from 'lucide-react';
import { Categoria, Product } from '../types/menu';
import { normalizeSearchText, formatBRL, resolveAssetUrl } from '../utils/formatters';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  categorias: Categoria[];
  onSelectProduct: (product: Product, categoriaTitulo: string) => void;
}

interface FlattenedItem {
  product: Product;
  categoriaTitulo: string;
  subgrupoTitulo: string | null;
  isHappyHour: boolean;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  categorias,
  onSelectProduct,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Flatten all 136 items preserving their original catalogue order
  const allItems = useMemo<FlattenedItem[]>(() => {
    const list: FlattenedItem[] = [];
    for (const cat of categorias) {
      for (const bloco of cat.blocos) {
        for (const prod of bloco.produtos) {
          list.push({
            product: prod,
            categoriaTitulo: cat.titulo,
            subgrupoTitulo: bloco.titulo,
            isHappyHour: cat.id === 44862,
          });
        }
      }
    }
    return list;
  }, [categorias]);

  // Filter items ignoring accents and case
  const filteredItems = useMemo(() => {
    const trimmed = query.trim();
    if (!trimmed) return [];
    const normalizedQuery = normalizeSearchText(trimmed);

    return allItems.filter((item) => {
      const nameMatch = normalizeSearchText(item.product.nome).includes(
        normalizedQuery
      );
      const descMatch = normalizeSearchText(item.product.descricao).includes(
        normalizedQuery
      );
      const catMatch = normalizeSearchText(item.categoriaTitulo).includes(
        normalizedQuery
      );
      return nameMatch || descMatch || catMatch;
    });
  }, [allItems, query]);

  // Autofocus input on open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    } else {
      document.body.style.overflow = '';
      setQuery('');
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 pt-12 sm:pt-20 bg-black/85 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-label="Buscar produtos no cardápio"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-[#141518] border border-[#262930] rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 p-4 border-b border-[#262930] bg-[#141518]">
          <Search className="w-5 h-5 text-[#FF5A16] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar drink, cerveja, porção, dose..."
            className="w-full bg-transparent text-[#F5F3EE] placeholder-[#B9BCC3]/60 text-base focus:outline-none"
            aria-label="Campo de busca"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-md text-[#B9BCC3] hover:text-[#F5F3EE]"
              aria-label="Limpar busca"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2.5 py-1 text-xs text-[#B9BCC3] hover:text-[#F5F3EE] border border-[#262930] rounded-lg hover:bg-[#1B1D22] transition-colors"
          >
            Esc
          </button>
        </div>

        {/* Results / Empty state */}
        <div className="overflow-y-auto p-3 sm:p-4 divide-y divide-[#262930]/60 space-y-1">
          {query.trim() === '' ? (
            <div className="py-12 text-center text-sm text-[#B9BCC3]">
              <Search className="w-8 h-8 mx-auto text-[#262930] mb-2" />
              Digite o nome de uma bebida, prato ou ingrediente
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="py-12 text-center text-sm text-[#B9BCC3]">
              Nenhum item encontrado para &ldquo;{query}&rdquo;
            </div>
          ) : (
            filteredItems.map((item) => {
              const hasValidDiscount =
                item.product.precoPromocional !== null &&
                item.product.preco !== null &&
                item.product.precoPromocional < item.product.preco;

              const displayPrice =
                item.product.precoPromocional !== null &&
                item.product.precoPromocional < (item.product.preco ?? Infinity)
                  ? item.product.precoPromocional
                  : item.product.preco;

              return (
                <button
                  key={`${item.product.id}-${item.product.categoriaId}`}
                  onClick={() => {
                    onSelectProduct(item.product, item.categoriaTitulo);
                    onClose();
                  }}
                  className="w-full text-left p-3 rounded-xl hover:bg-[#1B1D22] transition-all flex items-center justify-between gap-4 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5A16]"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Thumbnail if exists */}
                    {item.product.fotoUrl ? (
                      <div className="w-12 h-12 rounded-lg bg-[#0e1013] overflow-hidden shrink-0">
                        <img
                          src={resolveAssetUrl(item.product.fotoUrl)}
                          alt={item.product.nome}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-[#1B1D22] border border-[#262930] flex items-center justify-center shrink-0">
                        <span className="text-[10px] font-mono text-[#B9BCC3]">
                          {item.categoriaTitulo.slice(0, 3).toUpperCase()}
                        </span>
                      </div>
                    )}

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-[#F5F3EE] group-hover:text-white truncate">
                          {item.product.nome}
                        </span>
                        {item.isHappyHour && (
                          <span className="flex items-center gap-0.5 text-[10px] font-bold text-[#FF5A16] uppercase">
                            <Flame className="w-3 h-3" />
                            HH
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-[#B9BCC3] flex items-center gap-1.5 mt-0.5 truncate">
                        <span>{item.categoriaTitulo.trim()}</span>
                        {item.subgrupoTitulo && (
                          <>
                            <span aria-hidden="true" className="text-[#262930]">
                              ·
                            </span>
                            <span>{item.subgrupoTitulo}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right font-mono tabular-nums">
                      {hasValidDiscount && (
                        <span className="block text-[11px] text-[#B9BCC3]/60 line-through">
                          {formatBRL(item.product.preco)}
                        </span>
                      )}
                      <span
                        className={`text-sm font-bold ${
                          hasValidDiscount ? 'text-[#FF5A16]' : 'text-[#F5F3EE]'
                        }`}
                      >
                        {formatBRL(displayPrice)}
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#B9BCC3]/50 group-hover:text-[#FF5A16] group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
