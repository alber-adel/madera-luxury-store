import { useEffect, useRef, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { getDeviceType, getCleanReferrer, isBot } from '../utils/analyticsUtils';

// Generate a simple unique ID if it doesn't exist
function getOrCreateVisitorId() {
  if (typeof window === 'undefined') return ''; // Safety guard for SSR if needed
  let id = localStorage.getItem('madera_visitor_id');
  if (!id) {
    id = 'vis_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    localStorage.setItem('madera_visitor_id', id);
  }
  return id;
}

// Fetch visitor country via GeoIP (ipapi.co)
async function getCountry() {
  try {
    const res = await fetch('https://ipapi.co/json/');
    if (res.ok) {
      const data = await res.json();
      return data.country_name || 'Unknown';
    }
  } catch (e) {
    console.error('GeoIP error:', e);
  }
  return 'Unknown';
}

export function useAnalyticsTracker(options = true) {
  let enabled = true;
  let trackPageView = true;

  // Handle backward compatibility (supporting both boolean parameter and options object)
  if (typeof options === 'boolean') {
    enabled = options;
  } else if (typeof options === 'object' && options !== null) {
    enabled = options.enabled ?? true;
    trackPageView = options.trackPageView ?? true;
  }

  const visitorId = getOrCreateVisitorId();
  const lastClickRef = useRef({ name: '', time: 0 });
  
  // Track whether listeners are active to avoid stale closures during cleanup
  const listenersAttachedRef = useRef(false);

  useEffect(() => {
    // Skip if disabled, page view tracking is off, or visitor is a bot
    if (!enabled || !trackPageView || isBot(navigator.userAgent)) return;

    const now = Date.now();
    const lastViewStr = localStorage.getItem('madera_last_view_time');
    const lastViewTime = lastViewStr ? parseInt(lastViewStr, 10) : 0;
    const FIFTEEN_MINUTES = 15 * 60 * 1000;

    const removeInteractionListeners = () => {
      window.removeEventListener('scroll', logPageViewWithInteraction);
      window.removeEventListener('mousemove', logPageViewWithInteraction);
      window.removeEventListener('keydown', logPageViewWithInteraction);
      window.removeEventListener('touchstart', logPageViewWithInteraction);
      window.removeEventListener('click', logPageViewWithInteraction);
      listenersAttachedRef.current = false;
    };

    const logPageViewWithInteraction = async () => {
      removeInteractionListeners();
      localStorage.setItem('madera_last_view_time', String(now));

      try {
        // Get country (cached in localStorage to only call API once per visitor)
        let country = localStorage.getItem('madera_visitor_country');
        
        // Retry fetching if it is not set or was previously recorded as "Unknown"
        if (!country || country === 'Unknown') {
          country = await getCountry();
          localStorage.setItem('madera_visitor_country', country);
        }

        const device = getDeviceType(navigator.userAgent);
        const referrer = getCleanReferrer(document.referrer);

        await supabase.from('page_views').insert([{ 
          visitor_id: visitorId,
          country,
          device,
          referrer
        }]);
      } catch (err) {
        console.error('Error logging page view:', err);
        // Rollback timestamp in localStorage in case of network failure to retry on next visit
        localStorage.setItem('madera_last_view_time', String(lastViewTime));
      }
    };

    if (now - lastViewTime > FIFTEEN_MINUTES) {
      window.addEventListener('scroll', logPageViewWithInteraction, { passive: true });
      window.addEventListener('mousemove', logPageViewWithInteraction, { passive: true });
      window.addEventListener('keydown', logPageViewWithInteraction, { passive: true });
      window.addEventListener('touchstart', logPageViewWithInteraction, { passive: true });
      window.addEventListener('click', logPageViewWithInteraction, { passive: true });
      listenersAttachedRef.current = true;
    }

    // Presence configuration for Supabase Realtime
    const channel = supabase.channel('online_users', {
      config: {
        presence: {
          key: visitorId,
        },
      },
    });

    channel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await channel.track({
          online_at: new Date().toISOString(),
        });
      }
    });

    return () => {
      if (listenersAttachedRef.current) {
        removeInteractionListeners();
      }
      supabase.removeChannel(channel);
    };
  }, [visitorId, enabled, trackPageView]);

  // Memoize click tracking callback to prevent unnecessary re-renders in child elements
  const trackProductClick = useCallback(async (productName) => {
    if (!enabled || isBot(navigator.userAgent)) return;
    const now = Date.now();

    // Deduplicate: If same product is clicked within 3 seconds, skip logging
    if (lastClickRef.current.name === productName && now - lastClickRef.current.time < 3000) {
      return;
    }
    lastClickRef.current = { name: productName, time: now };

    try {
      await supabase.from('product_clicks').insert([
        { product_name: productName, visitor_id: visitorId }
      ]);
    } catch (err) {
      console.error('Error logging product click:', err);
    }
  }, [enabled, visitorId]);

  return { trackProductClick };
}
