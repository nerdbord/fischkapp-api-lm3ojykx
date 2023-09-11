import { Router } from "express";
import { Card } from "../models/card";
import { CreateCardPayload, UpdateCardPayload } from "../types/cardTypes";

const cardRoutes = Router();

cardRoutes.get("/", async (req, res) => {
  try {
    const cards = await Card.find().sort({ createdAt: -1 });
    res.status(200).send(cards);
  } catch (err) {
    res.status(500).send("An error occurred while fetching the cards.");
  }
});

cardRoutes.get("/author/:author", async (req, res) => {
  const author = req.params.author;
  try {
    const cards = await Card.find({ author }).sort({ createdAt: -1 });
    res.status(200).send(cards);
  } catch (err) {
    res
      .status(500)
      .send("An error occurred while fetching the cards for specified author.");
  }
});

cardRoutes.get("/tags/:tag", async (req, res) => {
  const tag = req.params.tag;
  try {
    const cards = await Card.find({ tags: tag }).sort({ createdAt: -1 });
    res.status(200).send(cards);
  } catch (err) {
    res
      .status(500)
      .send("An error occurred while fetching the cards for specified.");
  }
});

cardRoutes.put("/:id", async (req, res) => {
  const id = req.params.id;
  const { front, back, tags } = req.body as UpdateCardPayload;

  try {
    if (!front) {
      return res.status(404).send("front not found.");
    }
    const card = await Card.findById(id);

    if (!card) {
      return res.status(404).send("Card not found.");
    }

    card.front = front;
    card.back = back;
    card.tags = tags;

    await card.save();
    res.send(card);
  } catch (err) {
    res.status(500).send("An error ocurred while editing card");
  }
});

cardRoutes.post("/", async (req, res) => {
  const { front, back, tags, author } = req.body as CreateCardPayload;

  try {
    const existingCard = await Card.findOne({ front });
    if (existingCard) {
      return res.status(400).send("Flashcard already exist");
    }

    const card = new Card({
      front: front,
      back: back,
      tags: tags,
      author: author,
    });
    const newCard = await card.save();
    res.status(201).send(newCard);
  } catch (err) {
    res.status(500).send("An error ocurred while adding the new card");
  }
});

cardRoutes.delete("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const card = await Card.findById(id);

    if (!card) {
      return res.status(404).send("Card not found.");
    }

    const currTime: number = new Date().getTime();
    const cardCreatedAt: number = card.createdAt.getTime();
    const timeDiff: number = currTime - cardCreatedAt;

    if (timeDiff >= parseMinutesToMilisec(5)) {
      return res
        .status(403)
        .send(
          "Cannot delete card after 5 minutes from the date of card creation",
        );
    }

    await Card.findByIdAndRemove(id);
    res.status(200).send("Flashcard was deleting successfully");
  } catch (error) {
    res.status(500).send("An error ocurred while deleting card");
  }
});

const parseMinutesToMilisec = (minutes: number): number => {
  return minutes * 60 * 1000;
};

export default cardRoutes;
