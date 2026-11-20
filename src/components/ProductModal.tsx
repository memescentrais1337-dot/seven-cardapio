import React, { useEffect, useState } from 'react';
import { X, Heart, Share2, Check, Flame, AlertCircle } from 'lucide-react';
import { Product } from '../types/menu';
import { formatBRL, resolveAssetUrl } from '../utils/formatters';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
  categoriaTitulo?: string;
  subgrupoTitulo?: string | null;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  isFavorite,
  onToggleFavorite,
  categoriaTitulo = '',
  subgrupoTitulo = null,
}) => {
  const [copied, setCopied] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && product) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [product, onClose]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (product) {
      document.body.style.overflow = 'hidden';
      setImgError(false);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [product]);

  if (!product) return null;

  const isJogos =
    categoriaTitulo.toLowerCase().includes('jogos') ||
    product.nome.includes('PS4') ||
    product.nome.includes('PS5') ||
    product.categoriaId === 44864;

  const isSessao =
    categoriaTitulo.toLowerCase().includes('sess') ||
    product.nome.toLowerCase().includes('sessão') ||
    product.categoriaId === 44870;

  const canFavorite = !isJogos && !isSessao;

  const isHappyHourCategory = product.categoriaId === 44862;

  const hasValidDiscount =
    product.precoPromocional !== null &&
    product.preco !== null &&
    product.precoPromocional < product.preco;

  const isHappyHourPromo = isHappyHourCategory || hasValidDiscount;

  const displayPrice =
    product.precoPromocional !== null && product.precoPromocional < (product.preco ?? Infinity)
      ? product.precoPromocional
      : product.preco;

  const handleShare = async () => {
    const url = new URL(window.location.href);
    url.searchParams.set('produto', String(product.id));
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(url.toString());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // Fallback
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6 bg-black/85 backdrop-blur-md transition-opacity"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-product-title"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-xl max-h-[92vh] sm:max-h-[85vh] bg-[#141518] border border-[#262930] rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-slide-up sm:animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header Actions */}
        <div className="relative w-full">
          {/* Close & Share Bar */}
          <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2.5 rounded-full bg-[#08090B]/80 backdrop-blur-md text-[#B9BCC3] hover:text-[#F5F3EE] hover:bg-[#08090B] border border-[#262930] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5A16] min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Compartilhar link deste produto"
              title="Copiar link do produto"
            >
              {copied ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <Share2 className="w-4 h-4" />
              )}
            </button>

            <button
              onClick={onClose}
              className="p-2.5 rounded-full bg-[#08090B]/80 backdrop-blur-md text-[#B9BCC3] hover:text-[#F5F3EE] hover:bg-[#08090B] border border-[#262930] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5A16] min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Fechar detalhes do produto"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Photo */}
          {product.fotoUrl && !imgError ? (
            <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full bg-[#0e1013] overflow-hidden">
              <img
                src={resolveAssetUrl(product.fotoUrl)}
                alt={product.nome}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                onError={() => setImgError(true)}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#141518] via-transparent to-transparent pointer-events-none" />
            </div>
          ) : (
            <div className="pt-8 px-6 pb-2" />
          )}
        </div>

        {/* Modal Scrollable Content */}
        <div className="overflow-y-auto p-6 pt-2 space-y-5">
          {/* Category & Subgroup taxonomy */}
          <div className="flex items-center gap-2 text-xs text-[#B9BCC3]">
            <span className="font-mono uppercase tracking-wider text-[#FF9A52]">
              {categoriaTitulo}
            </span>
            {subgrupoTitulo && (
              <>
                <span aria-hidden="true" className="text-[#262930]">
                  /
                </span>
                <span className="text-[#B9BCC3]">{subgrupoTitulo}</span>
              </>
            )}
          </div>

          {/* Product Title */}
          <h2
            id="modal-product-title"
            style={{ color: '#FFFFFF' }}
            className="font-display text-2xl sm:text-3xl font-extrabold text-white leading-tight"
          >
            {product.nome}
          </h2>

          {/* Happy Hour Context Notice */}
          {isHappyHourPromo && (
            <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-[#1B1D22] border border-[#FF5A16]/30 text-xs text-[#F5F3EE]">
              <Flame className="w-4 h-4 text-[#FF5A16] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[#FF5A16] block mb-0.5">
                  Item com valor de Happy Hour
                </span>
                <span className="text-[#B9BCC3]">
                  Valores válidos no horário programado (Todos os dias das 17:00 às 20:00).
                </span>
              </div>
            </div>
          )}

          {/* Description (Preserving line breaks exactly as source) */}
          {product.descricao ? (
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-[#B9BCC3] uppercase tracking-wider block">
                Descrição
              </span>
              <p className="text-sm text-[#F5F3EE] leading-relaxed whitespace-pre-line font-light">
                {product.descricao}
              </p>
            </div>
          ) : null}

          {/* Price Box */}
          <div className="p-4 rounded-xl bg-[#1B1D22] border border-[#262930] flex items-center justify-between">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-[#B9BCC3] block mb-1">
                {isHappyHourPromo ? 'Valor Happy Hour' : 'Preço'}
              </span>
              <div className="font-mono tabular-nums flex items-baseline gap-2">
                {hasValidDiscount && (
                  <span className="text-sm text-[#B9BCC3]/60 line-through">
                    {formatBRL(product.preco)}
                  </span>
                )}
                <span className="text-2xl font-extrabold text-[#FF5A16]">
                  {formatBRL(displayPrice)}
                </span>
              </div>
            </div>

            {/* Favorite Action Button */}
            {canFavorite && (
              <button
                type="button"
                onClick={() => onToggleFavorite(product.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border font-semibold text-xs transition-colors min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5A16] ${
                  isFavorite
                    ? 'bg-[#FF5A16] border-[#FF5A16] text-white shadow-sm'
                    : 'bg-[#141518] border-[#262930] text-[#F5F3EE] hover:border-[#FF5A16]/50'
                }`}
              >
                <Heart
                  className={`w-4 h-4 ${
                    isFavorite ? 'fill-white text-white' : 'text-[#FF5A16]'
                  }`}
                />
                <span>{isFavorite ? 'Salvo' : 'Favoritar'}</span>
              </button>
            )}
          </div>

          {/* Consultation Note */}
          <div className="pt-2 text-center text-xs text-[#B9BCC3]/70">
            Cardápio digital para consulta presencial no Seven Lounge &amp; Drinks.
          </div>
        </div>
      </div>
    </div>
  );
};
