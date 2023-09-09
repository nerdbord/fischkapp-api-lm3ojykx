import express, { Express,Request, Response } from "express";
import mongoose from "mongoose";
import router from "../routes/router"
import "dotenv/config";

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

app.use(express.json());
app.use("/cards", router);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.listen(PORT, () => {
  console.log(`Your app listening at http://localhost:${PORT}`);
});
