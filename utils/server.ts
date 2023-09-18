import express, { Express } from "express";
import cors from "cors";
import { authMiddleware } from "../middlewares/authMiddleware";
import cardRoutes from "../routes/router";
import "dotenv/config";
import swaggerUi from 'swagger-ui-express';
import * as swaggerDocument from '../swaggerDocs.json';

export const app: Express = express();

const corsOptions = {
  origin: process.env.ALLOWED_ORIGIN,
};

app.use(express.json());
app.use(cors(corsOptions));
app.use("/cards", authMiddleware);
app.use("/cards", cardRoutes);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
