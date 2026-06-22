import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { CATEGORIES } from '../../data/productData';
import { calculateAnalyticsMetrics } from '../../utils/analyticsUtils';

// Constants
const BUCKET_NAME = 'products-images';
const STORAGE_BASE = `https://zahhrknatspivrpsovuj.supabase.co/storage/v1/object/public/${BUCKET_NAME}`;

const BADGES = ['New Arrival', 'Best Seller', 'Featured', 'Limited', 'Signature', 'Sale'];

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');

  const [activeTab, setActiveTab] = useState('analytics'); // 'analytics' | 'products' | 'testimonials' | 'banner'
  const [toast, setToast] = useState(null);

  // Analytics states
  const [analytics, setAnalytics] = useState({
    today: 0,
    month: 0,
    total: 0,
    online: 1,
    clicks: [],
    countries: [],
    devices: [],
    referrers: []
  });
  const [analyticsLoading, setAnalyticsLoading] = useState(true);

  // Data states
  const [products, setProducts] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [bannerSettings, setBannerSettings] = useState({
    enabled: false,
    discount: '',
    title_en: '',
    title_ar: '',
    subtitle_ar: '',
    end_time: ''
  });

  // Loadings
  const [productsLoading, setProductsLoading] = useState(true);
  const [testimonialsLoading, setTestimonialsLoading] = useState(true);
  const [bannerLoading, setBannerLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Modals / Editors
  const [editingProduct, setEditingProduct] = useState(null); // null or product object
  const [editingTestimonial, setEditingTestimonial] = useState(null); // null or testimonial object
  const [folderImages, setFolderImages] = useState([]);
  const [imagesLoading, setImagesLoading] = useState(false);

  // Authentication check with Supabase Session
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: emailInput,
        password: passwordInput,
      });
      if (error) {
        setAuthError(
          error.message === 'Invalid login credentials' 
            ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة / Invalid credentials' 
            : error.message
        );
      }
    } catch (err) {
      setAuthError(err.message);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      showToast(`Logout failed: ${err.message}`, 'error');
    }
  };

  // Toast Helper
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // ──────────────────────────────────────────────
  // API calls
  // ──────────────────────────────────────────────

  // Fetch Products
  const fetchProducts = async () => {
    try {
      setProductsLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      showToast(`Error fetching products: ${err.message}`, 'error');
    } finally {
      setProductsLoading(false);
    }
  };

  // Fetch Testimonials
  const fetchTestimonials = async () => {
    try {
      setTestimonialsLoading(true);
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setTestimonials(data || []);
    } catch (err) {
      showToast(`Error fetching testimonials: ${err.message}`, 'error');
    } finally {
      setTestimonialsLoading(false);
    }
  };

  // Fetch Banner Settings
  const fetchBannerSettings = async () => {
    try {
      setBannerLoading(true);
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('key', 'sale_banner')
        .maybeSingle();

      if (error) throw error;
      if (data) {
        const parsed = typeof data.value === 'string' ? JSON.parse(data.value) : data.value;
        setBannerSettings({
          enabled: parsed.enabled || false,
          discount: parsed.discount || '',
          title_en: parsed.title_en || '',
          title_ar: parsed.title_ar || '',
          subtitle_ar: parsed.subtitle_ar || '',
          end_time: parsed.end_time ? parsed.end_time.substring(0, 16) : '' // format for datetime-local
        });
      }
    } catch (err) {
      showToast(`Error fetching banner settings: ${err.message}`, 'error');
    } finally {
      setBannerLoading(false);
    }
  };

  // Fetch Analytics Data
  const fetchAnalytics = async () => {
    try {
      setAnalyticsLoading(true);

      // 1. Fetch Total Page Views count
      const { count: totalViewsCount, error: errTotal } = await supabase
        .from('page_views')
        .select('*', { count: 'exact', head: true });

      if (errTotal) throw errTotal;

      // 2. Fetch Page Views this month
      const monthStart = new Date();
      monthStart.setDate(1);
      monthStart.setHours(0,0,0,0);

      const { data: monthViews, error: errMonth } = await supabase
        .from('page_views')
        .select('visitor_id, created_at, country, device, referrer')
        .gte('created_at', monthStart.toISOString());

      if (errMonth) throw errMonth;

      // 3. Fetch Product Clicks
      const { data: clickData, error: errClicks } = await supabase
        .from('product_clicks')
        .select('product_name');

      if (errClicks) throw errClicks;

      const metrics = calculateAnalyticsMetrics(monthViews, clickData, totalViewsCount);

      setAnalytics(prev => ({
        ...prev,
        ...metrics
      }));
    } catch (err) {
      showToast(`Error fetching analytics: ${err.message}`, 'error');
    } finally {
      setAnalyticsLoading(false);
    }
  };

  // Fetch data on authentication
  useEffect(() => {
    if (isAuthenticated) {
      fetchAnalytics();
      fetchProducts();
      fetchTestimonials();
      fetchBannerSettings();

      // Realtime Presence for Admin dashboard
      const channel = supabase.channel('online_users');
      channel
        .on('presence', { event: 'sync' }, () => {
          const state = channel.presenceState();
          const count = Object.keys(state).length;
          setAnalytics(prev => ({ ...prev, online: count || 1 }));
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [isAuthenticated]);

  // Load images in active product folder
  const fetchFolderImages = async (folderPath) => {
    if (!folderPath) {
      setFolderImages([]);
      return;
    }
    try {
      setImagesLoading(true);
      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .list(folderPath, { sortBy: { column: 'name', order: 'asc' } });

      if (error) throw error;
      const validFiles = data?.filter(f => f.name && !f.name.startsWith('.')) || [];
      setFolderImages(validFiles.map(f => ({
        name: f.name,
        url: `${STORAGE_BASE}/${folderPath}/${f.name}`
      })));
    } catch (err) {
      console.error('Error loading folder images:', err);
    } finally {
      setImagesLoading(false);
    }
  };

  useEffect(() => {
    if (editingProduct && editingProduct.folder_path) {
      fetchFolderImages(editingProduct.folder_path);
    }
  }, [editingProduct?.folder_path]);

  // ──────────────────────────────────────────────
  // Image Upload & Delete Handler
  // ──────────────────────────────────────────────
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0 || !editingProduct?.folder_path) return;

    setActionLoading(true);
    try {
      for (const file of files) {
        const cleanName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
        const filePath = `${editingProduct.folder_path}/${cleanName}`;
        const { error } = await supabase.storage
          .from(BUCKET_NAME)
          .upload(filePath, file, { upsert: true });

        if (error) throw error;
      }
      showToast('Uploaded successfully / تم الرفع بنجاح');
      await fetchFolderImages(editingProduct.folder_path);
    } catch (err) {
      showToast(`Upload failed: ${err.message}`, 'error');
    } finally {
      setActionLoading(false);
      e.target.value = ''; // reset file input
    }
  };

  const handleImageDelete = async (fileName) => {
    if (!confirm('Are you sure you want to delete this image?')) return;
    setActionLoading(true);
    try {
      const filePath = `${editingProduct.folder_path}/${fileName}`;
      const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .remove([filePath]);

      if (error) throw error;
      showToast('Deleted successfully / تم الحذف بنجاح');
      await fetchFolderImages(editingProduct.folder_path);
    } catch (err) {
      showToast(`Delete failed: ${err.message}`, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // ──────────────────────────────────────────────
  // Product Save & Delete Handlers
  // ──────────────────────────────────────────────
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const payload = {
        name: editingProduct.name,
        category: editingProduct.category,
        price: editingProduct.price ? parseInt(editingProduct.price, 10) : null,
        badge: editingProduct.badge || null,
        featured: editingProduct.featured || false,
        sort_order: parseInt(editingProduct.sort_order || 0, 10),
        folder_path: editingProduct.folder_path || null,
        components: editingProduct.components || '',
        materials: editingProduct.materials || '',
        dimensions: editingProduct.dimensions || '',
      };

      let error;
      if (editingProduct.id) {
        // Update
        const { error: err } = await supabase
          .from('products')
          .update(payload)
          .eq('id', editingProduct.id);
        error = err;
      } else {
        // Insert
        const { error: err } = await supabase
          .from('products')
          .insert([payload]);
        error = err;
      }

      if (error) throw error;

      showToast('Product saved successfully / تم حفظ المنتج بنجاح');
      setEditingProduct(null);
      fetchProducts();
    } catch (err) {
      showToast(`Save failed: ${err.message}`, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm('Are you sure you want to delete this product? / هل أنت متأكد من حذف هذا المنتج؟')) return;
    setActionLoading(true);
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      showToast('Product deleted / تم حذف المنتج');
      fetchProducts();
    } catch (err) {
      showToast(`Delete failed: ${err.message}`, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // ──────────────────────────────────────────────
  // Testimonial Save & Delete Handlers
  // ──────────────────────────────────────────────
  const handleSaveTestimonial = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const payload = {
        name: editingTestimonial.name,
        role: editingTestimonial.role || '',
        text: editingTestimonial.text,
        rating: parseInt(editingTestimonial.rating || 5, 10),
        initials: editingTestimonial.initials || '',
        sort_order: parseInt(editingTestimonial.sort_order || 0, 10),
      };

      let error;
      if (editingTestimonial.id) {
        const { error: err } = await supabase
          .from('testimonials')
          .update(payload)
          .eq('id', editingTestimonial.id);
        error = err;
      } else {
        const { error: err } = await supabase
          .from('testimonials')
          .insert([payload]);
        error = err;
      }

      if (error) throw error;

      showToast('Testimonial saved / تم حفظ التقييم بنجاح');
      setEditingTestimonial(null);
      fetchTestimonials();
    } catch (err) {
      showToast(`Save failed: ${err.message}`, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteTestimonial = async (id) => {
    if (!confirm('Delete this testimonial? / هل أنت متأكد من حذف التقييم؟')) return;
    setActionLoading(true);
    try {
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', id);

      if (error) throw error;
      showToast('Testimonial deleted / تم حذف التقييم');
      fetchTestimonials();
    } catch (err) {
      showToast(`Delete failed: ${err.message}`, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // ──────────────────────────────────────────────
  // Banner Settings Save Handler
  // ──────────────────────────────────────────────
  const handleSaveBanner = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const payload = {
        enabled: bannerSettings.enabled,
        discount: bannerSettings.discount || '',
        title_en: bannerSettings.title_en || '',
        title_ar: bannerSettings.title_ar || '',
        subtitle_ar: bannerSettings.subtitle_ar || '',
        end_time: bannerSettings.end_time ? new Date(bannerSettings.end_time).toISOString() : null
      };

      const { error } = await supabase
        .from('site_settings')
        .update({ value: payload })
        .eq('key', 'sale_banner');

      if (error) throw error;
      showToast('Banner settings updated / تم تحديث البنر بنجاح');
    } catch (err) {
      showToast(`Update failed: ${err.message}`, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // ──────────────────────────────────────────────
  // Login Screen
  // ──────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center p-6" 
        style={{ background: '#0E0C0A' }}
      >
        <div 
          className="w-full max-w-md p-8 rounded-lg shadow-2xl relative overflow-hidden"
          style={{ 
            background: '#1C1A17',
            border: '1px solid rgba(201, 169, 110, 0.15)',
          }}
        >
          {/* Accent Gold Border */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold via-[#A07840] to-gold" />
          
          <div className="text-center mb-8">
            <span 
              className="text-[10px] tracking-[0.25em] uppercase font-semibold"
              style={{ color: '#C9A96E' }}
            >
              Madera Home
            </span>
            <h1 
              className="text-2xl mt-2 font-light text-white"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Admin Dashboard
            </h1>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider mb-2 text-white/60">
                  Email Address / البريد الإلكتروني
                </label>
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full px-4 py-3 rounded bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#C9A96E] transition-colors"
                  placeholder="admin@maderahomeeg.com"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider mb-2 text-white/60">
                  Password / كلمة المرور
                </label>
                <input
                  type="password"
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full px-4 py-3 rounded bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#C9A96E] transition-colors"
                  placeholder="••••••••"
                />
              </div>

              {authError && (
                <p className="text-red-500 text-xs mt-2 text-center">{authError}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 text-xs font-semibold tracking-widest uppercase transition-all duration-300 hover:brightness-110"
              style={{
                background: 'linear-gradient(135deg, #C9A96E, #A07840)',
                color: 'white',
              }}
            >
              Log In
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white flex flex-col font-sans" style={{ background: '#0E0C0A' }}>
      
      {/* Toast Alert */}
      {toast && (
        <div 
          className="fixed top-6 right-6 z-[1000] px-5 py-3.5 shadow-xl text-sm font-medium animate-fadeIn border"
          style={{
            background: toast.type === 'error' ? '#2C0F0F' : '#1C2A1A',
            borderColor: toast.type === 'error' ? '#C0392B' : '#27AE60',
            color: toast.type === 'error' ? '#FADBD8' : '#D4EFDF'
          }}
        >
          {toast.message}
        </div>
      )}

      {/* Header */}
      <header className="border-b border-white/5 py-4 px-6 md:px-12 flex items-center justify-between" style={{ background: '#141210' }}>
        <div className="flex items-center gap-3">
          <div className="flex flex-col leading-none">
            <span style={{ fontFamily: "'Playfair Display', serif", color: '#FAF8F5', fontSize: '1.2rem' }}>
              Madera
            </span>
            <span style={{ fontSize: '9px', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#C9A96E', fontWeight: 650 }}>
              Home
            </span>
          </div>
          <span className="h-4 w-px bg-white/20" />
          <span className="text-xs uppercase tracking-widest text-white/50">Admin Panel</span>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="/"
            className="text-xs font-medium text-white/70 hover:text-white transition-colors"
          >
            ← View Site
          </a>
          <button
            onClick={handleLogout}
            className="px-4 py-2 border border-white/10 text-xs uppercase tracking-wider text-white/60 hover:text-white hover:bg-white/5 transition-all"
          >
            Log Out
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-6 md:px-12 py-8 flex flex-col md:flex-row gap-8">
        
        {/* Navigation Sidebar */}
        <aside className="w-full md:w-64 flex-shrink-0 flex flex-row md:flex-col gap-2 border-b md:border-b-0 md:border-r border-white/5 pb-4 md:pb-0 md:pr-6">
          {[
            { id: 'analytics', label: '📊 Analytics (الإحصائيات)' },
            { id: 'products', label: '📦 Products (المنتجات)' },
            { id: 'testimonials', label: '💬 Testimonials (الآراء)' },
            { id: 'banner', label: '📢 Sale Banner (العروض)' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setEditingProduct(null);
                setEditingTestimonial(null);
              }}
              className={`flex-1 md:flex-none text-left px-4 py-3 text-xs font-medium uppercase tracking-wider transition-all duration-300`}
              style={{
                background: activeTab === tab.id ? 'rgba(201, 169, 110, 0.12)' : 'transparent',
                color: activeTab === tab.id ? '#C9A96E' : 'rgba(250, 248, 245, 0.65)',
                borderLeft: activeTab === tab.id ? '2px solid #C9A96E' : '2px solid transparent',
              }}
            >
              {tab.label}
            </button>
          ))}
        </aside>

        {/* Dynamic Content Panel */}
        <main className="flex-1">
          
          {/* TAB 0: ANALYTICS */}
          {activeTab === 'analytics' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-light text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Site Performance & Analytics
                  </h2>
                  <p className="text-xs text-white/50 mt-1">Real-time audience metrics and product engagement</p>
                </div>
                <button
                  onClick={fetchAnalytics}
                  disabled={analyticsLoading}
                  className="px-4 py-2 border border-[#C9A96E]/20 text-[#C9A96E] hover:bg-[#C9A96E]/10 transition-colors text-xs font-semibold uppercase tracking-wider disabled:opacity-50 flex items-center gap-2"
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    className={analyticsLoading ? "animate-spin" : ""}
                  >
                    <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
                  </svg>
                  {analyticsLoading ? "Refreshing..." : "Refresh"}
                </button>
              </div>

              {analyticsLoading ? (
                <div className="text-center py-20">
                  <div className="inline-block w-8 h-8 border-2 border-[#C9A96E] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    
                    {/* Stat Card: Online Users */}
                    <div className="p-6 bg-white/5 border border-white/5 rounded-lg relative overflow-hidden group hover:border-[#C9A96E]/30 transition-all duration-300">
                      <div className="absolute top-4 right-4 flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#27AE60] animate-ping absolute" />
                        <span className="w-2.5 h-2.5 rounded-full bg-[#27AE60]" />
                      </div>
                      <span className="text-xs uppercase tracking-wider text-white/40 block">Online Now</span>
                      <span className="text-3xl font-light text-white block mt-2 font-mono">{analytics.online}</span>
                      <span className="text-[10px] text-white/30 mt-1 block">Active visitors on the site</span>
                    </div>

                    {/* Stat Card: Visitors Today */}
                    <div className="p-6 bg-white/5 border border-white/5 rounded-lg relative overflow-hidden group hover:border-[#C9A96E]/30 transition-all duration-300">
                      <span className="text-xs uppercase tracking-wider text-white/40 block">Unique Visitors (Today)</span>
                      <span className="text-3xl font-light text-[#C9A96E] block mt-2 font-mono">{analytics.today}</span>
                      <span className="text-[10px] text-white/30 mt-1 block">Distinct visitors since midnight</span>
                    </div>

                    {/* Stat Card: Visitors This Month */}
                    <div className="p-6 bg-white/5 border border-white/5 rounded-lg relative overflow-hidden group hover:border-[#C9A96E]/30 transition-all duration-300">
                      <span className="text-xs uppercase tracking-wider text-white/40 block">Unique Visitors (Month)</span>
                      <span className="text-3xl font-light text-white block mt-2 font-mono">{analytics.month}</span>
                      <span className="text-[10px] text-white/30 mt-1 block">Distinct visitors this calendar month</span>
                    </div>

                    {/* Stat Card: Total Page Views */}
                    <div className="p-6 bg-white/5 border border-white/5 rounded-lg relative overflow-hidden group hover:border-[#C9A96E]/30 transition-all duration-300">
                      <span className="text-xs uppercase tracking-wider text-white/40 block">Total Page Views</span>
                      <span className="text-3xl font-light text-white block mt-2 font-mono">{analytics.total}</span>
                      <span className="text-[10px] text-white/30 mt-1 block">All-time page hits tracked</span>
                    </div>

                  </div>

                  {/* Product Click Stats */}
                  <div className="p-6 bg-[#12100E] border border-white/5 rounded-lg">
                    <h3 className="text-base font-light text-white mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                      Most Clicked Products (المنتجات الأكثر اهتماماً)
                    </h3>

                    {analytics.clicks.length === 0 ? (
                      <p className="text-xs text-white/40 text-center py-6">No product interactions tracked yet.</p>
                    ) : (
                      <div className="space-y-4">
                        {analytics.clicks.map((item, idx) => {
                          const maxClicks = Math.max(...analytics.clicks.map(c => c.count)) || 1;
                          const pct = (item.count / maxClicks) * 100;
                          return (
                            <div key={idx} className="space-y-2">
                              <div className="flex justify-between items-center text-xs">
                                <span className="text-white/80 font-medium">{item.name}</span>
                                <span className="text-[#C9A96E] font-mono">{item.count} clicks</span>
                              </div>
                              <div className="h-2 w-full bg-white/5 rounded overflow-hidden">
                                <div
                                  className="h-full rounded transition-all duration-500"
                                  style={{
                                    width: `${pct}%`,
                                    background: 'linear-gradient(90deg, #C9A96E, #A07840)'
                                  }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Secondary Metrics Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Referrer breakdown */}
                    <div className="p-6 bg-[#12100E] border border-white/5 rounded-lg">
                      <h3 className="text-base font-light text-white mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                        Traffic Sources (مصادر الزيارات)
                      </h3>
                      {analytics.referrers.length === 0 ? (
                        <p className="text-xs text-white/40 text-center py-6">No referral data tracked yet.</p>
                      ) : (
                        <div className="space-y-4">
                          {analytics.referrers.map((item, idx) => {
                            const maxVal = Math.max(...analytics.referrers.map(r => r.count)) || 1;
                            const pct = (item.count / maxVal) * 100;
                            return (
                              <div key={idx} className="space-y-2">
                                <div className="flex justify-between items-center text-xs">
                                  <span className="text-white/80 font-medium">{item.name}</span>
                                  <span className="text-[#C9A96E] font-mono">{item.count} views</span>
                                </div>
                                <div className="h-1.5 w-full bg-white/5 rounded overflow-hidden">
                                  <div
                                    className="h-full rounded"
                                    style={{
                                      width: `${pct}%`,
                                      background: '#C9A96E'
                                    }}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Devices breakdown */}
                    <div className="p-6 bg-[#12100E] border border-white/5 rounded-lg">
                      <h3 className="text-base font-light text-white mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                        Devices (الأجهزة المستخدمة)
                      </h3>
                      {analytics.devices.length === 0 ? (
                        <p className="text-xs text-white/40 text-center py-6">No device data tracked yet.</p>
                      ) : (
                        <div className="space-y-4">
                          {analytics.devices.map((item, idx) => {
                            const totalDev = analytics.devices.reduce((acc, curr) => acc + curr.count, 0) || 1;
                            const pct = Math.round((item.count / totalDev) * 100);
                            return (
                              <div key={idx} className="space-y-2">
                                <div className="flex justify-between items-center text-xs">
                                  <span className="text-white/80 font-medium">{item.name}</span>
                                  <span className="text-[#C9A96E] font-mono">{pct}% ({item.count})</span>
                                </div>
                                <div className="h-1.5 w-full bg-white/5 rounded overflow-hidden">
                                  <div
                                    className="h-full rounded"
                                    style={{
                                      width: `${pct}%`,
                                      background: 'linear-gradient(90deg, #A07840, #C9A96E)'
                                    }}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Countries breakdown */}
                    <div className="p-6 bg-[#12100E] border border-white/5 rounded-lg">
                      <h3 className="text-base font-light text-white mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                        Top Countries (الدول الأكثر زيارة)
                      </h3>
                      {analytics.countries.length === 0 ? (
                        <p className="text-xs text-white/40 text-center py-6">No country data tracked yet.</p>
                      ) : (
                        <div className="space-y-4">
                          {analytics.countries.map((item, idx) => {
                            const maxVal = Math.max(...analytics.countries.map(c => c.count)) || 1;
                            const pct = (item.count / maxVal) * 100;
                            return (
                              <div key={idx} className="space-y-2">
                                <div className="flex justify-between items-center text-xs">
                                  <span className="text-white/80 font-medium">{item.name}</span>
                                  <span className="text-[#C9A96E] font-mono">{item.count} views</span>
                                </div>
                                <div className="h-1.5 w-full bg-white/5 rounded overflow-hidden">
                                  <div
                                    className="h-full rounded"
                                    style={{
                                      width: `${pct}%`,
                                      background: '#C9A96E'
                                    }}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 1: PRODUCTS */}
          {activeTab === 'products' && !editingProduct && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-light" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Products Catalog
                  </h2>
                  <p className="text-xs text-white/50 mt-1">Manage showroom collections and item details</p>
                </div>
                <button
                  onClick={() => setEditingProduct({
                    name: '',
                    category: 'dining',
                    price: '',
                    badge: '',
                    featured: false,
                    sort_order: 0,
                    folder_path: '',
                    components: '',
                    materials: '',
                    dimensions: '',
                  })}
                  className="px-5 py-2.5 text-xs font-semibold tracking-wider uppercase transition-all duration-300 hover:brightness-110"
                  style={{ background: 'linear-gradient(135deg, #C9A96E, #A07840)', color: 'white' }}
                >
                  + Add Product
                </button>
              </div>

              {productsLoading ? (
                <div className="text-center py-20">
                  <div className="inline-block w-8 h-8 border-2 border-[#C9A96E] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-20 border border-dashed border-white/10 rounded">
                  <p className="text-sm text-white/40">No products found. Start by adding one!</p>
                </div>
              ) : (
                <div className="overflow-x-auto border border-white/5 rounded bg-[#12100E]">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 text-xs text-white/40 uppercase tracking-widest bg-white/[0.02]">
                        <th className="py-4 px-6">Name</th>
                        <th className="py-4 px-6">Category</th>
                        <th className="py-4 px-6">Price</th>
                        <th className="py-4 px-6">Sort Order</th>
                        <th className="py-4 px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-sm text-white/80">
                      {products.map((prod) => (
                        <tr key={prod.id} className="hover:bg-white/[0.01] transition-colors">
                          <td className="py-4 px-6 font-medium text-white">{prod.name}</td>
                          <td className="py-4 px-6">
                            <span className="px-2.5 py-1 text-[10px] tracking-wider uppercase bg-white/5 rounded text-gold border border-white/5">
                              {prod.category}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            {prod.price ? `${prod.price.toLocaleString('en-EG')} EGP` : 'Call for price'}
                          </td>
                          <td className="py-4 px-6">{prod.sort_order}</td>
                          <td className="py-4 px-6 text-right space-x-2">
                            <button
                              onClick={() => setEditingProduct(prod)}
                              className="px-3 py-1 bg-white/5 border border-white/10 text-xs hover:bg-white/10 transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(prod.id)}
                              className="px-3 py-1 bg-red-950/40 border border-red-900/30 text-xs text-red-400 hover:bg-red-950/80 transition-colors"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* PRODUCT FORM (Add / Edit) */}
          {activeTab === 'products' && editingProduct && (
            <div className="space-y-8 bg-[#12100E] p-6 md:p-8 border border-white/5 rounded">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h3 className="text-lg font-light text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {editingProduct.id ? 'Edit Product' : 'Add New Product'}
                </h3>
                <button
                  onClick={() => setEditingProduct(null)}
                  className="text-xs text-white/50 hover:text-white"
                >
                  Cancel / إلغاء
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Name */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs uppercase tracking-wider text-white/60">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="px-4 py-3 rounded bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#C9A96E]"
                    placeholder="e.g. Classic Luxury Bedroom"
                  />
                </div>

                {/* Category */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs uppercase tracking-wider text-white/60">Category *</label>
                  <select
                    value={editingProduct.category || 'dining'}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    className="px-4 py-3 rounded bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#C9A96E]"
                  >
                    {CATEGORIES.filter(c => c.id !== 'all').map(c => (
                      <option key={c.id} value={c.id} className="bg-[#1C1A17]">{c.label}</option>
                    ))}
                  </select>
                </div>

                {/* Price */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs uppercase tracking-wider text-white/60">Price (EGP) (Leave blank for 'Call for price')</label>
                  <input
                    type="number"
                    value={editingProduct.price || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                    className="px-4 py-3 rounded bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#C9A96E]"
                    placeholder="e.g. 75000"
                  />
                </div>

                {/* Badge */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs uppercase tracking-wider text-white/60">Badge (None / custom label)</label>
                  <select
                    value={editingProduct.badge || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, badge: e.target.value })}
                    className="px-4 py-3 rounded bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#C9A96E]"
                  >
                    <option value="" className="bg-[#1C1A17]">No Badge / بدون بادج</option>
                    {BADGES.map(b => (
                      <option key={b} value={b} className="bg-[#1C1A17]">{b}</option>
                    ))}
                  </select>
                </div>

                {/* Sort Order */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs uppercase tracking-wider text-white/60">Sort Order (الأولوية في الترتيب - رقم)</label>
                  <input
                    type="number"
                    value={editingProduct.sort_order || 0}
                    onChange={(e) => setEditingProduct({ ...editingProduct, sort_order: e.target.value })}
                    className="px-4 py-3 rounded bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#C9A96E]"
                    placeholder="e.g. 0"
                  />
                </div>

                {/* Folder Path */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs uppercase tracking-wider text-white/60">Folder Path in Storage (اسم المجلد للصور) *</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.folder_path || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, folder_path: e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, '-') })}
                    className="px-4 py-3 rounded bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#C9A96E]"
                    placeholder="e.g. sofa-classic"
                  />
                  <p className="text-[10px] text-white/40">Use lowercase and dashes only (example: dining-elite)</p>
                </div>

                {/* Featured checkbox */}
                <div className="md:col-span-2 flex items-center gap-3 py-2">
                  <input
                    type="checkbox"
                    id="prod-featured"
                    checked={editingProduct.featured || false}
                    onChange={(e) => setEditingProduct({ ...editingProduct, featured: e.target.checked })}
                    className="w-4 h-4 rounded bg-white/5 border border-white/10 text-[#C9A96E] focus:ring-0"
                  />
                  <label htmlFor="prod-featured" className="text-xs uppercase tracking-wider text-white/80 cursor-pointer">
                    Show in Hero / Highlighted on Landing Page
                  </label>
                </div>

                {/* Components */}
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="text-xs uppercase tracking-wider text-white/60">Components (مكونات القطعة - سطر لكل عنصر)</label>
                  <textarea
                    rows="3"
                    value={editingProduct.components || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, components: e.target.value })}
                    className="px-4 py-3 rounded bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#C9A96E]"
                    placeholder="e.g. دولاب 240 سم&#10;سرير 160 سم&#10;2 كومودينو"
                  />
                </div>

                {/* Materials */}
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="text-xs uppercase tracking-wider text-white/60">Materials & Details (الخامات والمواصفات)</label>
                  <textarea
                    rows="3"
                    value={editingProduct.materials || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, materials: e.target.value })}
                    className="px-4 py-3 rounded bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#C9A96E]"
                    placeholder="e.g. خشب زان أحمر روماني طبيعي&#10;دهان أستر قشرة جوز طبيعي"
                  />
                </div>

                {/* Dimensions */}
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="text-xs uppercase tracking-wider text-white/60">Dimensions (المقاسات والتفاصيل المقاسية)</label>
                  <textarea
                    rows="3"
                    value={editingProduct.dimensions || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, dimensions: e.target.value })}
                    className="px-4 py-3 rounded bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#C9A96E]"
                    placeholder="e.g. سرير: 160 × 200 سم&#10;دولاب: 240 × 220 × 65 سم"
                  />
                </div>

                {/* Submit button */}
                <div className="md:col-span-2 flex justify-end gap-3 border-t border-white/10 pt-4">
                  <button
                    type="button"
                    onClick={() => setEditingProduct(null)}
                    className="px-5 py-3 border border-white/10 text-xs uppercase tracking-wider hover:bg-white/5 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="px-6 py-3 text-xs font-semibold tracking-wider uppercase transition-all duration-300 hover:brightness-110 disabled:opacity-50"
                    style={{ background: 'linear-gradient(135deg, #C9A96E, #A07840)', color: 'white' }}
                  >
                    {actionLoading ? 'Saving...' : 'Save Product'}
                  </button>
                </div>
              </form>

              {/* IMAGE MANAGER PANEL FOR ACTIVE PRODUCT */}
              {editingProduct.id && (
                <div className="border-t border-white/10 pt-8 mt-8 space-y-6">
                  <div>
                    <h4 className="text-base font-light text-[#C9A96E]" style={{ fontFamily: "'Playfair Display', serif" }}>
                      📸 Product Images Manager (معرض الصور)
                    </h4>
                    <p className="text-xs text-white/40 mt-1">Upload or delete images for folder: "{editingProduct.folder_path}"</p>
                  </div>

                  {imagesLoading ? (
                    <div className="text-center py-8">
                      <div className="inline-block w-6 h-6 border border-[#C9A96E] border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : folderImages.length === 0 ? (
                    <div className="text-center py-8 border border-dashed border-white/10 rounded">
                      <p className="text-xs text-white/40">No images inside this folder yet. Drag & drop files below.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
                      {folderImages.map((img) => (
                        <div key={img.name} className="relative group rounded border border-white/5 overflow-hidden bg-white/5 aspect-square">
                          <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                            <span className="text-[9px] text-white/80 truncate block">{img.name}</span>
                            <button
                              onClick={() => handleImageDelete(img.name)}
                              disabled={actionLoading}
                              className="w-full py-1 bg-red-600 text-white text-[10px] uppercase font-bold hover:bg-red-700 transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Upload box */}
                  <div className="p-6 border border-dashed border-white/10 rounded bg-white/[0.01] flex flex-col items-center justify-center gap-3">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C9A96E" strokeWidth="1.5" className="animate-bounce">
                      <path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <div className="text-center">
                      <span className="text-xs text-white/80 block">Select files to upload to this product</span>
                      <span className="text-[10px] text-white/40 block mt-1">Recommended naming: cover.jpg, 1.jpg, 2.jpg...</span>
                    </div>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={actionLoading}
                      className="text-xs text-white/60 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-[#C9A96E]/20 file:text-gold file:cursor-pointer hover:file:bg-[#C9A96E]/30"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: TESTIMONIALS */}
          {activeTab === 'testimonials' && !editingTestimonial && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-light" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Client Testimonials
                  </h2>
                  <p className="text-xs text-white/50 mt-1">Manage public reviews and sort order</p>
                </div>
                <button
                  onClick={() => setEditingTestimonial({
                    name: '',
                    role: 'Client',
                    text: '',
                    rating: 5,
                    initials: '',
                    sort_order: 0
                  })}
                  className="px-5 py-2.5 text-xs font-semibold tracking-wider uppercase transition-all duration-300 hover:brightness-110"
                  style={{ background: 'linear-gradient(135deg, #C9A96E, #A07840)', color: 'white' }}
                >
                  + Add Testimonial
                </button>
              </div>

              {testimonialsLoading ? (
                <div className="text-center py-20">
                  <div className="inline-block w-8 h-8 border-2 border-[#C9A96E] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : testimonials.length === 0 ? (
                <div className="text-center py-20 border border-dashed border-white/10 rounded">
                  <p className="text-sm text-white/40">No reviews found. Add a client review!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {testimonials.map((test) => (
                    <div 
                      key={test.id} 
                      className="p-5 rounded border border-white/5 bg-[#12100E] flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-white/10 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gold to-[#A07840] flex items-center justify-center text-sm font-semibold">
                          {test.initials || (test.name ? test.name.substring(0, 2) : 'CL')}
                        </div>
                        <div>
                          <h4 className="font-semibold text-white text-sm">{test.name}</h4>
                          <p className="text-xs text-white/50 mt-0.5">{test.role} · Rating: {'★'.repeat(test.rating)}</p>
                          <p className="text-xs text-white/70 mt-2 italic max-w-2xl line-clamp-2" dir="rtl">"{test.text}"</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 self-end md:self-auto flex-shrink-0">
                        <button
                          onClick={() => setEditingTestimonial(test)}
                          className="px-3 py-1.5 bg-white/5 border border-white/10 text-xs hover:bg-white/10 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteTestimonial(test.id)}
                          className="px-3 py-1.5 bg-red-950/40 border border-red-900/30 text-xs text-red-400 hover:bg-red-950/80 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TESTIMONIAL FORM (Add / Edit) */}
          {activeTab === 'testimonials' && editingTestimonial && (
            <div className="space-y-8 bg-[#12100E] p-6 md:p-8 border border-white/5 rounded">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h3 className="text-lg font-light text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {editingTestimonial.id ? 'Edit Testimonial' : 'Add New Testimonial'}
                </h3>
                <button
                  onClick={() => setEditingTestimonial(null)}
                  className="text-xs text-white/50 hover:text-white"
                >
                  Cancel / إلغاء
                </button>
              </div>

              <form onSubmit={handleSaveTestimonial} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Author Name */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs uppercase tracking-wider text-white/60">Client Name *</label>
                  <input
                    type="text"
                    required
                    value={editingTestimonial.name || ''}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, name: e.target.value })}
                    className="px-4 py-3 rounded bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#C9A96E]"
                    placeholder="e.g. أحمد علي"
                  />
                </div>

                {/* Role */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs uppercase tracking-wider text-white/60">Role / Location</label>
                  <input
                    type="text"
                    value={editingTestimonial.role || ''}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, role: e.target.value })}
                    className="px-4 py-3 rounded bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#C9A96E]"
                    placeholder="e.g. عميل بالتجمع الخامس"
                  />
                </div>

                {/* Rating */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs uppercase tracking-wider text-white/60">Rating (1 to 5 Stars)</label>
                  <select
                    value={editingTestimonial.rating || 5}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, rating: e.target.value })}
                    className="px-4 py-3 rounded bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#C9A96E]"
                  >
                    {[5, 4, 3, 2, 1].map(n => (
                      <option key={n} value={n} className="bg-[#1C1A17]">{'★'.repeat(n)}</option>
                    ))}
                  </select>
                </div>

                {/* Initials */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs uppercase tracking-wider text-white/60">Initials (2 letters - optional)</label>
                  <input
                    type="text"
                    maxLength="2"
                    value={editingTestimonial.initials || ''}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, initials: e.target.value.toUpperCase() })}
                    className="px-4 py-3 rounded bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#C9A96E]"
                    placeholder="e.g. AA"
                  />
                </div>

                {/* Sort Order */}
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="text-xs uppercase tracking-wider text-white/60">Sort Order (ترتيب التقييم)</label>
                  <input
                    type="number"
                    value={editingTestimonial.sort_order || 0}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, sort_order: e.target.value })}
                    className="px-4 py-3 rounded bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#C9A96E]"
                    placeholder="e.g. 0"
                  />
                </div>

                {/* Review Text */}
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="text-xs uppercase tracking-wider text-white/60">Review Text (نص التقييم) *</label>
                  <textarea
                    rows="4"
                    required
                    value={editingTestimonial.text || ''}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, text: e.target.value })}
                    className="px-4 py-3 rounded bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#C9A96E] text-right"
                    placeholder="اكتب التقييم هنا..."
                    dir="rtl"
                  />
                </div>

                {/* Submit button */}
                <div className="md:col-span-2 flex justify-end gap-3 border-t border-white/10 pt-4">
                  <button
                    type="button"
                    onClick={() => setEditingTestimonial(null)}
                    className="px-5 py-3 border border-white/10 text-xs uppercase tracking-wider hover:bg-white/5 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="px-6 py-3 text-xs font-semibold tracking-wider uppercase transition-all duration-300 hover:brightness-110 disabled:opacity-50"
                    style={{ background: 'linear-gradient(135deg, #C9A96E, #A07840)', color: 'white' }}
                  >
                    {actionLoading ? 'Saving...' : 'Save Testimonial'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 3: SALE BANNER SETTINGS */}
          {activeTab === 'banner' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-light" style={{ fontFamily: "'Playfair Display', serif" }}>
                  📢 Sale Banner Configuration
                </h2>
                <p className="text-xs text-white/50 mt-1">Edit the promo banner at the very top of the page</p>
              </div>

              {bannerLoading ? (
                <div className="text-center py-20">
                  <div className="inline-block w-8 h-8 border-2 border-[#C9A96E] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <form onSubmit={handleSaveBanner} className="space-y-6 bg-[#12100E] p-6 md:p-8 border border-white/5 rounded">
                  
                  {/* Enable Switch */}
                  <div className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded">
                    <div>
                      <span className="text-sm font-semibold block">Enable Announcement Banner</span>
                      <span className="text-xs text-white/40 block mt-0.5">Show or hide the banner globally</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={bannerSettings.enabled}
                      onChange={(e) => setBannerSettings({ ...bannerSettings, enabled: e.target.checked })}
                      className="w-10 h-6 bg-white/10 rounded-full text-gold focus:ring-0 cursor-pointer"
                    />
                  </div>

                  {/* Discount label */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs uppercase tracking-wider text-white/60">Discount Tag (e.g. 30%)</label>
                    <input
                      type="text"
                      value={bannerSettings.discount || ''}
                      onChange={(e) => setBannerSettings({ ...bannerSettings, discount: e.target.value })}
                      className="px-4 py-3 rounded bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#C9A96E]"
                      placeholder="e.g. 30%"
                    />
                  </div>

                  {/* English Title */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs uppercase tracking-wider text-white/60">English Banner Title</label>
                    <input
                      type="text"
                      value={bannerSettings.title_en || ''}
                      onChange={(e) => setBannerSettings({ ...bannerSettings, title_en: e.target.value })}
                      className="px-4 py-3 rounded bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#C9A96E]"
                      placeholder="e.g. Special Offer: UP TO 30% OFF ON LUXURY COLLECTION"
                    />
                  </div>

                  {/* Arabic Title */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs uppercase tracking-wider text-white/60">Arabic Title (العنوان الرئيسي بالعربية)</label>
                    <input
                      type="text"
                      value={bannerSettings.title_ar || ''}
                      onChange={(e) => setBannerSettings({ ...bannerSettings, title_ar: e.target.value })}
                      className="px-4 py-3 rounded bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#C9A96E] text-right"
                      placeholder="e.g. عرض لفترة محدودة"
                      dir="rtl"
                    />
                  </div>

                  {/* Arabic Subtitle */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs uppercase tracking-wider text-white/60">Arabic Subtitle (العنوان الفرعي/تفاصيل الخصم بالعربية)</label>
                    <input
                      type="text"
                      value={bannerSettings.subtitle_ar || ''}
                      onChange={(e) => setBannerSettings({ ...bannerSettings, subtitle_ar: e.target.value })}
                      className="px-4 py-3 rounded bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#C9A96E] text-right"
                      placeholder="e.g. خصم 30% على جميع الغرف الفاخرة لفترة محدودة"
                      dir="rtl"
                    />
                  </div>

                  {/* Countdown end time */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs uppercase tracking-wider text-white/60">Countdown End Time (توقيت انتهاء العرض - لعداد التنازلي)</label>
                    <input
                      type="datetime-local"
                      value={bannerSettings.end_time || ''}
                      onChange={(e) => setBannerSettings({ ...bannerSettings, end_time: e.target.value })}
                      className="px-4 py-3 rounded bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#C9A96E]"
                    />
                    <p className="text-[10px] text-white/40">Leave empty to disable the countdown timer</p>
                  </div>

                  {/* Save button */}
                  <div className="flex justify-end border-t border-white/10 pt-4">
                    <button
                      type="submit"
                      disabled={actionLoading}
                      className="px-6 py-3 text-xs font-semibold tracking-wider uppercase transition-all duration-300 hover:brightness-110 disabled:opacity-50"
                      style={{ background: 'linear-gradient(135deg, #C9A96E, #A07840)', color: 'white' }}
                    >
                      {actionLoading ? 'Saving...' : 'Save Banner Settings'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
