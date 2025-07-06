// import { Server } from "http";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { app } from "./app";

dotenv.config();
let server;
const PORT = process.env.PORT || 1126;

async function main() {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    server = app.listen(PORT, () => {
      console.log(`App listening to port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}

main();
