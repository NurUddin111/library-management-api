import { z } from "zod";

export const createBorrowZodSchema = z.object({
  book: z.string().nonempty("Please provide a valid book id."),
  quantity: z.number().min(1),
  dueDate: z.coerce.date(),
});
