"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSingleOrMultipleBookZodSchema = void 0;
const zod_1 = require("zod");
// This function will format author name.
const formatName = (name) => {
    const formattedName = name
        .split(" ")
        .filter((part) => part.trim().length > 0)
        .map((part) => part[0].toUpperCase() + part.slice(1).toLowerCase())
        .join(" ");
    return formattedName;
};
const createBookZodSchema = zod_1.z.object({
    title: zod_1.z.string(),
    author: zod_1.z.string().transform(formatName),
    genre: zod_1.z.string().toUpperCase(),
    isbn: zod_1.z.string().min(10).max(13),
    description: zod_1.z.string().optional(),
    copies: zod_1.z.number().min(1),
    available: zod_1.z.boolean().default(true),
});
const createBooksZodSchema = zod_1.z.array(createBookZodSchema);
exports.createSingleOrMultipleBookZodSchema = zod_1.z.union([
    createBookZodSchema,
    createBooksZodSchema,
]);
