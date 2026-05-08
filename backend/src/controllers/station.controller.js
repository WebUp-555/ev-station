import { fetchStations, geocodeAddress } from "../services/google.service.js";
import { calcDistance } from "../utils/distance.js";

export const getNearby = async (req, res) => {
  const { lat, lng } = req.query;

  const data = await fetchStations(lat, lng);

  const result = data.map((s) => ({
    id: s.place_id,
    name: s.name,
    address: s.vicinity,
    lat: s.geometry.location.lat,
    lng: s.geometry.location.lng,
    distance: calcDistance(
      lat,
      lng,
      s.geometry.location.lat,
      s.geometry.location.lng
    ),
    rating: s.rating ?? null,
    reviews: s.user_ratings_total ?? 0,
    open_now: s.opening_hours?.open_now ?? null,
    business_status: s.business_status ?? null,
    types: s.types ?? [],
  }));

  result.sort((a, b) => a.distance - b.distance);

  res.json(result);
};

export const geocodePlace = async (req, res) => {
  const query = String(req.query.q || "").trim();

  if (!query) {
    return res.status(400).json({ message: "Query parameter q is required" });
  }

  const coords = await geocodeAddress(query);

  if (!coords) {
    return res.json(null);
  }

  return res.json(coords);
};