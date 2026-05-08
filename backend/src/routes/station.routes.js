import express from "express";
import { geocodePlace, getNearby } from "../controllers/station.controller.js";

const router = express.Router();
router.get("/nearby", getNearby);
router.get("/geocode", geocodePlace);

export default router;