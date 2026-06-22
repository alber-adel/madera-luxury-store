import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { sortProductImages } from '../data/productData';

// We reuse the existing products-images bucket, but use a specific folder "deliveries"
const BUCKET = 'products-images';
const FOLDER = 'deliveries';
const STORAGE_BASE = `https://zahhrknatspivrpsovuj.supabase.co/storage/v1/object/public/${BUCKET}`;

export function useDeliveries() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchImages() {
    try {
      setLoading(true);
      // List all files in the "deliveries" folder
      const { data, error } = await supabase.storage
        .from(BUCKET)
        .list(FOLDER, { sortBy: { column: 'name', order: 'asc' } });

      if (error) {
        console.error('Error fetching deliveries images:', error);
        return;
      }

      // Filter out hidden files like .emptyFolderPlaceholder
      const validFiles = data?.filter(f => f.name && !f.name.startsWith('.')) || [];
      const rawUrls = validFiles.map(f => {
        const cacheBust = f.updated_at ? new Date(f.updated_at).getTime() : (f.created_at ? new Date(f.created_at).getTime() : '');
        return `${STORAGE_BASE}/${FOLDER}/${f.name}${cacheBust ? `?t=${cacheBust}` : ''}`;
      });
      const sortedUrls = sortProductImages(rawUrls);
      
      const imageUrls = sortedUrls.map(src => ({
        src,
        // We leave labels empty since the user doesn't need them
        label: '',
        arabic: '',
      }));

      if (imageUrls.length > 0) {
        setImages(imageUrls);
      }
    } catch (err) {
      console.error('Supabase fetch error:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchImages();
  }, []);

  return { images, loading };
}
