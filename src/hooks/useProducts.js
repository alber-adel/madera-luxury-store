import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { sortProductImages } from '../data/productData';

const BUCKET = 'products-images';
const STORAGE_BASE = `https://zahhrknatspivrpsovuj.supabase.co/storage/v1/object/public/${BUCKET}`;

/**
 * Given a folder_path like "sofa-classic", lists all files inside it
 * and returns their full public URLs.
 */
async function getFolderImages(folderPath) {
  if (!folderPath) {
    console.warn('[Images] folder_path is empty or null — skipping');
    return [];
  }
  console.log(`[Images] Listing folder: "${folderPath}"`);
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .list(folderPath, { sortBy: { column: 'name', order: 'asc' } });

  if (error) {
    console.error(`[Images] Storage error for "${folderPath}":`, error.message);
    return [];
  }
  if (!data || data.length === 0) {
    console.warn(`[Images] No files found in folder: "${folderPath}"`);
    return [];
  }

  const validFiles = data.filter((f) => f.name && !f.name.startsWith('.'));
  const urls = validFiles.map((f) => {
    const cacheBust = f.updated_at ? new Date(f.updated_at).getTime() : (f.created_at ? new Date(f.created_at).getTime() : '');
    return `${STORAGE_BASE}/${folderPath}/${f.name}${cacheBust ? `?t=${cacheBust}` : ''}`;
  });
  const sortedUrls = sortProductImages(urls);

  console.log(`[Images] Found ${sortedUrls.length} image(s) for "${folderPath}":`, sortedUrls);
  return sortedUrls;
}

/**
 * useProducts — fetches all products from Supabase in real-time.
 * Returns { products, loading, error, refetch }
 */
export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function fetchProducts() {
    try {
      setLoading(true);
      setError(null);

      const { data, error: sbError } = await supabase
        .from('products')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (sbError) throw sbError;
      console.log('[useProducts] Supabase products response:', data);

      // Enrich each product with its images from Storage
      const enriched = await Promise.all(
        (data ?? []).map(async (product) => {
          const images = await getFolderImages(product.folder_path);
          return { ...product, images };
        })
      );

      setProducts(enriched);
    } catch (err) {
      console.error('Supabase fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();

    // Real-time listener: refresh whenever a product is added/updated/deleted
    const channel = supabase
      .channel('products-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => {
        fetchProducts();
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  return { products, loading, error, refetch: fetchProducts };
}

export default useProducts;
