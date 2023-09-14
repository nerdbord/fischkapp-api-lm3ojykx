import mongoose from "mongoose";

export interface ICard extends mongoose.Document {
  front: string;
  back: string;
  tags: string[];
  author: string;
  createdAt: Date;
  updatedAt: Date;
}

export const cardSchema = new mongoose.Schema<ICard>(
  {
    front: {
      type: String,
      required: true,
      unique: true,
    },
    back: {
      type: String,
      required: true,
    },
    tags: [String],
    author: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export const Card = mongoose.model("Card", cardSchema);
