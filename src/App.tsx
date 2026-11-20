import { useState, useEffect, useMemo, useCallback } from 'react';
import { menuData } from './data/menuData';
import { Product } from './types/menu';
import { useFavorites } from './hooks/useFavorites';
import { useHappyHour } from './hooks/useHappyHour';
import { Sparkles } from 'lucide-react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CategoryNav, FEATURED_CATEGORY_ID } from './components/CategoryNav';
import { SidebarNav } from './components/SidebarNav';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { SearchModal } from './components/SearchModal';
import { CategoryIndexModal } from './components/CategoryIndexModal';
import { FavoritesView } from './components/FavoritesView';
import { HappyHourNotice } from './components/HappyHourNotice';
import { FeaturedCarousel } from './components/FeaturedCarousel';
import { BottomNav } from './components/BottomNav';
import { Footer } from './components/Footer';
import headerLogo from './assets/images/regenerated_image_1794500465792.png';
import footerLogo from './assets/images/regenerated_image_1794500466325.png';

// Configurable IDs for Featured Products carousel
const FEATURED_PRODUCT_IDS: number[] = [467436, 403862, 505254, 505255, 505256, 444115];
const HAPPY_HOUR_CATEGORY_ID = 44862;
const CERVEJAS_CATEGORY_ID = 44858;
const HAPPY_HOUR_BEER_PROMOS: Record<number, number> = {
  400726: 9.99, // Amstel Lager (Garrafa de 600 ml)
  400728: 9.99, // Original (Garrafa de 600 ml)
  491302: 11.9, // Heineken (Garrafa de 600 ml)
};

// Priority category order:
// 1. Drinks -> 2. Happy Hour (when active) -> 3. Doses -> 4. Garrafas -> 5. Cervejas
// -> 6. Petiscos & comidas -> 7. Sessão & demais -> 8. Energéticos -> 9. Sucos -> 10. Refrigerantes -> 11. Águas
const CATEGORY_PRIORITY_BEFORE_BASICS: number[] = [
  45216, // Drinks
  44862, // Happy Hour
  49349, // Doses
  44897, // Doses de Whisky
  45115, // Garrafas
  44858, // Cervejas
  45041, // Petiscos
  51146, // sobremesas
  44870, // Sessão
  44864, // Jogos
];

const CATEGORY_PRIORITY_BASICS: number[] = [
  44877, // Energéticos
  44892, // Sucos
  44871, // Refrigerantes
  44863, // Águas (sempre por último)
];

function getCategorySortRank(categoryId: number): number {
  const preIdx = CATEGORY_PRIORITY_BEFORE_BASICS.indexOf(categoryId);
  if (preIdx !== -1) return preIdx;
  const basicIdx = CATEGORY_PRIORITY_BASICS.indexOf(categoryId);
  if (basicIdx !== -1) return CATEGORY_PRIORITY_BEFORE_BASICS.length + 100 + basicIdx;
  return CATEGORY_PRIORITY_BEFORE_BASICS.length;
}

