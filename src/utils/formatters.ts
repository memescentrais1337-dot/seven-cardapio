/**
 * Currency and string formatting helpers adhering to project guidelines.
 */

export function toCents(valueInReais: number | null | undefined): number | null {
  if (valueInReais === null || valueInReais === undefined) {
    return null;
  }
  return Math.round(valueInReais * 100);
}

export function formatBRL(valueInReais: number | null | undefined): string | null {
  if (valueInReais === null || valueInReais === undefined) {
    return null;
  }
  const cents = toCents(valueInReais);
  if (cents === null) return null;
  
  return (cents / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * Normalizes text for search by stripping diacritics and converting to lowercase.
 */
export function normalizeSearchText(text: string): string {
  if (!text) return '';
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

/**
 * Resolves local/public asset URLs against Vite's import.meta.env.BASE_URL,
 * leaving external URLs (http/https), data URIs, and already-prefixed paths intact.
 */
export function resolveAssetUrl(url: string | null | undefined): string | undefined {
  if (!url) return undefined;
  if (/^(https?:)?\/\/|^(data|blob):/i.test(url)) {
    return url;
  }
  const base = import.meta.env.BASE_URL || '/';
  const normalizedBase = base.endsWith('/') ? base : `${base}/`;
  if (url.startsWith(normalizedBase)) {
    return url;
  }
  const cleanPath = url.startsWith('/') ? url.slice(1) : url;
  return `${normalizedBase}${cleanPath}`;
}
