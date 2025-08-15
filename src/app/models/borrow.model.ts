import { Book } from "./books.model";
import { model, Schema } from "mongoose";
import { Iborrow } from "../interfaces/borrow.interface";

const borrowSchema = new Schema<Iborrow>(
  {
    bookId: {
      type: Schema.Types.ObjectId,
      ref: Book,
      required: true,
      trim: true,
    },
    quantity: { type: Number, required: true, trim: true, min: 1 },
    dueDate: { type: Date, required: true, trim: true },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

borrowSchema.pre("save", function (next) {
  this.quantity = Math.floor(this.quantity);
  if (this.quantity < 1) {
    return next(new Error("Quantity must be at least 1"));
  }
  const dueDate = new Date(this.dueDate);
  const currentDate = new Date();
  if (dueDate <= currentDate) {
    return next(new Error("Due Date must be in the future"));
  }
  next();
});

export const Borrow = model<Iborrow>("Borrow", borrowSchema);
