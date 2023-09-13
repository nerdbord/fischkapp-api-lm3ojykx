import supertest from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { app } from "../utils/server";

describe("cards", () => {
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
  });

  describe("get cards route", () => {
    it("should return 404 when given card does not exist", async () => {
      const cardId = "asd-123";

      await supertest(app)
        .get(`/cards/${cardId}`)
        .set("Authorization", "pss-this-is-my-secret")
        .expect(404);
    });
  });
});
