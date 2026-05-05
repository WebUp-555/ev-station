import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import stationRoutes from "./routes/station.routes.js";
import favoriteRoutes from "./routes/favorite.routes.js";
import { limiter } from "./middlewares/rateLimit.middleware.js";
import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(limiter);

app.use("/api/auth", authRoutes);
app.use("/api/stations", stationRoutes);
app.use("/api/favorites", favoriteRoutes);

app.use(errorHandler);

export default app;