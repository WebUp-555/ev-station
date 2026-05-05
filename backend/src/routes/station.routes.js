import express from "express";
import { getNearby } from "../controllers/station.controller.js";

const router = express.Router();
router.get("/nearby", getNearby);

export default router;