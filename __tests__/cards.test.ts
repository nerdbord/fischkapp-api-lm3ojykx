import request from "supertest";
import mongoose, { Document } from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { app } from "../utils/server";
import { Card, ICard } from "../models/card";
import { CreateCardPayload } from "../types/cardTypes";

describe("cards", () => {
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());

    const testCard1: Document<ICard> = new Card({
      front: "Front 1",
      back: "Back 1",
      author: "Author1",
      tags: ["tag1", "tag2"],
    });
    const testCard2: Document<ICard> = new Card({
      front: "Front 2",
      back: "Back 2",
      author: "Author2",
      tags: ["tag2", "tag3"],
    });
    const testCard3: Document<ICard> = new Card({
      front: "Front 3",
      back: "Back 3",
      author: "Author1",
      tags: ["tag3", "tag4"],
    });

    await testCard1.save();
    await testCard2.save();
    await testCard3.save();
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
  });

  describe("get cards route", () => {
    it("should return 404 when given card does not exist", async () => {
      const cardId = "asd-123";

      await request(app)
        .get(`/cards/${cardId}`)
        .set("Authorization", "pss-this-is-my-secret")
        .expect(404);
    });

    it("should return 200", async () => {
      const resp = await request(app)
        .get("/cards")
        .set("Authorization", "pss-this-is-my-secret");
      expect(resp.status).toBe(200);
    });

    it("should return 3 cards", async () => {
      const resp = await request(app)
        .get("/cards")
        .set("Authorization", "pss-this-is-my-secret");

      expect(resp.body.length).toBe(3);
    });

    it("should return cards in the correct order ", async () => {
      const resp = await request(app)
        .get("/cards")
        .set("Authorization", "pss-this-is-my-secret");

      expect(resp.body[0].front).toBe("Front 3");
      expect(resp.body[1].front).toBe("Front 2");
      expect(resp.body[2].front).toBe("Front 1");
    });

    it("should return cards written by the requested author in the correct order ", async () => {
      const resp = await request(app)
        .get("/cards/author/Author1")
        .set("Authorization", "pss-this-is-my-secret");

      expect(resp.body[0].front).toBe("Front 3");
      expect(resp.body[1].front).toBe("Front 1");
    });

    it("should return 2 cards written by the requested author ", async () => {
      const resp = await request(app)
        .get("/cards/author/Author1")
        .set("Authorization", "pss-this-is-my-secret");

      expect(resp.body.length).toBe(2);
    });

    it("should return 2 cards with the requested tag ", async () => {
      const resp = await request(app)
        .get("/cards/tags/tag2")
        .set("Authorization", "pss-this-is-my-secret");

      expect(resp.body.length).toBe(2);
    });
  });

  describe("post card route", () => {
    afterEach(async () => {
      await Card.deleteMany();
    });

    const newCard: CreateCardPayload = {
      front: "Front 4",
      back: "Back 4",
      author: "Author2",
      tags: ["tag4", "tag5"],
    };

    it("should return 201", async () => {
      const resp = await request(app)
        .post("/cards")
        .set("Authorization", "pss-this-is-my-secret")
        .send(newCard);

      expect(resp.statusCode).toBe(201);
    });

    it("should create correct card", async () => {
      const resp = await request(app)
        .post("/cards")
        .set("Authorization", "pss-this-is-my-secret")
        .send(newCard);

      expect(resp.body).toHaveProperty("front", "Front 4");
      expect(resp.body).toHaveProperty("back", "Back 4");
      expect(resp.body).toHaveProperty("author", "Author2");
      expect(resp.body).toHaveProperty("tags", ["tag4", "tag5"]);
    });

    it("should return 400 when card with specific front value already exist", async () => {
      const existingCard: CreateCardPayload = {
        front: "Front 4",
        back: "Back 4",
        author: "Author2",
        tags: ["tag4", "tag5"],
      };
      await request(app)
        .post("/cards")
        .set("Authorization", "pss-this-is-my-secret")
        .send(newCard);

      const resp = await request(app)
        .post("/cards")
        .set("Authorization", "pss-this-is-my-secret")
        .send(existingCard);

      expect(resp.statusCode).toBe(400);
    });
  });

  describe("put card into db", () => {
    const testCard: CreateCardPayload = {
      front: "Front 1",
      back: "Back 1",
      author: "Author1",
      tags: ["tag1", "tag2"],
    };

    const testCardUpdate: CreateCardPayload = {
      front: "Updated Front",
      back: "Updated Back",
      author: "Updated Author",
      tags: ["Updated"],
    };

    let createdCardId: string;

    beforeAll(async () => {
      const createCardResponse = await request(app)
        .post("/cards")
        .set("Authorization", "pss-this-is-my-secret")
        .send(testCard);

      createdCardId = createCardResponse.body._id;
    });

    afterAll(async () => {
      await Card.deleteMany();
    });

    it("should give 200 when card is updated", async () => {
      const resp = await request(app)
        .put(`/cards/${createdCardId}`)
        .set("Authorization", "pss-this-is-my-secret")
        .send(testCardUpdate);

      expect(resp.status).toBe(200);
    });

    it("should update the card with given data", async () => {
      const resp = await request(app)
        .put(`/cards/${createdCardId}`)
        .set("Authorization", "pss-this-is-my-secret")
        .send(testCardUpdate);

      const updatedCard = await Card.findById(createdCardId);

      expect(updatedCard).not.toBeNull();
      expect(updatedCard!.front).toBe(testCardUpdate.front);
      expect(updatedCard!.back).toBe(testCardUpdate.back);
      expect(updatedCard!.tags).toEqual(
        expect.arrayContaining(testCardUpdate.tags),
      );
    });

    it("should return the updated flashcard", async () => {
      const resp = await request(app)
        .put(`/cards/${createdCardId}`)
        .set("Authorization", "pss-this-is-my-secret")
        .send(testCardUpdate);

      expect(resp.body.front).toBe(testCardUpdate.front);
      expect(resp.body.back).toBe(testCardUpdate.back);
      expect(resp.body.tags).toEqual(
        expect.arrayContaining(testCardUpdate.tags),
      );
    });
  });

  describe("Delete card route", () => {
    const testCard: CreateCardPayload = {
      front: "Front 1",
      back: "Back 1",
      author: "Author1",
      tags: ["tag1", "tag2"],
    };

    let createdCardId: string;

    beforeAll(async () => {
      const createCardResponse = await request(app)
        .post("/cards")
        .set("Authorization", "pss-this-is-my-secret")
        .send(testCard);

      createdCardId = createCardResponse.body._id;
    });

    it("returns a status code of 200 if card deleted correctly", async () => {
      const response = await request(app)
        .delete(`/cards/${createdCardId}`)
        .set("Authorization", "pss-this-is-my-secret");
      expect(response.status).toBe(200);
    });

    it("deletes the requested flashcard if it was created less than 5 minutes ago.", async () => {
      const response = await request(app)
        .delete(`/cards/${createdCardId}`)
        .set("Authorization", "pss-this-is-my-secret");

      const searchedCard = await Card.findById(createdCardId);
      expect(searchedCard).toBeNull();
    });

    it("returns a status code of 403 if the flashcard was created more than 5 minutes ago.", async () => {
      const fiveMinutesAgoTimestamp = new Date(Date.now() - 6 * 60 * 1000);

      const testCard: ICard = new Card({
        front: "Front 1",
        back: "Back 1",
        author: "Author1",
        tags: ["tag1", "tag2"],
      });

      testCard.createdAt = fiveMinutesAgoTimestamp;
      testCard.save();

      const createdCardId1 = testCard._id;

      const response = await request(app)
        .delete(`/cards/${createdCardId1}`)
        .set("Authorization", "pss-this-is-my-secret");
      expect(response.status).toBe(403);
    });

    it("returns a status code of 404 if the requested flashcard does not exist", async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toString();

      await request(app)
        .delete(`/cards/${nonExistentId}`)
        .set("Authorization", "pss-this-is-my-secret")
        .expect(404);
    });
  });
});
