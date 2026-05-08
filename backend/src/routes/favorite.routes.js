import express from "express";
import {
  addFavorite,
  getFavorites,
  removeFavorite,
} from "../controllers/favorite.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", protect, addFavorite);
router.get("/", protect, getFavorites);
router.delete("/", protect, removeFavorite);

export default router;