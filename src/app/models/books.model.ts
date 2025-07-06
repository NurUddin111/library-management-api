import { model, Schema } from "mongoose";
import { Ibooks } from "../interfaces/books.interface";

const bookSchema = new Schema<Ibooks>(
  {
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    genre: {
      type: String,
      enum: [
        "FICTION",
        "NON_FICTION",
        "SCIENCE",
        "HISTORY",
        "BIOGRAPHY",
        "FANTASY",
      ],
      required: true,
      trim: true,
      uppercase: true,
    },
    isbn: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 10,
      maxlength: 13,
    },
    description: { type: String, trim: true },
    copies: { type: Number, required: true, trim: true },
    available: { type: Boolean, default: true, required: true, trim: true },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

bookSchema.methods.borrow = function (quantity: number) {
  this.copies -= quantity;
  if (this.copies <= 0) {
    this.available = false;
  }
  return this.save();
};

export const Book = model<Ibooks>("Book", bookSchema);
