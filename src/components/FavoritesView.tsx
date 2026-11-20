import React from 'react';
import { Heart, ArrowLeft } from 'lucide-react';
import { Categoria, Product } from '../types/menu';
import { ProductCard } from './ProductCard';

interface FavoritesViewProps {
  favoriteIds: number[];
  categorias: Categoria[];
  onToggleFavorite: (id: number) => void;
  onSelectProduct: (product: Product, categoriaTitulo: string) => void;
  onBackToMenu: () => void;
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({
  favoriteIds,
  categorias,
  onToggleFavorite,
  onSelectProduct,
  onBackToMenu,
}) => {
  // Find all favorited products across all categories
  const favoritedProducts: { product: Product; categoriaTitulo: string; isHappyHour: boolean }[] = [];

  for (const cat of categorias) {
    for (const bloco of cat.blocos) {
      for (const prod of bloco.produtos) {
        if (favoriteIds.includes(prod.id)) {
          // Avoid duplicate push if already found (though IDs are unique per registration)
          favoritedProducts.push({
            product: prod,
            categoriaTitulo: cat.titulo,
            isHappyHour: cat.id === 44862,
          });
        }
      }
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-[#262930]">
        <div>
          <button
            onClick={onBackToMenu}
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#FF5A16] hover:text-[#FF9A52] mb-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5A16]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Voltar ao cardápio completo</span>
          </button>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#F5F3EE] flex items-center gap-3">
            <span>Seus Favoritos</span>
            <span className="text-sm font-mono font-normal text-[#B9BCC3] bg-[#141518] px-2.5 py-0.5 rounded-full border border-[#262930] tabular-nums">
              {favoritedProducts.length} {favoritedProducts.length === 1 ? 'item' : 'itens'}
            </span>
          </h1>
        </div>

        <p className="text-xs text-[#B9BCC3] max-w-sm">
          Itens salvos no seu dispositivo para consulta rápida durante a sua noite na Seven.
        </p>
      </div>

      {/* Empty State */}
      {favoritedProducts.length === 0 ? (
        <div className="py-20 text-center rounded-2xl bg-[#141518] border border-[#262930] max-w-md mx-auto p-8">
          <div className="w-12 h-12 rounded-full bg-[#1B1D22] border border-[#262930] flex items-center justify-center mx-auto mb-4 text-[#FF5A16]">
            <Heart className="w-6 h-6" />
          </div>
          <h3 className="font-display text-lg font-bold text-[#F5F3EE] mb-2">
            Nenhum favorito salvo ainda
          </h3>
          <p className="text-xs sm:text-sm text-[#B9BCC3] mb-6">
            Toque no ícone de coração nos seus drinks, porções e bebidas favoritas para salvá-los aqui.
          </p>
          <button
            onClick={onBackToMenu}
            className="px-5 py-2.5 rounded-lg bg-[#FF5A16] text-white font-bold text-xs hover:bg-[#FF9A52] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5A16] shadow-sm"
          >
            Explorar o Cardápio
          </button>
        </div>
      ) : (
        /* Favorites Grid (Compact Rows) */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
          {favoritedProducts.map(({ product, categoriaTitulo, isHappyHour }) => (
            <ProductCard
              key={`${product.id}-${product.categoriaId}`}
              product={product}
              categoriaTitulo={categoriaTitulo}
              isHappyHourCategory={isHappyHour}
              isFavorite={true}
              onToggleFavorite={onToggleFavorite}
              onSelectProduct={() => onSelectProduct(product, categoriaTitulo)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
