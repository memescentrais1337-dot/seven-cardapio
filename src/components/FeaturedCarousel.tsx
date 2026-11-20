import React, { useRef, useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, Heart } from 'lucide-react';
import { Product } from '../types/menu';
import { formatBRL, resolveAssetUrl } from '../utils/formatters';

interface FeaturedCarouselProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  isFavorite: (id: number) => boolean;
  onToggleFavorite: (id: number) => void;
}

export const FeaturedCarousel: React.FC<FeaturedCarouselProps> = ({
  products,
  onSelectProduct,
  isFavorite,
  onToggleFavorite,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Drag vs click detection refs
  const isPointerDown = useRef(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const hasDragged = useRef(false);

  // Video management: track visible index
  const [activeVideoIndex, setActiveVideoIndex] = useState<number>(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Update scroll navigation arrow states
  const updateScrollButtons = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollButtons();
    el.addEventListener('scroll', updateScrollButtons, { passive: true });
    window.addEventListener('resize', updateScrollButtons);
    return () => {
      el.removeEventListener('scroll', updateScrollButtons);
      window.removeEventListener('resize', updateScrollButtons);
    };
  }, [updateScrollButtons, products]);

  // Handle desktop arrow scroll
  const scroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.querySelector('[data-card]')?.clientWidth || 320;
    const scrollAmount = direction === 'left' ? -cardWidth * 1.2 : cardWidth * 1.2;
    el.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  // Video play/pause management respecting visibility and prefers-reduced-motion
  useEffect(() => {
    const prefersReducedMotion =
      typeof window.matchMedia === 'function'
        ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
        : false;

    videoRefs.current.forEach((video, idx) => {
      if (!video) return;
      if (idx === activeVideoIndex && !prefersReducedMotion) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });

    const handleVisibilityChange = () => {
      if (document.visibilityState !== 'visible') {
        videoRefs.current.forEach((video) => video?.pause());
      } else if (!prefersReducedMotion) {
        const currentVideo = videoRefs.current[activeVideoIndex];
        currentVideo?.play().catch(() => {});
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [activeVideoIndex]);

  // Observe which card is predominantly visible to activate video
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const cards = el.querySelectorAll('[data-card]');
    if (!cards.length) return;

    if (typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
            const index = Number(entry.target.getAttribute('data-index'));
            if (!isNaN(index)) {
              setActiveVideoIndex(index);
            }
          }
        });
      },
      {
        root: el,
        threshold: [0.6],
      }
    );

    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, [products]);

  // Pointer drag vs click handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    isPointerDown.current = true;
    startX.current = e.clientX;
    startY.current = e.clientY;
    hasDragged.current = false;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isPointerDown.current) return;
    const deltaX = Math.abs(e.clientX - startX.current);
    const deltaY = Math.abs(e.clientY - startY.current);
    if (deltaX > 6 || deltaY > 6) {
      hasDragged.current = true;
    }
  };

  const handlePointerUp = () => {
    isPointerDown.current = false;
  };

  const handleCardClick = (product: Product) => {
    if (hasDragged.current) {
      // User was swiping/dragging, ignore click
      return;
    }
    onSelectProduct(product);
  };

  if (!products.length) return null;

  return (
    <div className="relative group/carousel">
      {/* Desktop Navigation Arrows */}
      {canScrollLeft && (
        <button
          onClick={() => scroll('left')}
          className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-[#141518]/95 backdrop-blur-md border border-[#262930] hover:border-[#FF5A16] text-[#F5F3EE] items-center justify-center shadow-2xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5A16]"
          aria-label="Rolar destaques para a esquerda"
        >
          <ChevronLeft className="w-5 h-5 text-[#F5F3EE]" />
        </button>
      )}

      {canScrollRight && (
        <button
          onClick={() => scroll('right')}
          className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-[#141518]/95 backdrop-blur-md border border-[#262930] hover:border-[#FF5A16] text-[#F5F3EE] items-center justify-center shadow-2xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5A16]"
          aria-label="Rolar destaques para a direita"
        >
          <ChevronRight className="w-5 h-5 text-[#F5F3EE]" />
        </button>
      )}

      {/* Swipeable Track */}
      <div
        ref={scrollRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="flex items-stretch gap-4 sm:gap-6 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-3 px-1 scroll-smooth"
        role="region"
        aria-label="Carrossel de Destaques"
      >
        {products.map((product, index) => {
          const hasValidDiscount =
            product.precoPromocional !== null &&
            product.preco !== null &&
            product.precoPromocional < product.preco;

          const displayPrice =
            product.precoPromocional !== null &&
            product.precoPromocional < (product.preco ?? Infinity)
              ? product.precoPromocional
              : product.preco;

          const isItemFavorite = isFavorite(product.id);

          return (
            <div
              key={`destaque-${product.id}`}
              data-card
              data-index={index}
              onClick={() => handleCardClick(product)}
              className="group relative shrink-0 w-[78%] sm:w-[300px] md:w-[320px] snap-start flex flex-col rounded-2xl bg-[#141518] border border-[#262930] hover:border-[#FF5A16]/50 overflow-hidden shadow-lg transition-all duration-300 cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5A16]"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectProduct(product);
                }
              }}
              aria-label={`Destaque: ${product.nome}`}
            >
              {/* Media Container: 3:2 aspect ratio */}
              <div className="relative aspect-[3/2] w-full bg-[#0e1013] overflow-hidden">
                {product.videoUrl ? (
                  <video
                    ref={(el) => {
                      videoRefs.current[index] = el;
                    }}
                    src={resolveAssetUrl(product.videoUrl)}
                    poster={resolveAssetUrl(product.posterUrl || product.fotoUrl)}
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover"
                  />
                ) : product.fotoUrl ? (
                  <img
                    src={resolveAssetUrl(product.fotoUrl)}
                    alt={product.nome}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1B1D22] to-[#08090B] text-[#B9BCC3]">
                    <Sparkles className="w-6 h-6 text-[#FF5A16]" />
                  </div>
                )}

                {/* Subtle Gradient Scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#141518] via-transparent to-transparent pointer-events-none" />

                {/* Destaque and Promo Badges */}
                <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1.5 flex-wrap">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wider bg-[#FF5A16] text-white uppercase shadow-lg shadow-black/50">
                    <Sparkles className="w-3 h-3 text-white" />
                    Destaque
                  </span>
                  {hasValidDiscount && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold tracking-wider bg-white text-[#FF5A16] uppercase shadow-lg shadow-black/50">
                      Promoção
                    </span>
                  )}
                </div>

                {/* Favorite Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(product.id);
                  }}
                  className="absolute top-2.5 right-2.5 z-10 p-2 rounded-full bg-[#08090B]/85 backdrop-blur-md text-[#E4E6EB] hover:text-[#FF5A16] hover:bg-[#08090B] border border-[#262930] transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5A16]"
                  aria-label={
                    isItemFavorite
                      ? `Remover ${product.nome} dos favoritos`
                      : `Adicionar ${product.nome} aos favoritos`
                  }
                >
                  <Heart
                    className={`w-3.5 h-3.5 ${
                      isItemFavorite ? 'fill-[#FF5A16] text-[#FF5A16]' : ''
                    }`}
                  />
                </button>
              </div>

              {/* Card Body */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h4
                    style={{ color: '#FFFFFF' }}
                    className="featured-product-title font-display font-extrabold text-base sm:text-lg text-white line-clamp-2 leading-snug tracking-wide"
                  >
                    {product.nome}
                  </h4>
                  {product.descricao ? (
                    <p className="text-xs text-[#E4E6EB] line-clamp-2 mt-1.5 font-normal leading-relaxed">
                      {product.descricao}
                    </p>
                  ) : null}
                </div>

                {/* Price and Action */}
                <div className="mt-3 pt-2.5 border-t border-[#262930]/70 flex items-center justify-between gap-2">
                  <div className="font-mono tabular-nums whitespace-nowrap">
                    {hasValidDiscount && (
                      <span className="block text-[11px] text-[#B9BCC3] line-through">
                        {formatBRL(product.preco)}
                      </span>
                    )}
                    <span
                      className={`text-base font-bold ${
                        hasValidDiscount ? 'text-[#FF5A16]' : 'text-white'
                      }`}
                    >
                      {formatBRL(displayPrice)}
                    </span>
                  </div>

                  <span className="text-xs text-[#FF9A52] group-hover:text-white font-semibold flex items-center gap-1 transition-colors">
                    Ver detalhes
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
