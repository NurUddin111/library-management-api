import { ObjectId } from "mongoose";

export interface Iborrow {
  book: ObjectId;
  quantity: number;
  dueDate: Date;
}
