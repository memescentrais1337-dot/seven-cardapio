import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'seven_lounge_favorites_v1';

export function useFavorites() {
  const [favoriteIds, setFavoriteIds] = useState<number[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed)
        ? parsed.filter((id): id is number => typeof id === 'number' && Number.isFinite(id))
        : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favoriteIds));
    } catch (e) {
      console.warn('Failed to save favorites to localStorage:', e);
    }
  }, [favoriteIds]);

  const toggleFavorite = useCallback((id: number) => {
    setFavoriteIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }, []);

  const isFavorite = useCallback(
    (id: number) => favoriteIds.includes(id),
    [favoriteIds]
  );

  return {
    favoriteIds,
    toggleFavorite,
    isFavorite,
    favoritesCount: favoriteIds.length,
  };
}
