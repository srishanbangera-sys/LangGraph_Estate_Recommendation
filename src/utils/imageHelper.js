/**
 * Property Visual & Geographic Asset Helper
 * Ensures every property listing has high-resolution architectural imagery
 * and realistic coordinates centered in and around Mangalore, India or mapped regions.
 */

// Curated high-resolution modern architectural photography
export const LUXURY_PROPERTY_IMAGES = [
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=85'
];

// Mangalore, India coordinates & surrounding prime neighborhoods
export const MANGALORE_COORDINATES = {
  center: { lat: 12.9141, lng: 74.8560 },
  neighborhoods: [
    { name: 'Kadri', lat: 12.8850, lng: 74.8620 },
    { name: 'Bejai', lat: 12.8900, lng: 74.8450 },
    { name: 'Urwa', lat: 12.8980, lng: 74.8320 },
    { name: 'Falnir', lat: 12.8680, lng: 74.8490 },
    { name: 'Surathkal', lat: 13.0070, lng: 74.7950 },
    { name: 'Kankanady', lat: 12.8650, lng: 74.8580 },
    { name: 'Mannagudda', lat: 12.8830, lng: 74.8360 },
    { name: 'Derebail', lat: 12.9230, lng: 74.8490 }
  ]
};

/**
 * Returns a guaranteed valid image URL for any property.
 */
export function getPropertyImage(property, index = 0) {
  if (property && property.image && property.image.startsWith('http')) {
    return property.image;
  }
  const imgIdx = Math.abs((index || 0) % LUXURY_PROPERTY_IMAGES.length);
  return LUXURY_PROPERTY_IMAGES[imgIdx];
}

/**
 * Assigns or retrieves geographical coordinates for a property.
 * Centers in Mangalore, India if local, or distributes around the center.
 */
export function getPropertyCoordinates(property, index = 0) {
  if (property && property.lat && property.lng) {
    return { lat: Number(property.lat), lng: Number(property.lng) };
  }

  // Pick deterministic neighborhood offset based on property ID or index
  const safeIdx = Math.abs((index || 0) % MANGALORE_COORDINATES.neighborhoods.length);
  const baseLoc = MANGALORE_COORDINATES.neighborhoods[safeIdx];
  
  // Slight offset variation for natural visual dispersion
  const latOffset = ((safeIdx * 7) % 11 - 5) * 0.003;
  const lngOffset = ((safeIdx * 13) % 11 - 5) * 0.003;

  return {
    lat: Number((baseLoc.lat + latOffset).toFixed(5)),
    lng: Number((baseLoc.lng + lngOffset).toFixed(5)),
    area: baseLoc.name
  };
}
