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
exports.borrowBookRoutes = void 0;
const express_1 = __importDefault(require("express"));
const books_model_1 = require("../models/books.model");
const borrow_model_1 = require("../models/borrow.model");
const borrow_zod_validation_1 = require("../validations/borrow.zod.validation");
exports.borrowBookRoutes = express_1.default.Router();
// Using "/api/borrow" route with "POST" method we can borrow book.
exports.borrowBookRoutes.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const borrowBookRecord = req.body;
        const validBorrowRecord = yield borrow_zod_validation_1.createBorrowZodSchema.parseAsync(borrowBookRecord);
        const { book, quantity } = validBorrowRecord;
        const bookDetails = yield books_model_1.Book.findById(book);
        const { copies } = bookDetails;
        if (bookDetails && copies >= quantity) {
            const newBorrowRecord = yield borrow_model_1.Borrow.create(validBorrowRecord);
            yield bookDetails.borrow(quantity);
            res.status(201).json({
                success: true,
                message: "Book borrowed successfully",
                data: newBorrowRecord,
            });
        }
        else {
            res.status(400).json({
                success: false,
                message: "Failed to borrow book!!!Can't find book with this id or not enough copies available.Kindly check your book id or reduce your quantity.",
            });
        }
    }
    catch (error) {
        res.status(404).json({
            message: "Failed to borrow books.Please provide valid book information and kindly check the returning date!",
            success: false,
            error: error,
        });
        console.log(error);
    }
}));
// Using "/api/books" route with "GET" method we can find all the books. We can also filter by genre and sort by any field in ascending or descending way.
exports.borrowBookRoutes.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allBorrowRecords = yield borrow_model_1.Borrow.aggregate([
            {
                $group: {
                    _id: "$book",
                    totalQuantity: { $sum: "$quantity" },
                },
            },
            {
                $lookup: {
                    from: "books",
                    localField: "_id",
                    foreignField: "_id",
                    as: "bookDetails",
                },
            },
            {
                $unwind: "$bookDetails",
            },
            {
                $project: {
                    _id: false,
                    book: {
                        title: "$bookDetails.title",
                        isbn: "$bookDetails.isbn",
                    },
                    totalQuantity: "$totalQuantity",
                },
            },
        ]);
        res.status(201).json({
            success: true,
            message: "Borrow Records retrieved successfully",
            data: allBorrowRecords,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: "Failed to retrieve borrow records!",
            error: error,
        });
        console.log(error);
    }
}));
