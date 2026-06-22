import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

/**
 * useSaleBanner — fetches the sale banner settings from the `site_settings` table.
 * Returns { banner, loading }
 * banner = null if disabled or no record exists
 */
export function useSaleBanner() {
  const [banner, setBanner] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBanner() {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('*')
          .eq('key', 'sale_banner')
          .maybeSingle();

        if (error || !data) { setBanner(null); return; }

        const value = typeof data.value === 'string' ? JSON.parse(data.value) : data.value;

        // Only show if enabled = true
        if (!value?.enabled) { setBanner(null); return; }

        setBanner(value);
      } catch {
        setBanner(null);
      } finally {
        setLoading(false);
      }
    }

    fetchBanner();

    // Real-time: refresh if settings change in Supabase dashboard
    const channel = supabase
      .channel('site-settings-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'site_settings' }, fetchBanner)
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  return { banner, loading };
}
