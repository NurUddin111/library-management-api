import express, { Request, Response } from "express";
import { Book } from "../models/books.model";
import { Borrow } from "../models/borrow.model";
import { createBorrowZodSchema } from "../validations/borrow.zod.validation";

export const borrowBookRoutes = express.Router();

// Using "/api/borrow" route with "POST" method we can borrow book.

borrowBookRoutes.post("/", async (req: Request, res: Response) => {
  try {
    const borrowBookRecord = req.body;
    const validBorrowRecord = await createBorrowZodSchema.parseAsync(
      borrowBookRecord
    );
    const { book, quantity }: any = validBorrowRecord;
    const bookDetails: any = await Book.findById(book);
    const { copies } = bookDetails;
    if (bookDetails && copies >= quantity) {
      const newBorrowRecord = await Borrow.create(validBorrowRecord);
      await bookDetails.borrow(quantity);
      res.status(201).json({
        success: true,
        message: "Book borrowed successfully",
        data: newBorrowRecord,
      });
    } else {
      res.status(400).json({
        success: false,
        message:
          "Failed to borrow book!!!Can't find book with this id or not enough copies available.Kindly check your book id or reduce your quantity.",
      });
    }
  } catch (error) {
    res.status(404).json({
      message:
        "Failed to borrow books.Please provide valid book information and kindly check the returning date!",
      success: false,
      error: error,
    });
    console.log(error);
  }
});

// Using "/api/books" route with "GET" method we can find all the books. We can also filter by genre and sort by any field in ascending or descending way.

borrowBookRoutes.get("/", async (req: Request, res: Response) => {
  try {
    const allBorrowRecords = await Borrow.aggregate([
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
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to retrieve borrow records!",
      error: error,
    });
    console.log(error);
  }
});
