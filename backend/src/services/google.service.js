import axios from "axios";
import { env } from "../config/env.js";

export const fetchStations = async (lat, lng) => {
  const endpoint = "https://maps.googleapis.com/maps/api/place/nearbysearch/json";

  const queryVariants = [
    { radius: 50000, keyword: "EV charging station" },
    { radius: 50000, keyword: "electric vehicle charging station" },
    { radius: 50000, keyword: "charging station" },
    { radius: 50000, type: "electric_vehicle_charging_station" },
  ];

  for (const variant of queryVariants) {
    const res = await axios.get(endpoint, {
      params: {
        location: `${lat},${lng}`,
        key: env.GOOGLE_API_KEY,
        ...variant,
      },
    });

    const status = res.data?.status;
    const results = Array.isArray(res.data?.results) ? res.data.results : [];

    if (status !== "OK" && status !== "ZERO_RESULTS") {
      throw new Error(`Google Places nearbysearch failed: ${status || "UNKNOWN_ERROR"}`);
    }

    if (results.length > 0) {
      return results;
    }
  }

  return [];
};

export const geocodeAddress = async (query) => {
  if (!query) return null;

  const res = await axios.get(
    "https://maps.googleapis.com/maps/api/geocode/json",
    {
      params: {
        address: query,
        key: env.GOOGLE_API_KEY,
      },
    }
  );

  const status = res.data?.status;
  const first = res.data?.results?.[0];

  if (status !== "OK") {
    if (status === "ZERO_RESULTS") return null;
    throw new Error(`Google Geocoding failed: ${status || "UNKNOWN_ERROR"}`);
  }

  if (!first) return null;

  return {
    lat: first.geometry.location.lat,
    lng: first.geometry.location.lng,
    place_id: first.place_id,
    formatted: first.formatted_address,
  };
};