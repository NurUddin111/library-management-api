import {
  createSingleOrMultipleBookZodSchema,
  updateBookZodSchema,
} from "./../validations/book.zod.validation";
import express, { Request, Response } from "express";
import { Book } from "../models/books.model";

export const bookRoutes = express.Router();

// Using "/create-book" route with "POST" method we can create single or multiple book at a time.

bookRoutes.post("/create-book", async (req: Request, res: Response) => {
  try {
    const bookDetails = req.body;

    // For creating multiple books.

    if (Array.isArray(bookDetails)) {
      const validBooksDetails =
        await createSingleOrMultipleBookZodSchema.parseAsync(bookDetails);
      const newBooks = await Book.insertMany(validBooksDetails);
      res.status(201).json({
        success: true,
        message: "Books Created Successfully",
        data: newBooks,
      });
    } else {
      // For creating a single book.

      const validBookDetails =
        await createSingleOrMultipleBookZodSchema.parseAsync(bookDetails);
      const newBook = await Book.create(validBookDetails);
      res.status(201).json({
        success: true,
        message: "Book Created Successfully",
        data: newBook,
      });
    }
  } catch (error) {
    res.status(400).json({
      message: "Validation Failed!",
      success: false,
      error: error,
    });
  }
});

// Using "/books" route with "GET" method we can find all the books. We can also filter by genre and sort by any field in ascending or descending way.

bookRoutes.get("/books", async (req: Request, res: Response) => {
  try {
    const allBooks = await Book.find();

    res.status(200).json({
      success: true,
      message: "Books retrieved successfully",
      data: allBooks,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: "Failed to retrieve books!",
      error: error,
    });
  }
});

// Using "/books/:bookId" route with "GET" method we can find the data of any particular book.

bookRoutes.get("/books/:bookId", async (req: Request, res: Response) => {
  try {
    const bookID = req.params.bookId;
    const myBook = await Book.findById(bookID);

    res.status(200).json({
      success: true,
      message: "Book retrieved successfully",
      data: myBook,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: "Failed to retrieve book!Please enter a valid book id.",
      error: error,
    });
  }
});

// Using "/edit-book/:bookId" route with "PUT" method we can update any particular field of a book data.

bookRoutes.put("/edit-book/:bookId", async (req: Request, res: Response) => {
  try {
    const bookID = req.params.bookId;
    const newBookDetails = req.body;
    let validBookUpdateDetails = await updateBookZodSchema.parseAsync(
      newBookDetails
    );
    const { copies } = validBookUpdateDetails;
    if (copies > 0) {
      validBookUpdateDetails = { ...validBookUpdateDetails, available: true };
    } else {
      validBookUpdateDetails = { ...validBookUpdateDetails, available: false };
    }
    const updatedBook = await Book.findByIdAndUpdate(
      bookID,
      validBookUpdateDetails,
      {
        new: true,
      }
    );
    res.status(200).json({
      success: true,
      message: "Book details updated successfully",
      data: updatedBook,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        "Failed to update book details!Please enter a valid book id or book information.",
      error: error,
    });
  }
});

// Using "/:bookId" route with "DELETE" method we can delete any particular book data.

bookRoutes.delete("/:bookId", async (req: Request, res: Response) => {
  try {
    const bookID = req.params.bookId;
    await Book.findByIdAndDelete(bookID);
    res.status(204).json({
      success: true,
      message: "Book details deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to delete book details!Please enter a valid book id.",
      error: error,
    });
  }
});
