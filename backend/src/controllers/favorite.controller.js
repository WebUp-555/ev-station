import Favorite from "../models/favorite.model.js";

export const addFavorite = async (req, res) => {
  const fav = await Favorite.create({
    userId: req.user.id,
    name: req.body.name,
    lat: req.body.lat,
    lng: req.body.lng,
  });

  res.json(fav);
};

export const getFavorites = async (req, res) => {
  const data = await Favorite.find({ userId: req.user.id });
  res.json(data);
};

export const removeFavorite = async (req, res) => {
  const { name, lat, lng } = req.body;

  const removed = await Favorite.findOneAndDelete({
    userId: req.user.id,
    name,
    lat,
    lng,
  });

  if (!removed) {
    return res.status(404).json({ msg: "Favorite not found" });
  }

  res.json(removed);
};