import axios from "axios";
import { env } from "../config/env.js";

export const fetchStations = async (lat, lng) => {
  const res = await axios.get(
    "https://maps.googleapis.com/maps/api/place/nearbysearch/json",
    {
      params: {
        location: `${lat},${lng}`,
        radius: 5000,
        keyword: "EV charging station",
        key: env.GOOGLE_API_KEY,
      },
    }
  );

  return res.data.results;
};