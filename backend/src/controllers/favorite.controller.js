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