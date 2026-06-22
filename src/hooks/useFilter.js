import { useState, useMemo } from 'react';

/**
 * useFilter — manages category-based filtering of a products array.
 * Now accepts `products` as a parameter (fetched from Supabase).
 * Returns { filtered, activeCategory, setActiveCategory }
 */
export function useFilter(products = []) {
  const [activeCategory, setActiveCategory] = useState('all');

  const filtered = useMemo(() => {
    if (activeCategory === 'all') return products;
    return products.filter((p) => p.category === activeCategory);
  }, [activeCategory, products]);

  return { filtered, activeCategory, setActiveCategory };
}

export default useFilter;
