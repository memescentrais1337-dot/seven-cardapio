import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { Product } from '../types/menu';
import { formatBRL, resolveAssetUrl } from '../utils/formatters';

interface ProductCardProps {
  product: Product;
  categoriaTitulo: string;
  isHappyHourCategory?: boolean;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
  onSelectProduct: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  categoriaTitulo,
  isHappyHourCategory = false,
  isFavorite,
  onToggleFavorite,
  onSelectProduct,
}) => {
  const [imgError, setImgError] = useState(false);

  // Check if item can be favorited (gastronomic & drinks only, exclude Jogos and Sessão)
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

  // Strikethrough price condition: ONLY when promotional price exists and is strictly less than base price
  const hasValidDiscount =
    product.precoPromocional !== null &&
    product.preco !== null &&
    product.precoPromocional < product.preco;

  const displayPrice =
    product.precoPromocional !== null && product.precoPromocional < (product.preco ?? Infinity)
      ? product.precoPromocional
      : product.preco;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelectProduct(product)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelectProduct(product);
        }
      }}
      className="group relative flex items-center justify-between gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-[#141518] hover:bg-[#181a1f] border border-[#262930] hover:border-[#FF5A16]/50 transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5A16]"
      aria-label={`Ver detalhes de ${product.nome}`}
    >
      {/* Left side: Information, Description, Price & Actions */}
      <div className="min-w-0 flex-1 flex flex-col justify-between self-stretch">
        <div>
          <div className="flex items-center gap-2">
            <h4
              style={{ color: '#FFFFFF' }}
              className="font-display font-bold text-sm sm:text-base text-white line-clamp-2 leading-snug"
            >
              {product.nome}
            </h4>
            {(isHappyHourCategory || hasValidDiscount) && (
              <span className="shrink-0 px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wider bg-[#FF5A16]/20 text-[#FF5A16] border border-[#FF5A16]/30 uppercase">
                HH
              </span>
            )}
          </div>

          {product.descricao ? (
            <p className="text-xs text-[#B9BCC3] line-clamp-2 mt-1 font-light leading-relaxed">
              {product.descricao}
            </p>
          ) : null}
        </div>

        {/* Price & Favorite Button */}
        <div className="mt-2.5 flex items-center justify-between gap-2">
          <div className="flex items-baseline gap-2 font-mono tabular-nums whitespace-nowrap">
            {hasValidDiscount && (
              <span className="text-xs text-[#B9BCC3]/60 line-through">
                {formatBRL(product.preco)}
              </span>
            )}
            <span
              className={`text-sm sm:text-base font-bold ${
                hasValidDiscount ? 'text-[#FF5A16]' : 'text-[#F5F3EE]'
              }`}
            >
              {formatBRL(displayPrice)}
            </span>
          </div>

          {canFavorite && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(product.id);
              }}
              className="p-1.5 rounded-lg text-[#B9BCC3] hover:text-[#FF5A16] hover:bg-[#1B1D22] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5A16] min-w-[36px] min-h-[36px] flex items-center justify-center"
              aria-label={
                isFavorite
                  ? `Remover ${product.nome} dos favoritos`
                  : `Adicionar ${product.nome} aos favoritos`
              }
            >
              <Heart
                className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                  isFavorite ? 'fill-[#FF5A16] text-[#FF5A16]' : ''
                }`}
              />
            </button>
          )}
        </div>
      </div>

      {/* Right side: Square photo (80x80px mobile, 96x96px desktop), fixed size, object-cover */}
      {product.fotoUrl && !imgError && (
        <div className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-xl overflow-hidden bg-[#0e1013] border border-[#262930]/80">
          <img
            src={resolveAssetUrl(product.fotoUrl)}
            alt={product.nome}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            onError={() => setImgError(true)}
            referrerPolicy="no-referrer"
          />
        </div>
      )}
    </div>
  );
};
