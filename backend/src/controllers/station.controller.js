import { fetchStations } from "../services/google.service.js";
import { calcDistance } from "../utils/distance.js";

export const getNearby = async (req, res) => {
  const { lat, lng } = req.query;

  const data = await fetchStations(lat, lng);

  const result = data.map((s) => ({
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
  }));

  result.sort((a, b) => a.distance - b.distance);

  res.json(result);
};