import { ObjectId } from "mongoose";

export interface Iborrow {
  bookId: ObjectId;
  quantity: number;
  dueDate: Date;
}
