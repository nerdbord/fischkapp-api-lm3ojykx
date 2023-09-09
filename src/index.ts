import express, { Express } from "express";
import mongoose from "mongoose";
import "dotenv/config";

const app: Express = express();
const PORT = process.env.PORT || 4000;

if (process.env.MONGODB_URL) {
  mongoose.connect(process.env.MONGODB_URL);
} else {
  console.log("Please pass the URL to database");
}

const db = mongoose.connection;
db.on("error", (error: string) => console.log(error));
db.once("open", () => console.log("Connected to database"));

app.listen(PORT, () => {
  console.log(`Your app listening at http://localhost:${PORT}`);
});
