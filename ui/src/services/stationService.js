import { api } from "./api";

export const DEFAULT_LOCATION = {
  lat: 37.7749,
  lng: -122.4194,
};

const CONNECTORS = ["CCS", "CCS / CHAdeMO", "Type 2", "Tesla / NACS", "CCS / Type 2"];

const hashString = (value) => {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index);
    hash |= 0;
  }

  return Math.abs(hash);
};

const roundTo = (value, digits = 1) => Number(value.toFixed(digits));

const deriveOperator = (name = "") => {
  const separator = name.includes("—") ? "—" : name.includes("-") ? "-" : null;

  if (!separator) {
    return name.split(" ")[0] || "Nearby";
  }

  return name.split(separator)[0].trim() || "Nearby";
};

const deriveAvailability = (station, index, hash) => {
  if (station.open_now === true) return "available";
  if (station.open_now === false) return "busy";
  if (station.business_status === "CLOSED_TEMPORARILY") return "offline";

  return ["available", "busy", "available", "offline"][(hash + index) % 4];
};

const derivePin = (hash, index) => ({
  x: 16 + ((hash + index * 17) % 68),
  y: 18 + (((hash >> 3) + index * 11) % 62),
});

const getDistanceKm = (station, origin) => {
  const lat1 = (origin.lat * Math.PI) / 180;
  const lat2 = ((station.lat ?? origin.lat) * Math.PI) / 180;
  const deltaLat = lat2 - lat1;
  const deltaLng = (((station.lng ?? origin.lng) - origin.lng) * Math.PI) / 180;
  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);
  const distance = 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return roundTo(distance, 1);
};

export const resolveUserLocation = () =>
  new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(DEFAULT_LOCATION);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      () => resolve(DEFAULT_LOCATION),
      { enableHighAccuracy: false, maximumAge: 600000, timeout: 5000 }
    );
  });

export const normalizeStation = (station, index = 0, origin = DEFAULT_LOCATION) => {
  const id = station.id || station.place_id || `${station.name}-${station.lat}-${station.lng}`;
  const hash = hashString(id);
  const distance_km = roundTo(getDistanceKm(station, origin), 1);
  const availability = deriveAvailability(station, index, hash);
  const total_ports = station.total_ports ?? (availability === "available" ? 4 + (hash % 3) : 2 + (hash % 2));
  const available_ports =
    station.available_ports ?? (availability === "available" ? Math.max(1, total_ports - (hash % 2)) : 0);

  return {
    id,
    name: station.name,
    operator: station.operator || deriveOperator(station.name),
    address: station.address || station.vicinity || "",
    distance_km,
    availability,
    available_ports,
    total_ports,
    speed_kw: station.speed_kw ?? [22, 50, 75, 100, 150, 250, 350][hash % 7],
    connector: station.connector ?? CONNECTORS[hash % CONNECTORS.length],
    price_per_kwh: station.price_per_kwh ?? roundTo(0.28 + (hash % 18) * 0.01, 2),
    last_updated_min: station.last_updated_min ?? 1 + (hash % 24),
    coords: {
      lat: station.lat ?? origin.lat,
      lng: station.lng ?? origin.lng,
    },
    rating: station.rating != null ? roundTo(Number(station.rating), 1) : roundTo(4 + ((hash % 9) / 10), 1),
    reviews: station.reviews ?? station.user_ratings_total ?? 50 + (hash % 950),
    pin: station.pin ?? derivePin(hash, index),
  };
};

export const getNearbyStations = async () => {
  const origin = await resolveUserLocation();
  const stations = await api.stations.nearby(origin.lat, origin.lng);

  return stations.map((station, index) => normalizeStation(station, index, origin));
};

export const getStationById = async (stationId) => {
  const stations = await getNearbyStations();
  return stations.find((station) => station.id === stationId) || null;
};




export const geocodePlace = async (query) => {
  if (!query) return null;

  try {
    return await api.stations.geocode(query);
  } catch (err) {
    console.error('[geocodePlace] Error:', err);
    return null;
  }
};

export const searchStationsByPlace = async (placeQuery) => {
  console.log('[searchStationsByPlace] Starting search for:', placeQuery);
  const coords = await geocodePlace(placeQuery);
  if (!coords) {
    console.warn('[searchStationsByPlace] Geocoding failed for:', placeQuery);
    return [];
  }

  console.log('[searchStationsByPlace] Got coords, fetching nearby stations:', coords);
  try {
    const userLocation = await resolveUserLocation();
    const stations = await api.stations.nearby(coords.lat, coords.lng);
    console.log('[searchStationsByPlace] Got stations:', stations);
    const normalized = stations.map((station, index) =>
      normalizeStation(station, index, userLocation)
    );
    console.log('[searchStationsByPlace] Normalized stations:', normalized);
    return normalized;
  } catch (err) {
    console.error('[searchStationsByPlace] Error fetching nearby stations:', err);
    return [];
  }
};

export const searchStationsByCoords = async (lat, lng) => {
  if (lat == null || lng == null) return [];

  try {
    const userLocation = await resolveUserLocation();
    const stations = await api.stations.nearby(lat, lng);
    return stations.map((station, index) =>
      normalizeStation(station, index, userLocation)
    );
  } catch (err) {
    console.error('[searchStationsByCoords] Error fetching nearby stations:', err);
    return [];
  }
};