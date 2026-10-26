/**
 * oponiarze.pl - Moduł Geodezyjny z zewnętrznym API Zippopotam.us (distance.js)
 */

// Pamięć podręczna, żeby nie pytać API dwa razy o ten sam kod pocztowy
const postalCache = {};

/**
 * Asynchronicznie pobiera dokładne współrzędne dla dowolnego kodu pocztowego w Polsce
 * Korzysta z darmowego API Zippopotam.us (obsługuje PL, wspiera CORS, brak wymogu klucza)
 */
async function getPostalLocation(postalCode) {
  let cleanCode = postalCode ? postalCode.trim() : "";
  
  // Jeśli wpisano 5 cyfr bez myślnika (np. 85809), sformatuj na 85-809
  if (/^\d{5}$/.test(cleanCode)) {
    cleanCode = cleanCode.slice(0, 2) + '-' + cleanCode.slice(2);
  }

  // Walidacja formatu kodu pocztowego (XX-XXX)
  if (!/^\d{2}-\d{3}$/.test(cleanCode)) {
    return null;
  }

  // Jeśli mamy już w pamięci podręcznej, zwracamy od razu
  if (postalCache[cleanCode]) {
    return postalCache[cleanCode];
  }

  try {
    // Zapytanie do darmowego API Zippopotam dla Polski
    const response = await fetch(`https://api.zippopotam.us/PL/${cleanCode}`);
    
    if (!response.ok) {
      throw new Error("Nie znaleziono kodu w bazie zewnętrznej");
    }

    const data = await response.json();

    if (data && data.places && data.places.length > 0) {
      const location = {
        lat: parseFloat(data.places[0].latitude),
        lng: parseFloat(data.places[0].longitude),
        cityName: data.places[0]["place name"]
      };
      
      // Zapisujemy do pamięci podręcznej
      postalCache[cleanCode] = location;
      return location;
    }
  } catch (error) {
    console.warn("Problem z zewnętrznym API, używam awaryjnego prefiksu:", error);
    
    // Awaryjny fallback na dwucyfrowy prefiks, gdyby sieć zawiodła
    const prefix2 = cleanCode.slice(0, 2);
    const fallbacks = {
      "85": { lat: 53.1235, lng: 18.0084 },
      "87": { lat: 53.0138, lng: 18.5984 },
      "00": { lat: 52.2297, lng: 21.0122 },
      "60": { lat: 52.4064, lng: 16.9252 },
      "50": { lat: 51.1100, lng: 17.0300 },
      "30": { lat: 50.0647, lng: 19.9450 }
    };
    if (fallbacks[prefix2]) return fallbacks[prefix2];
  }

  return null;
}

/**
 * Oblicza odległość w kilometrach między dwoma punktami na Ziemi (Wzór Haversine'a)
 */
function calcDistance(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 0;
  
  const R = 6371; // Średni promień Ziemi w km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round((R * c) * 10) / 10;
}
