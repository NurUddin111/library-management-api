import { z } from "zod";

// This function will format author name.

const formatName = (name: string) => {
  const formattedName = name
    .split(" ")
    .filter((part) => part.trim().length > 0)
    .map((part) => part[0].toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");

  return formattedName;
};

const createBookZodSchema = z.object({
  title: z.string(),
  author: z.string().transform(formatName),
  genre: z.string().toUpperCase(),
  isbn: z.string().min(10).max(13),
  description: z.string().optional(),
  copies: z.number().min(1),
  available: z.boolean().default(true),
});

const createBooksZodSchema = z.array(createBookZodSchema);

export const createSingleOrMultipleBookZodSchema = z.union([
  createBookZodSchema,
  createBooksZodSchema,
]);
