import express from "express";
import {
  addFavorite,
  getFavorites,
} from "../controllers/favorite.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", protect, addFavorite);
router.get("/", protect, getFavorites);

export default router;