import { z } from "zod";

export const createBorrowZodSchema = z.object({
  bookId: z.string().nonempty("Please provide a valid book id."),
  quantity: z.number().min(1),
  dueDate: z.coerce.date(),
});
