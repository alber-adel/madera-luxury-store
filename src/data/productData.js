/**
 * Madera Home — Categories & Utilities
 *
 * Products are managed via Supabase:
 *   https://supabase.com/dashboard/project/zahhrknatspivrpsovuj/editor
 */

export const CATEGORIES = [
  { id: 'all', label: 'All Collections' },
  { id: 'dining', label: 'Dining Rooms' },
  { id: 'bedroom', label: 'Bedrooms' },
  { id: 'children', label: 'Youth & Kids Rooms' },
  { id: 'l-shape', label: 'L-Shape' },
  { id: 'sofa-set', label: 'Sofa Sets' },
  { id: 'kitchen', label: 'Kitchens' },
  { id: 'dressing', label: 'Dressing Rooms' },
  { id: 'tables', label: 'Tables' },
  { id: 'deliveries', label: 'Deliveries' },
];

export const CATEGORY_LABELS = Object.fromEntries(
  CATEGORIES.filter(c => c.id !== 'all').map(c => [c.id, c.label])
);

/**
 * Safely sorts product image URLs/filenames.
 * - Prioritizes "cover" or "main" images to be first.
 * - Uses natural alphanumeric sorting for numbered filenames (e.g. 2.jpg before 10.jpg).
 */
export function sortProductImages(images) {
  if (!Array.isArray(images)) return [];
  return [...images].sort((a, b) => {
    const getFilename = (str) => {
      if (!str) return '';
      try {
        const urlObj = new URL(str);
        return decodeURIComponent(urlObj.pathname.split('/').pop()).toLowerCase();
      } catch (e) {
        const cleanStr = str.split('?')[0];
        return decodeURIComponent(cleanStr.split('/').pop()).toLowerCase();
      }
    };

    const nameA = getFilename(a);
    const nameB = getFilename(b);

    const aIsCover = nameA.includes('cover') || nameA.includes('main');
    const bIsCover = nameB.includes('cover') || nameB.includes('main');

    if (aIsCover && !bIsCover) return -1;
    if (!aIsCover && bIsCover) return 1;

    return nameA.localeCompare(nameB, undefined, { numeric: true, sensitivity: 'base' });
  });
}

/**
 * Returns the product images array, filtering out any empty values and sorting them correctly.
 */
export function getProductImages(product) {
  if (!product) return [];
  if (Array.isArray(product.images) && product.images.length > 0) {
    return sortProductImages(product.images.filter(Boolean));
  }
  return [];
}

/**
 * Format an integer EGP price into a readable string.
 * e.g. 45000 → "45,000 EGP"
 * Null / 0 → "اتصل للسعر"
 */
export function formatPrice(price) {
  if (!price && price !== 0) return 'اتصل للسعر';
  return Number(price).toLocaleString('en-EG') + ' EGP';
}

