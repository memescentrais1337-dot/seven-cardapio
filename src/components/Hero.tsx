import React from 'react';
import { Sparkles, ArrowDown, Clock } from 'lucide-react';
import { HappyHourStatus } from '../utils/happyHour';

interface HeroProps {
  onExplore: () => void;
  onSelectCategory: (categoryId: number) => void;
  happyHourStatus: HappyHourStatus;
  categoriesCount?: number;
  itemsCount?: number;
}

export const Hero: React.FC<HeroProps> = ({
  onExplore,
  onSelectCategory,
  happyHourStatus,
  categoriesCount = 13,
  itemsCount = 124,
}) => {
  return (
    <section
      id="topo"
      className="relative overflow-hidden bg-[#08090B] border-b border-[#262930] pt-6 sm:pt-10 lg:pt-14 pb-8 sm:pb-12"
    >
      {/* Subtle architectural angular accent lines evoking the V mark */}
      <div
        className="absolute top-0 right-1/4 w-[1px] h-full bg-gradient-to-b from-[#FF5A16]/20 via-[#FF5A16]/5 to-transparent pointer-events-none transform -skew-x-12"
        aria-hidden="true"
      />
      <div
        className="absolute top-1/3 -right-20 w-96 h-96 bg-[#FF5A16]/5 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          {/* Live Happy Hour Status Chip */}
          <div className="inline-flex items-center gap-2 mb-4 sm:mb-6 text-xs text-[#B9BCC3]">
            <span
              className={`w-2 h-2 rounded-full shrink-0 ${
                happyHourStatus.isActive ? 'bg-[#FF5A16]' : 'bg-[#B9BCC3]/40'
              }`}
              aria-hidden="true"
            />
            <span className="font-medium text-[#F5F3EE]">
              {happyHourStatus.statusLabel}
            </span>
            <span aria-hidden="true" className="text-[#262930]">
              ·
            </span>
            <span className="text-[#B9BCC3] flex items-center gap-1 font-mono tabular-nums">
              <Clock className="w-3 h-3 text-[#FF5A16]" />
              {happyHourStatus.timeInEstablishment}
            </span>
          </div>

          {/* Concept Headline */}
          <div className="relative mb-4 sm:mb-6">
            {/* Discreet thin orange line accent */}
            <div
              className="w-12 h-1 bg-[#FF5A16] mb-4 sm:mb-6"
              aria-hidden="true"
            />
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#F5F3EE] uppercase leading-[1.08] text-balance">
              A NOITE <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F5F3EE] via-[#F5F3EE] to-[#FF9A52]">
                COMEÇA
              </span>{' '}
              <span className="text-[#FF5A16]">AQUI.</span>
            </h1>
          </div>

          {/* Support Text */}
          <p className="text-base sm:text-lg text-[#B9BCC3] font-normal leading-relaxed max-w-xl mb-6 sm:mb-8 text-pretty">
            Escolha seu drink. Encontre sua porção. Curta a Seven.
          </p>

          {/* Primary & Secondary Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-8">
            <button
              onClick={onExplore}
              className="group inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-lg bg-[#FF5A16] text-white font-bold text-sm hover:bg-[#FF9A52] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5A16] min-h-[48px] shadow-lg shadow-[#FF5A16]/20"
            >
              <span>Explorar o cardápio</span>
              <ArrowDown className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onSelectCategory(45216)}
                className="inline-flex items-center justify-center px-4 py-3 rounded-lg bg-[#141518] hover:bg-[#1B1D22] text-[#F5F3EE] border border-[#262930] hover:border-[#FF5A16]/40 text-sm font-semibold transition-colors min-h-[48px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5A16]"
              >
                Drinks
              </button>
              <button
                onClick={() => onSelectCategory(45041)}
                className="inline-flex items-center justify-center px-4 py-3 rounded-lg bg-[#141518] hover:bg-[#1B1D22] text-[#F5F3EE] border border-[#262930] hover:border-[#FF5A16]/40 text-sm font-semibold transition-colors min-h-[48px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5A16]"
              >
                Petiscos
              </button>
            </div>
          </div>

          {/* Quick highlight bar with real context */}
          <div className="pt-4 border-t border-[#262930]/80 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-[#B9BCC3]">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#FF5A16]" />
              <span>Drinks autorais &amp; clássicos</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[#FF5A16] font-bold">{categoriesCount}</span>
              <span>Categorias completas</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[#FF5A16] font-bold">{itemsCount}</span>
              <span>Itens cadastrados</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
