import { createSingleOrMultipleBookZodSchema } from "./../validations/book.zod.validation";
import express, { Request, Response } from "express";
import { Book } from "../models/books.model";

export const bookRoutes = express.Router();

// Using "/api/books" route with "POST" method we can create single or multiple book at a time.

bookRoutes.post("/", async (req: Request, res: Response) => {
  try {
    const bookDetails = req.body;
    console.log(bookDetails);

    // For creating multiple books.

    if (Array.isArray(bookDetails)) {
      const validBooksBody =
        await createSingleOrMultipleBookZodSchema.parseAsync(bookDetails);
      const newBooks = await Book.insertMany(validBooksBody);
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
      console.log("Zod Body:", validBookDetails);
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
    console.log(error);
  }
});

// Using "/api/books" route with "GET" method we can find all the books. We can also filter by genre and sort by any field in ascending or descending way.

bookRoutes.get("/", async (req: Request, res: Response) => {
  try {
    const { filter, sortBy = "createdAt", sort = "asc", limit } = req.query;
    const filteringByGenre: any = {};
    if (filter) {
      filteringByGenre.genre = filter.toString().toUpperCase();
    }

    const sortingOptions: any = {};

    sortingOptions[sortBy.toString()] = sort === "asc" ? 1 : -1;

    const resultLimit = limit ? parseInt(limit.toString()) : 10;

    const allBooks = await Book.find(filteringByGenre)
      .sort(sortingOptions)
      .limit(resultLimit);

    res.status(201).json({
      success: true,
      message: "Books retrieved successfully",
      data: allBooks,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to retrieve books!",
      error: error,
    });
    console.log(error);
  }
});

// Using "api/books/:bookId" route with "GET" method we can find the data of any particular book.

bookRoutes.get("/:bookId", async (req: Request, res: Response) => {
  try {
    const bookID = req.params.bookId;
    const myBook = await Book.findById(bookID);

    res.status(201).json({
      success: true,
      message: "Book retrieved successfully",
      data: myBook,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to retrieve book!Please enter a valid book id.",
      error: error,
    });
    console.log(error);
  }
});

// Using "api/books/:bookId" route with "PATCH" method we can update any particular field of a book data.

bookRoutes.patch("/:bookId", async (req: Request, res: Response) => {
  try {
    const bookID = req.params.bookId;
    const newBookDetails = req.body;
    const updatedBook = await Book.findByIdAndUpdate(bookID, newBookDetails, {
      new: true,
    });
    res.status(201).json({
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
    console.log(error);
  }
});

// Using "api/books/:bookId" route with "DELETE" method we can delete any particular book data.

bookRoutes.delete("/:bookId", async (req: Request, res: Response) => {
  try {
    const bookID = req.params.bookId;
    await Book.findByIdAndDelete(bookID);
    res.status(201).json({
      success: true,
      message: "Book details deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to delete book details!Please enter a valid book id.",
      error: error,
    });
    console.log(error);
  }
});
