import express, { Express } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import cardRoutes from "../routes/router";

export const app: Express = express();

app.use(express.json());
app.use("/cards", authMiddleware);
app.use("/cards", cardRoutes);
