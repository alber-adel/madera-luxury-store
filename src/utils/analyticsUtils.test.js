import { describe, it, expect } from 'vitest';
import { getDeviceType, getCleanReferrer, calculateAnalyticsMetrics, isBot } from './analyticsUtils';

describe('Analytics Utility Functions', () => {

  // 0. Bot Filtering Tests
  describe('isBot', () => {
    it('should identify search engine crawlers as bots', () => {
      const googlebot = 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)';
      const bingbot = 'Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)';
      const yandexbot = 'Mozilla/5.0 (compatible; YandexBot/3.0; +http://yandex.com/bots)';
      
      expect(isBot(googlebot)).toBe(true);
      expect(isBot(bingbot)).toBe(true);
      expect(isBot(yandexbot)).toBe(true);
    });

    it('should identify auditor and scraper agents as bots', () => {
      const lighthouse = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4695.0 Safari/537.36 Chrome-Lighthouse';
      const semrush = 'Mozilla/5.0 (compatible; SemrushBot/7~bl; +http://www.semrush.com/bot.html)';
      
      expect(isBot(lighthouse)).toBe(true);
      expect(isBot(semrush)).toBe(true);
    });

    it('should identify real human user agents as non-bots', () => {
      const iPhoneChrome = 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/114.0.5735.99 Mobile/15E148 Safari/604.1';
      const macSafari = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Safari/605.1.15';
      const windowsEdge = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 Edg/114.0.1823.43';

      expect(isBot(iPhoneChrome)).toBe(false);
      expect(isBot(macSafari)).toBe(false);
      expect(isBot(windowsEdge)).toBe(false);
    });
  });

  // 1. Device Type Tests
  describe('getDeviceType', () => {
    it('should correctly identify Mobile devices', () => {
      const iPhoneUA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1';
      const androidUA = 'Mozilla/5.0 (Linux; Android 13; SM-S908B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Mobile Safari/537.36';
      
      expect(getDeviceType(iPhoneUA)).toBe('Mobile');
      expect(getDeviceType(androidUA)).toBe('Mobile');
    });

    it('should correctly identify Tablet devices', () => {
      const iPadUA = 'Mozilla/5.0 (iPad; CPU OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1';
      const androidTabletUA = 'Mozilla/5.0 (Linux; Android 9; SM-T510) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36';
      
      expect(getDeviceType(iPadUA)).toBe('Tablet');
      expect(getDeviceType(androidTabletUA)).toBe('Tablet');
    });

    it('should default to Desktop for other or empty user agents', () => {
      const chromeDesktopUA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36';
      
      expect(getDeviceType(chromeDesktopUA)).toBe('Desktop');
      expect(getDeviceType('')).toBe('Desktop');
      expect(getDeviceType(null)).toBe('Desktop');
    });
  });

  // 2. Referrer Clean Tests
  describe('getCleanReferrer', () => {
    it('should return Direct for empty referrers', () => {
      expect(getCleanReferrer('')).toBe('Direct');
      expect(getCleanReferrer(null)).toBe('Direct');
    });

    it('should group social media referrers cleanly', () => {
      expect(getCleanReferrer('https://l.facebook.com/l.php?u=xyz')).toBe('Facebook');
      expect(getCleanReferrer('https://instagram.com/p/abc')).toBe('Instagram');
      expect(getCleanReferrer('https://tiktok.com/@user/video/123')).toBe('TikTok');
      expect(getCleanReferrer('https://t.co/xyz123')).toBe('Twitter/X');
      expect(getCleanReferrer('https://www.youtube.com/watch?v=123')).toBe('YouTube');
    });

    it('should group search engine referrers', () => {
      expect(getCleanReferrer('https://www.google.com/search?q=madera+home')).toBe('Google');
      expect(getCleanReferrer('https://www.google.com.eg/')).toBe('Google');
    });

    it('should extract domains for custom external websites', () => {
      expect(getCleanReferrer('https://some-furniture-blog.com/post-about-wood')).toBe('some-furniture-blog.com');
    });
  });

  // 3. Analytics Calculation Logic Tests
  describe('calculateAnalyticsMetrics', () => {
    const mockViews = [
      { visitor_id: 'vis_a', created_at: new Date().toISOString(), country: 'Egypt', device: 'Mobile', referrer: 'Facebook' },
      { visitor_id: 'vis_b', created_at: new Date().toISOString(), country: 'Egypt', device: 'Mobile', referrer: 'Direct' },
      // Same visitor visiting again (should be deduplicated in unique visitor count, but counted in total views)
      { visitor_id: 'vis_a', created_at: new Date().toISOString(), country: 'Egypt', device: 'Mobile', referrer: 'Facebook' },
      // Older view (say, 5 days ago)
      { visitor_id: 'vis_c', created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), country: 'Saudi Arabia', device: 'Desktop', referrer: 'Google' }
    ];

    const mockClicks = [
      { product_name: 'Classic Sofa' },
      { product_name: 'Luxury Table' },
      { product_name: 'Classic Sofa' }
    ];

    it('should correctly calculate unique visitors today and this month', () => {
      const metrics = calculateAnalyticsMetrics(mockViews, mockClicks, 100);

      // vis_a and vis_b are today (2 unique today)
      expect(metrics.today).toBe(2);
      // vis_a, vis_b, and vis_c are this month (3 unique this month)
      expect(metrics.month).toBe(3);
      // TotalViewsCount passed in is 100
      expect(metrics.total).toBe(100);
    });

    it('should correctly rank and structure metadata statistics', () => {
      const metrics = calculateAnalyticsMetrics(mockViews, mockClicks, 100);

      // Countries ranking: Egypt has 3, Saudi Arabia has 1
      expect(metrics.countries).toEqual([
        { name: 'Egypt', count: 3 },
        { name: 'Saudi Arabia', count: 1 }
      ]);

      // Devices ranking: Mobile has 3, Desktop has 1
      expect(metrics.devices).toEqual([
        { name: 'Mobile', count: 3 },
        { name: 'Desktop', count: 1 }
      ]);

      // Referrers ranking: Facebook has 2, Direct has 1, Google has 1
      expect(metrics.referrers).toEqual([
        { name: 'Facebook', count: 2 },
        { name: 'Direct', count: 1 },
        { name: 'Google', count: 1 }
      ]);
    });

    it('should correctly count and rank product clicks', () => {
      const metrics = calculateAnalyticsMetrics(mockViews, mockClicks, 100);

      // Classic Sofa has 2 clicks, Luxury Table has 1
      expect(metrics.clicks).toEqual([
        { name: 'Classic Sofa', count: 2 },
        { name: 'Luxury Table', count: 1 }
      ]);
    });

    it('should handle empty lists gracefully without throwing errors', () => {
      const metrics = calculateAnalyticsMetrics([], [], 0);

      expect(metrics.today).toBe(0);
      expect(metrics.month).toBe(0);
      expect(metrics.total).toBe(0);
      expect(metrics.countries).toEqual([]);
      expect(metrics.devices).toEqual([]);
      expect(metrics.referrers).toEqual([]);
      expect(metrics.clicks).toEqual([]);
    });
  });

});
