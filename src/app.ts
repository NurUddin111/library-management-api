import express, { Application, Request, Response } from "express";
import { bookRoutes } from "./app/controllers/books.controller";
import { borrowBookRoutes } from "./app/controllers/borrow.controller";
import cors from "cors";

export const app: Application = express();

app.use(express.json());
app.use(
  cors({
    origin: ["https://library-management-frontend-rose.vercel.app"],
  })
);

app.use("/", bookRoutes);
app.use("/", borrowBookRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to our digital library");
});
