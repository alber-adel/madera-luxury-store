// Detect if the user agent belongs to a web crawler, spider, or automated bot
export function isBot(ua) {
  if (!ua) return false;
  
  // 1. Check navigator.webdriver (true for headless browsers/automation scripts)
  if (typeof window !== 'undefined' && window.navigator && window.navigator.webdriver) {
    return true;
  }
  
  // 2. Regexp matching common automated bots and crawlers
  const botPattern = /bot|crawler|spider|crawling|slurp|directory|fetcher|lighthouse|pingdom|semrush|googlebot|bingbot|yandexbot|ahrefsbot|baiduspider|duckduckbot|exabot|facebot|ia_archiver/i;
  return botPattern.test(ua);
}

// Get device type based on user agent string
export function getDeviceType(ua) {
  if (!ua) return 'Desktop';
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'Tablet';
  }
  if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    return 'Mobile';
  }
  return 'Desktop';
}

// Extract and clean referral sources
export function getCleanReferrer(ref) {
  if (!ref) return 'Direct';
  try {
    const url = new URL(ref);
    const host = url.hostname.toLowerCase();
    if (host.includes('facebook.com') || host.includes('fb.me')) return 'Facebook';
    if (host.includes('instagram.com')) return 'Instagram';
    if (host.includes('google.com') || host.includes('google.')) return 'Google';
    if (host.includes('tiktok.com')) return 'TikTok';
    if (host.includes('youtube.com') || host.includes('youtu.be')) return 'YouTube';
    if (host.includes('pinterest.com')) return 'Pinterest';
    if (host.includes('t.co') || host.includes('twitter.com') || host.includes('x.com')) return 'Twitter/X';
    return url.hostname;
  } catch (e) {
    return 'Referrer';
  }
}

// Calculate visitor and interaction metrics from raw database views and clicks
export function calculateAnalyticsMetrics(monthViews = [], clickData = [], totalViewsCount = 0) {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todayViews = monthViews?.filter(v => new Date(v.created_at) >= todayStart) || [];
  const uniqueToday = new Set(todayViews.map(v => v.visitor_id)).size;
  const uniqueMonth = new Set(monthViews?.map(v => v.visitor_id)).size;

  const countryCounts = {};
  const deviceCounts = {};
  const referrerCounts = {};

  monthViews?.forEach(v => {
    const c = v.country || 'Unknown';
    const d = v.device || 'Desktop';
    const r = v.referrer || 'Direct';

    countryCounts[c] = (countryCounts[c] || 0) + 1;
    deviceCounts[d] = (deviceCounts[d] || 0) + 1;
    referrerCounts[r] = (referrerCounts[r] || 0) + 1;
  });

  const sortedCountries = Object.entries(countryCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  const sortedDevices = Object.entries(deviceCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  const sortedReferrers = Object.entries(referrerCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  const countsMap = {};
  clickData?.forEach(c => {
    countsMap[c.product_name] = (countsMap[c.product_name] || 0) + 1;
  });
  const sortedClicks = Object.entries(countsMap)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return {
    today: uniqueToday,
    month: uniqueMonth,
    total: totalViewsCount || 0,
    clicks: sortedClicks,
    countries: sortedCountries,
    devices: sortedDevices,
    referrers: sortedReferrers
  };
}
