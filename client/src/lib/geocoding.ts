interface GeocodeResult {
  lat: number;
  lng: number;
}

export async function geocodeAddress(address: string): Promise<GeocodeResult | null> {
  try {
    // Clean up the address for better geocoding
    const cleanAddress = address.replace(/C\.P\.\s*\d+/g, '').trim();
    
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cleanAddress + ", Alicante, Spain")}&limit=1&countrycodes=es`
    );
    
    const data = await response.json();
    
    if (data && data.length > 0) {
      const result = {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon)
      };
      console.log(`Geocoded "${address}":`, result);
      return result;
    }
    
    console.log(`No geocoding result for "${address}"`);
    return null;
  } catch (error) {
    console.error('Geocoding error for', address, ':', error);
    return null;
  }
}

export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
