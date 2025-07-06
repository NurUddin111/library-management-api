📚 Library Management API
A backend RESTful API built with Express.js, TypeScript, and MongoDB, allowing users to manage books and borrowing operations for a digital library.

🚀 Features

📖 Book Management

=> Add new books
=> Update book details
=> Delete books
=> Filter books by genre
=> Sort & limit query results

📦 Borrow System

=> Borrow a book with quantity and due date
=> Automatically update book availability and copies
=> Validation to ensure enough stock and valid due date

📊 Borrow Summary

=> View total borrowed quantity per book using MongoDB aggregation

🪪 Zod Validation

=> Input validation on request bodies

⏳ Timestamps

=> Automatic createdAt and updatedAt fields

🧠 Mongoose Middleware

=> Pre save validation and logging
=> Business logic encapsulated in schema methods

🛠️ Tech Stack

=> Node.js
=> Express.js
=> TypeScript
=> MongoDB & Mongoose
=> Zod (for validation)
=> Postman (for testing)

🧑‍💻 Getting Started

    📦 Prerequisites

    => Node.js v18+
    => MongoDB Atlas or local MongoDB running
    => npm

📁 Clone the Project

=> git clone https://github.com/
=> cd

📦 Install Dependencies

=>npm install

    This will install all required packages including:

    => express
    => mongoose
    => ts-node-dev
    => dotenv
    => zod

⚙️ Setup Environment Variables

=> Create a `.env` file in the root and copy from `.env.example`:

    PORT=1126
    MONGODB_URI=<your-mongodb-connection-uri>

▶️ Run the Project

=> npm run dev
=> The server should now be running at: http://localhost:1126

🧪 API Endpoints Overview

    📕Books

    ---------------------------------------------------------
    | Method    |     Endpoint        |      Description    |
    ---------------------------------------------------------
    | POST      | /api/books          |   Add a new book    |
    ---------------------------------------------------------
    | GET       | /api/books          |   Get all books     |
    ---------------------------------------------------------
    | GET       | /api/books/:bookId  |   Get a single book |
    ---------------------------------------------------------
    | PATCH     | /api/books/:bookId  |   Update book info  |
    ---------------------------------------------------------
    | DELETE    | /api/books/:bookId  |   Delete a book     |
    ---------------------------------------------------------

    📏Supports filters like:

    => /api/books?filter=FICTION&sortBy=createdAt&sort=desc&limit=5

    📦Borrow
    -------------------------------------------------------------
    | Method    |     Endpoint        |     Description         |
    -------------------------------------------------------------
    | POST      | /api/borrow         |  Borrow a book          |
    -------------------------------------------------------------
    | GET       | /api/borrow         |  View borrow summary    |
    -------------------------------------------------------------

🪜 Folder Structure

    📁 src
    ┣ 📁app
    ┃ ┣ 📁controllers
    ┃ ┣ 📁interfaces
    ┃ ┣ 📁models
    ┃ ┣ 📁validations
    ┃
    ┣ 📜app.ts
    ┣ 📜server.ts
    📁 .env

👨‍🔧 Author
Muhammad Nur Uddin
Full-stack Developer in the making 🚀
