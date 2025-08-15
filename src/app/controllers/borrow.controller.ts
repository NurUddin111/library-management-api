import express, { Request, Response } from "express";
import { Book } from "../models/books.model";
import { Borrow } from "../models/borrow.model";
import { createBorrowZodSchema } from "../validations/borrow.zod.validation";

export const borrowBookRoutes = express.Router();

// Using "/borrow/:bookId" route with "POST" method we can borrow book.

borrowBookRoutes.post(
  "/borrow/:bookId",
  async (req: Request, res: Response) => {
    try {
      const bookId = req.params.bookId;
      const borrowBookRecord = { bookId, ...req.body };

      const validBorrowRecord = await createBorrowZodSchema.parseAsync(
        borrowBookRecord
      );
      const { quantity }: any = validBorrowRecord;
      const bookDetails: any = await Book.findById(bookId);
      const { copies } = bookDetails;
      if (bookDetails && copies >= quantity) {
        const newBorrowRecord = await Borrow.create(validBorrowRecord);
        await bookDetails.borrow(quantity);
        res.status(200).json({
          success: true,
          message: "Book borrowed successfully",
          data: newBorrowRecord,
        });
      } else {
        res.status(404).json({
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
    }
  }
);

// Using "/borrow-summary" route with "GET" method we can find all the books. We can also filter by genre and sort by any field in ascending or descending way.

borrowBookRoutes.get("/borrow-summary", async (req: Request, res: Response) => {
  try {
    const allBorrowRecords = await Borrow.aggregate([
      {
        $group: {
          _id: "$bookId",
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

    res.status(200).json({
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
  }
});
