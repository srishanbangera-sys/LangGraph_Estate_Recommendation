/**
 * Conversational Filter Extractor
 * 
 * Analyzes conversational turns (both user queries and agent replies)
 * to automatically extract structured real estate search parameters:
 * - BHK / Bedrooms count (e.g. 1 BHK, 2 BHK, 3 BHK, 4 BHK)
 * - Location / City / Neighborhood (e.g. Mangalore, Metroville, Cyberwood, Kadri, Bejai, London)
 * - Property Type (e.g. Apartment, Villa, Independent House, Penthouse)
 * - Listing Type (e.g. Rent, Sale / Buy)
 * - Maximum Budget (e.g. under 50000, under 1.5 Cr)
 */

export function extractParametersFromConversation(userText = '', agentText = '') {
  const combinedText = `${userText} ${agentText}`.toLowerCase();
  const extracted = {};

  // 1. BHK / Bedrooms extraction
  const bhkMatch = combinedText.match(/\b([1-5])\s*(?:bhk|bed|bedroom|beds|bedrooms)\b/i);
  if (bhkMatch) {
    extracted.bhk = parseInt(bhkMatch[1], 10);
  }

  // 2. Location / Area extraction
  const knownLocations = [
    'mangalore', 'metroville', 'cyberwood', 'kadri', 'bejai', 
    'urwa', 'falnir', 'surathkal', 'kankanady', 'mannagudda',
    'london', 'manchester', 'edinburgh', 'innovation hub', 'downtown'
  ];
  for (const loc of knownLocations) {
    if (combinedText.includes(loc)) {
      // Capitalize
      extracted.location = loc.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      break;
    }
  }

  // 3. Property Type extraction
  if (combinedText.includes('villa')) {
    extracted.propertyType = 'Villa';
  } else if (combinedText.includes('apartment') || combinedText.includes('flat')) {
    extracted.propertyType = 'Apartment';
  } else if (combinedText.includes('independent house') || combinedText.includes('house')) {
    extracted.propertyType = 'Independent House';
  } else if (combinedText.includes('penthouse')) {
    extracted.propertyType = 'Penthouse';
  }

  // 4. Listing Type (Rent vs Sale)
  if (combinedText.includes('rent') || combinedText.includes('/mo') || combinedText.includes('monthly') || combinedText.includes('lease')) {
    extracted.listingType = 'Rent';
  } else if (combinedText.includes('sale') || combinedText.includes('buy') || combinedText.includes('purchase')) {
    extracted.listingType = 'Sale';
  }

  // 5. Budget extraction
  const crMatch = combinedText.match(/(?:under|below|max|within|budget of)?\s*(?:₹|rs\.?|inr)?\s*([0-9]+(?:\.[0-9]+)?)\s*(?:cr|crore|crores)\b/i);
  if (crMatch) {
    extracted.maxBudget = parseFloat(crMatch[1]) * 10000000;
  } else {
    const lakhMatch = combinedText.match(/(?:under|below|max|within)?\s*(?:₹|rs\.?|inr)?\s*([0-9]+(?:\.[0-9]+)?)\s*(?:lakh|lakhs|lac|lacs|k)\b/i);
    if (lakhMatch) {
      const val = parseFloat(lakhMatch[1]);
      if (lakhMatch[0].toLowerCase().endsWith('k')) {
        extracted.maxBudget = val * 1000;
      } else {
        extracted.maxBudget = val * 100000;
      }
    } else {
      const numMatch = combinedText.match(/(?:under|below|max of|less than)\s*(?:₹|rs\.?|inr|\$|£)?\s*([0-9]{4,9})\b/i);
      if (numMatch) {
        extracted.maxBudget = parseInt(numMatch[1], 10);
      }
    }
  }

  return extracted;
}

/**
 * Evaluates whether a property listing satisfies current active filters.
 */
export function filterProperty(property, filters) {
  if (!filters) return true;

  // Filter by BHK
  if (filters.bhk && property.beds !== filters.bhk) {
    return false;
  }

  // Filter by Location
  if (filters.location) {
    const locLower = filters.location.toLowerCase();
    const propLoc = `${property.location || ''} ${property.category || ''} ${property.country || ''}`.toLowerCase();
    if (!propLoc.includes(locLower)) {
      return false;
    }
  }

  // Filter by Property Type
  if (filters.propertyType) {
    const typeLower = filters.propertyType.toLowerCase();
    const propType = (property.type || '').toLowerCase();
    if (!propType.includes(typeLower)) {
      return false;
    }
  }

  // Filter by Listing Type
  if (filters.listingType) {
    const listTypeLower = filters.listingType.toLowerCase();
    const propListType = (property.listingType || property.status || '').toLowerCase();
    const isRental = property.price < 500000 || propListType.includes('rent');
    if (listTypeLower === 'rent' && !isRental) return false;
    if (listTypeLower === 'sale' && isRental) return false;
  }

  // Filter by Max Budget
  if (filters.maxBudget && property.price) {
    if (property.price > filters.maxBudget) {
      return false;
    }
  }

  return true;
}