export default function App() {
  const [activeCategoryId, setActiveCategoryId] = useState<number>(FEATURED_CATEGORY_ID);
  const [activeView, setActiveView] = useState<'menu' | 'favorites'>('menu');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedProductMeta, setSelectedProductMeta] = useState<{
    categoriaTitulo: string;
    subgrupoTitulo: string | null;
  }>({ categoriaTitulo: '', subgrupoTitulo: null });

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCategoriesModalOpen, setIsCategoriesModalOpen] = useState(false);

  // Custom hooks
  const { favoriteIds, toggleFavorite, isFavorite } = useFavorites();

  const happyHourCategory = useMemo(
    () => menuData.categorias.find((cat) => cat.id === HAPPY_HOUR_CATEGORY_ID) ?? null,
    []
  );

  const happyHourStatus = useHappyHour(
    menuData.loja.fusoHorario,
    happyHourCategory?.horarios
  );

  // Visible categories: ordered by priority (Drinks, Happy Hour when active, Doses, Garrafas, Cervejas,
  // Petiscos/comidas, Sessão/demais, Energéticos, Sucos, Refrigerantes, Águas)
  const visibleCategorias = useMemo(() => {
    const regularCategories = menuData.categorias
      .filter((cat) => cat.id !== HAPPY_HOUR_CATEGORY_ID)
      .map((cat) => {
        if (cat.id !== CERVEJAS_CATEGORY_ID || !happyHourStatus.isActive) {
          return cat;
        }
        return {
          ...cat,
          blocos: cat.blocos.map((bloco) => ({
            ...bloco,
            produtos: bloco.produtos.map((prod) => {
              const promoPrice = HAPPY_HOUR_BEER_PROMOS[prod.id];
              if (promoPrice === undefined) return prod;
              return {
                ...prod,
                precoPromocional: promoPrice,
              };
            }),
          })),
        };
      });

    const combined =
      happyHourStatus.isActive && happyHourCategory
        ? [happyHourCategory, ...regularCategories]
        : regularCategories;

    return [...combined].sort(
      (a, b) => getCategorySortRank(a.id) - getCategorySortRank(b.id) || a.ordem - b.ordem
    );
  }, [happyHourStatus.isActive, happyHourCategory]);

  // Flatten currently visible products for fast lookup by ID
  const allProductsMap = useMemo(() => {
    const map = new Map<
      number,
      { product: Product; categoriaTitulo: string; subgrupoTitulo: string | null }
    >();
    for (const cat of visibleCategorias) {
      for (const bloco of cat.blocos) {
        for (const prod of bloco.produtos) {
          map.set(prod.id, {
            product: prod,
            categoriaTitulo: cat.titulo,
            subgrupoTitulo: bloco.titulo,
          });
        }
      }
    }
    return map;
  }, [visibleCategorias]);

  const visibleItemsCount = allProductsMap.size;

  const visibleFavoritesCount = useMemo(() => {
    return favoriteIds.filter((id) => allProductsMap.has(id)).length;
  }, [favoriteIds, allProductsMap]);

  // Featured products list preserving exact catalog records
  const featuredProducts = useMemo(() => {
    return FEATURED_PRODUCT_IDS.map((id) => allProductsMap.get(id)?.product).filter(
      (p): p is Product => Boolean(p)
    );
  }, [allProductsMap]);

  // Keep open ProductModal price synchronized if Happy Hour starts/ends while modal is open
  const liveSelectedProduct = useMemo(() => {
    if (!selectedProduct) return null;
    return allProductsMap.get(selectedProduct.id)?.product ?? selectedProduct;
  }, [selectedProduct, allProductsMap]);

  // Open product detail and synchronize browser URL (?produto=ID)
  const openProductDetail = useCallback(
    (product: Product, categoriaTitulo?: string, subgrupoTitulo?: string | null) => {
      const meta = allProductsMap.get(product.id);
      setSelectedProduct(product);
      setSelectedProductMeta({
        categoriaTitulo: categoriaTitulo || meta?.categoriaTitulo || '',
        subgrupoTitulo: subgrupoTitulo ?? meta?.subgrupoTitulo ?? null,
      });

      // Synchronize URL with ?produto={id} without reload
      try {
        const url = new URL(window.location.href);
        url.searchParams.set('produto', String(product.id));
        window.history.pushState({ produtoId: product.id }, '', url.toString());
      } catch {
        // Ignore restricted WebView history errors
      }
    },
    [allProductsMap]
  );

  // Close product detail and restore URL
  const closeProductDetail = useCallback(() => {
    setSelectedProduct(null);
    try {
      const url = new URL(window.location.href);
      if (url.searchParams.has('produto')) {
        url.searchParams.delete('produto');
        window.history.pushState({}, '', url.pathname + (url.search ? url.search : ''));
      }
    } catch {
      // Ignore restricted WebView history errors
    }
  }, []);

  // Listen to browser navigation (back/forward) for ?produto={id}
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const prodIdStr = params.get('produto');
      if (prodIdStr) {
        const prodId = parseInt(prodIdStr, 10);
        const item = allProductsMap.get(prodId);
        if (item) {
          setSelectedProduct(item.product);
          setSelectedProductMeta({
            categoriaTitulo: item.categoriaTitulo,
            subgrupoTitulo: item.subgrupoTitulo,
          });
          return;
        }
      }
      setSelectedProduct(null);
    };

    // Check query params on initial load
    handlePopState();

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [allProductsMap]);

  // Immediately hide Happy Hour modal or active state if Happy Hour ends while viewing
  useEffect(() => {
    if (!happyHourStatus.isActive) {
      if (activeCategoryId === HAPPY_HOUR_CATEGORY_ID) {
        setActiveCategoryId(FEATURED_CATEGORY_ID);
      }
      if (selectedProduct?.categoriaId === HAPPY_HOUR_CATEGORY_ID) {
        closeProductDetail();
      }
    }
  }, [happyHourStatus.isActive, activeCategoryId, selectedProduct, closeProductDetail]);

  // Smooth scroll to a category section compensating for fixed header and category nav
  const scrollToCategory = useCallback((categoryId: number) => {
    setActiveView('menu');
    setActiveCategoryId(categoryId);

    // Timeout ensures DOM is visible if switching from favorites view
    setTimeout(() => {
      const targetId =
        categoryId === FEATURED_CATEGORY_ID
          ? 'categoria-destaques'
          : `categoria-${categoryId}`;
      const el = document.getElementById(targetId);
      if (el) {
        const yOffset = -135;
        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }, 50);
  }, []);

  // IntersectionObserver to update active category on scroll
  useEffect(() => {
    if (activeView !== 'menu' || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idAttr = entry.target.getAttribute('id');
            if (idAttr === 'categoria-destaques') {
              setActiveCategoryId(FEATURED_CATEGORY_ID);
            } else if (idAttr && idAttr.startsWith('categoria-')) {
              const catId = parseInt(idAttr.replace('categoria-', ''), 10);
              if (!isNaN(catId)) {
                setActiveCategoryId(catId);
              }
            }
          }
        }
      },
      {
        rootMargin: '-140px 0px -60% 0px',
        threshold: 0,
      }
    );

    const destaquesEl = document.getElementById('categoria-destaques');
    if (destaquesEl) observer.observe(destaquesEl);

    for (const cat of visibleCategorias) {
      const el = document.getElementById(`categoria-${cat.id}`);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [activeView, visibleCategorias]);

  return (
    <div className="min-h-screen bg-[#08090B] text-[#F5F3EE] flex flex-col font-sans selection:bg-[#FF5A16] selection:text-white">
      {/* Top Header */}
      <Header
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenCategories={() => setIsCategoriesModalOpen(true)}
        onSelectFavorites={() =>
          setActiveView((prev) => (prev === 'favorites' ? 'menu' : 'favorites'))
        }
        onSelectCategory={scrollToCategory}
        activeView={activeView}
        favoritesCount={visibleFavoritesCount}
        isHappyHourActive={happyHourStatus.isActive}
        categoriesCount={visibleCategorias.length}
        logoUrl={headerLogo}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeView === 'favorites' ? (
          <FavoritesView
            favoriteIds={favoriteIds}
            categorias={visibleCategorias}
            onToggleFavorite={toggleFavorite}
            onSelectProduct={(p, catTitle) => openProductDetail(p, catTitle)}
            onBackToMenu={() => setActiveView('menu')}
          />
        ) : (
          <>
            {/* Cinematic Hero */}
            <Hero
              onExplore={() => scrollToCategory(FEATURED_CATEGORY_ID)}
              onSelectCategory={scrollToCategory}
              happyHourStatus={happyHourStatus}
              categoriesCount={visibleCategorias.length}
              itemsCount={visibleItemsCount}
            />

            {/* Horizontal Category Nav */}
            <CategoryNav
              categorias={visibleCategorias}
              activeCategoryId={activeCategoryId}
              onSelectCategory={scrollToCategory}
              onOpenCategoriesModal={() => setIsCategoriesModalOpen(true)}
            />

            {/* Catalogue Layout: Sidebar on Desktop + Content Column */}
            <div
              id="catalogo"
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12"
            >
              <div className="flex items-start gap-8 lg:gap-12">
                {/* Desktop Sticky Sidebar */}
                <SidebarNav
                  categorias={visibleCategorias}
                  activeCategoryId={activeCategoryId}
                  onSelectCategory={scrollToCategory}
                  featuredCount={featuredProducts.length}
                />

                {/* Categories Catalogue */}
                <div className="min-w-0 flex-1 space-y-16 sm:space-y-24">
                  {/* Seção Destaques (Única com fotos grandes / carrossel) */}
                  <section
                    id="categoria-destaques"
                    className="scroll-mt-36"
                  >
                    <div className="mb-6 pb-4 border-b border-[#262930]">
                      <div className="flex items-center gap-2 mb-1.5">
                        <Sparkles className="w-4 h-4 text-[#FF5A16]" />
                        <span className="text-xs uppercase tracking-wider text-[#FF9A52] font-semibold">
                          Seleção Especial
                        </span>
                      </div>

                      <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#F5F3EE] uppercase tracking-tight">
                        Destaques
                      </h2>

                      <p className="text-xs sm:text-sm text-[#E4E6EB] mt-1.5 font-normal">
                        Deslize para ver os drinks e porções mais celebrados da Seven
                      </p>
                    </div>

                    <FeaturedCarousel
                      products={featuredProducts}
                      onSelectProduct={(p) => openProductDetail(p, 'Destaques')}
                      isFavorite={isFavorite}
                      onToggleFavorite={toggleFavorite}
                    />
                  </section>

                  {visibleCategorias.map((cat, catIndex) => {
                    const isHappyHour = cat.id === HAPPY_HOUR_CATEGORY_ID;
                    const indexStr = String(catIndex + 1).padStart(2, '0');

                    return (
                      <section
                        key={cat.id}
                        id={`categoria-${cat.id}`}
                        className="scroll-mt-36"
                      >
                        {/* Category Header */}
                        <div className="mb-6 sm:mb-8 pb-4 border-b border-[#262930]">
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="font-mono text-xs font-bold text-[#FF5A16] tabular-nums">
                              {indexStr}
                            </span>
                            <div className="w-6 h-[1px] bg-[#FF5A16]/50" aria-hidden="true" />
                            <span className="text-xs uppercase tracking-wider text-[#B9BCC3]">
                              Seção do Cardápio
                            </span>
                          </div>

                          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#F5F3EE] uppercase tracking-tight flex items-center gap-3">
                            <span>{cat.titulo.trim()}</span>
                          </h2>

                          {cat.observacao && (
                            <p className="text-xs sm:text-sm text-[#B9BCC3] mt-1.5 font-light">
                              {cat.observacao}
                            </p>
                          )}
                        </div>

                        {/* Happy Hour Specific Notice */}
                        {isHappyHour && <HappyHourNotice status={happyHourStatus} />}

                        {/* Blocks / Subgroups */}
                        <div className="space-y-8 sm:space-y-12">
                          {cat.blocos.map((bloco, blocoIndex) => (
                            <div key={bloco.subgrupoId ?? `bloco-${blocoIndex}`}>
                              {/* Subgroup Title only when present in original data */}
                              {bloco.titulo && (
                                <div className="flex items-center gap-3 mb-4 sm:mb-6">
                                  <h3 className="font-display text-base sm:text-lg font-bold text-[#FF9A52] uppercase tracking-wide">
                                    {bloco.titulo}
                                  </h3>
                                  <div className="flex-1 h-[1px] bg-[#262930]" aria-hidden="true" />
                                </div>
                              )}

                              {/* Products Grid (Compact Rows) */}
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                                {bloco.produtos.map((product) => (
                                  <ProductCard
                                    key={`${product.id}-${cat.id}`}
                                    product={product}
                                    categoriaTitulo={cat.titulo}
                                    isHappyHourCategory={isHappyHour}
                                    isFavorite={isFavorite(product.id)}
                                    onToggleFavorite={toggleFavorite}
                                    onSelectProduct={(p) =>
                                      openProductDetail(p, cat.titulo, bloco.titulo)
                                    }
                                  />
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </section>
                    );
                  })}
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <Footer logoUrl={footerLogo} />

      {/* Mobile Bottom Navigation */}
      <BottomNav
        activeView={activeView}
        onSelectView={setActiveView}
        favoritesCount={visibleFavoritesCount}
      />

      {/* Modals */}
      <ProductModal
        product={liveSelectedProduct}
        onClose={closeProductDetail}
        isFavorite={liveSelectedProduct ? isFavorite(liveSelectedProduct.id) : false}
        onToggleFavorite={toggleFavorite}
        categoriaTitulo={selectedProductMeta.categoriaTitulo}
        subgrupoTitulo={selectedProductMeta.subgrupoTitulo}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        categorias={visibleCategorias}
        onSelectProduct={(p, catTitle) => openProductDetail(p, catTitle)}
      />

      <CategoryIndexModal
        isOpen={isCategoriesModalOpen}
        onClose={() => setIsCategoriesModalOpen(false)}
        categorias={visibleCategorias}
        activeCategoryId={activeCategoryId}
        onSelectCategory={scrollToCategory}
        featuredCount={featuredProducts.length}
      />
    </div>
  );
}
