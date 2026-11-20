import React, { useState } from 'react';
import { resolveAssetUrl } from '../utils/formatters';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'header';
  imgClassName?: string;
  logoUrl?: string;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  imgClassName = '',
  logoUrl = 'https://dg-media.com.br/avatars/avatar_703514.png?v=1738753626',
}) => {
  const [imgError, setImgError] = useState(false);

  // Height configurations
  const heightClasses = {
    sm: 'h-8',
    md: 'h-10 md:h-12',
    lg: 'h-14 md:h-16',
    header: 'h-12 sm:h-16 max-h-[48px] sm:max-h-[62px]',
  };

  const textClasses = {
    sm: 'text-lg tracking-wider',
    md: 'text-2xl md:text-3xl tracking-widest',
    lg: 'text-4xl md:text-5xl tracking-widest',
    header: 'text-2xl sm:text-3xl tracking-widest',
  };

  const subtextClasses = {
    sm: 'text-[8px] tracking-[0.25em]',
    md: 'text-[10px] tracking-[0.3em]',
    lg: 'text-xs tracking-[0.35em]',
    header: 'text-[9px] sm:text-[10px] tracking-[0.3em]',
  };

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {!imgError && logoUrl ? (
        <img
          src={resolveAssetUrl(logoUrl)}
          alt="Seven Lounge & Drinks"
          className={`${heightClasses[size]} w-auto object-contain transition-opacity duration-300 ${imgClassName}`}
          onError={() => setImgError(true)}
          referrerPolicy="no-referrer"
          loading="eager"
        />
      ) : null}

      {/* Typographic fallback / enhancement ensuring exact brand presence */}
      {imgError && (
        <div className="flex flex-col items-start leading-none font-display">
          <div className={`font-extrabold text-[#F5F3EE] uppercase ${textClasses[size]}`}>
            SE<span className="text-[#FF5A16]">V</span>EN
          </div>
          <span className={`text-[#B9BCC3] font-sans font-medium uppercase mt-0.5 ${subtextClasses[size]}`}>
            LOUNGE &amp; DRINKS
          </span>
        </div>
      )}
    </div>
  );
};
