import express, { Express } from "express";
import mongoose from "mongoose";
import cors from "cors";

import "dotenv/config";
import cardRoutes from "../routes/router"

const app: Express = express();
const PORT = process.env.PORT || 4000;

if (process.env.MONGODB_URL) {
  mongoose.connect(process.env.MONGODB_URL,{dbName: "Flashcards"});
} else {
  console.log("Please pass the URL to database");
}

const db = mongoose.connection;
db.on("error", (error: string) => console.log(error));
db.once("open", () => console.log("Connected to database"));

const corsOptions = {
  origin: process.env.ALLOWED_ORIGIN,
};

app.use(express.json());

app.use(cors(corsOptions));

app.use('/cards', cardRoutes);

app.listen(PORT, () => {
  console.log(`Your app listening at http://localhost:${PORT}`);
});
