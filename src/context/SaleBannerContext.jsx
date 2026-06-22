import { createContext, useContext } from 'react';
import { useSaleBanner } from '../hooks/useSaleBanner';

const SaleBannerContext = createContext(null);

/** Wrap the whole app with this so every component can read sale banner state */
export function SaleBannerProvider({ children }) {
  const { banner, loading } = useSaleBanner();

  // Banner is visible only when enabled=true in Supabase — no user dismiss
  const isVisible = !loading && !!banner;
  const BANNER_H = 54; // px — keep in sync with SaleBanner height

  return (
    <SaleBannerContext.Provider value={{ banner, loading, isVisible, BANNER_H }}>
      {children}
    </SaleBannerContext.Provider>
  );
}

export function useSaleBannerContext() {
  const ctx = useContext(SaleBannerContext);
  if (!ctx) throw new Error('useSaleBannerContext must be used inside SaleBannerProvider');
  return ctx;
}
