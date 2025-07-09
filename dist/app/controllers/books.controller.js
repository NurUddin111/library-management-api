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
// Using "/api/books" route with "POST" method we can create single or multiple book at a time.
exports.bookRoutes.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookDetails = req.body;
        console.log(bookDetails);
        // For creating multiple books.
        if (Array.isArray(bookDetails)) {
            const validBooksBody = yield book_zod_validation_1.createSingleOrMultipleBookZodSchema.parseAsync(bookDetails);
            const newBooks = yield books_model_1.Book.insertMany(validBooksBody);
            // console.log("Zod Body:", validBooksBody);
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
            console.log("Zod Body:", validBookDetails);
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
        console.log(error);
    }
}));
// Using "/api/books" route with "GET" method we can find all the books. We can also filter by genre and sort by any field in ascending or descending way.
exports.bookRoutes.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { filter, sortBy = "createdAt", sort = "asc", limit } = req.query;
        const filteringByGenre = {};
        if (filter) {
            filteringByGenre.genre = filter.toString().toUpperCase();
        }
        const sortingOptions = {};
        sortingOptions[sortBy.toString()] = sort === "asc" ? 1 : -1;
        const resultLimit = limit ? parseInt(limit.toString()) : 10;
        const allBooks = yield books_model_1.Book.find(filteringByGenre)
            .sort(sortingOptions)
            .limit(resultLimit);
        res.status(201).json({
            success: true,
            message: "Books retrieved successfully",
            data: allBooks,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: "Failed to retrieve books!",
            error: error,
        });
        console.log(error);
    }
}));
// Using "api/books/:bookId" route with "GET" method we can find the data of any particular book.
exports.bookRoutes.get("/:bookId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookID = req.params.bookId;
        const myBook = yield books_model_1.Book.findById(bookID);
        res.status(201).json({
            success: true,
            message: "Book retrieved successfully",
            data: myBook,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: "Failed to retrieve book!Please enter a valid book id.",
            error: error,
        });
        console.log(error);
    }
}));
// Using "api/books/:bookId" route with "PATCH" method we can update any particular field of a book data.
exports.bookRoutes.patch("/:bookId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookID = req.params.bookId;
        const newBookDetails = req.body;
        const updatedBook = yield books_model_1.Book.findByIdAndUpdate(bookID, newBookDetails, {
            new: true,
        });
        res.status(201).json({
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
        console.log(error);
    }
}));
// Using "api/books/:bookId" route with "DELETE" method we can delete any particular book data.
exports.bookRoutes.delete("/:bookId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookID = req.params.bookId;
        yield books_model_1.Book.findByIdAndDelete(bookID);
        res.status(201).json({
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
        console.log(error);
    }
}));
