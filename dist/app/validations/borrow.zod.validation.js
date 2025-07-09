"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBorrowZodSchema = void 0;
const zod_1 = require("zod");
exports.createBorrowZodSchema = zod_1.z.object({
    book: zod_1.z.string().nonempty("Please provide a valid book id."),
    quantity: zod_1.z.number().min(1),
    dueDate: zod_1.z.coerce.date(),
});
