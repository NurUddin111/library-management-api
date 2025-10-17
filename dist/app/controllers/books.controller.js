"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookRoutes = void 0;
const book_zod_validation_1 = require("./../validations/book.zod.validation");
const express_1 = __importDefault(require("express"));
const books_model_1 = require("../models/books.model");
exports.bookRoutes = express_1.default.Router();
// Using "/create-book" route with "POST" method we can create single or multiple book at a time.
exports.bookRoutes.post("/create-book", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookDetails = req.body;
        // For creating multiple books.
        if (Array.isArray(bookDetails)) {
            const validBooksDetails = yield book_zod_validation_1.createSingleOrMultipleBookZodSchema.parseAsync(bookDetails);
            const newBooks = yield books_model_1.Book.insertMany(validBooksDetails);
            res.status(201).json({
                success: true,
                message: "Books Created Successfully",
                data: newBooks,
            });
        }
        else {
            // For creating a single book.
            const validBookDetails = yield book_zod_validation_1.createSingleOrMultipleBookZodSchema.parseAsync(bookDetails);
            const newBook = yield books_model_1.Book.create(validBookDetails);
            res.status(201).json({
                success: true,
                message: "Book Created Successfully",
                data: newBook,
            });
        }
    }
    catch (error) {
        res.status(400).json({
            message: "Validation Failed!",
            success: false,
            error: error,
        });
    }
}));
// Using "/books" route with "GET" method we can find all the books. We can also filter by genre and sort by any field in ascending or descending way.
exports.bookRoutes.get("/books", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allBooks = yield books_model_1.Book.find();
        res.status(200).json({
            success: true,
            message: "Books retrieved successfully",
            data: allBooks,
        });
    }
    catch (error) {
        res.status(404).json({
            success: false,
            message: "Failed to retrieve books!",
            error: error,
        });
    }
}));
// Using "/books/:bookId" route with "GET" method we can find the data of any particular book.
exports.bookRoutes.get("/books/:bookId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookID = req.params.bookId;
        const myBook = yield books_model_1.Book.findById(bookID);
        res.status(200).json({
            success: true,
            message: "Book retrieved successfully",
            data: myBook,
        });
    }
    catch (error) {
        res.status(404).json({
            success: false,
            message: "Failed to retrieve book!Please enter a valid book id.",
            error: error,
        });
    }
}));
// Using "/edit-book/:bookId" route with "PUT" method we can update any particular field of a book data.
exports.bookRoutes.put("/edit-book/:bookId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookID = req.params.bookId;
        const newBookDetails = req.body;
        let validBookUpdateDetails = yield book_zod_validation_1.updateBookZodSchema.parseAsync(newBookDetails);
        const { copies } = validBookUpdateDetails;
        if (copies > 0) {
            validBookUpdateDetails = Object.assign(Object.assign({}, validBookUpdateDetails), { available: true });
        }
        else {
            validBookUpdateDetails = Object.assign(Object.assign({}, validBookUpdateDetails), { available: false });
        }
        const updatedBook = yield books_model_1.Book.findByIdAndUpdate(bookID, validBookUpdateDetails, {
            new: true,
        });
        res.status(200).json({
            success: true,
            message: "Book details updated successfully",
            data: updatedBook,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: "Failed to update book details!Please enter a valid book id or book information.",
            error: error,
        });
    }
}));
// Using "/:bookId" route with "DELETE" method we can delete any particular book data.
exports.bookRoutes.delete("/:bookId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookID = req.params.bookId;
        yield books_model_1.Book.findByIdAndDelete(bookID);
        res.status(204).json({
            success: true,
            message: "Book details deleted successfully",
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: "Failed to delete book details!Please enter a valid book id.",
            error: error,
        });
    }
}));
