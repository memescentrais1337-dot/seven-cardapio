import React from 'react';
import { Logo } from './Logo';
import footerLogo from '../assets/images/regenerated_image_1794500466325.png';

interface FooterProps {
  logoUrl?: string;
}

export const Footer: React.FC<FooterProps> = ({
  logoUrl = footerLogo,
}) => {
  return (
    <footer className="bg-[#08090B] border-t border-[#262930] py-12 sm:py-16 text-[#B9BCC3] pb-24 md:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-10 border-b border-[#262930]/60">
          <div>
            <Logo size="md" logoUrl={logoUrl} />
            <p className="font-display text-sm tracking-widest text-[#F5F3EE] mt-3 uppercase">
              A NOITE COMEÇA AQUI.
            </p>
            <p className="text-xs text-[#B9BCC3]/80 mt-1 max-w-sm">
              Cardápio digital para visualização no Seven Lounge &amp; Drinks.
            </p>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#B9BCC3]/60">
          <p>© {new Date().getFullYear()} Seven Lounge &amp; Drinks. Todos os direitos reservados.</p>
          <a
            href="https://www.instagram.com/clicaebio/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#B9BCC3] hover:text-[#FF5A16] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5A16] rounded"
          >
            Produzido por <span className="font-semibold text-[#F5F3EE]">ClicaêBio</span>
          </a>
        </div>
      </div>
    </footer>
  );
};
