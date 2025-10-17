"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const books_controller_1 = require("./app/controllers/books.controller");
const borrow_controller_1 = require("./app/controllers/borrow.controller");
const cors_1 = __importDefault(require("cors"));
exports.app = (0, express_1.default)();
exports.app.use(express_1.default.json());
exports.app.use((0, cors_1.default)({
    origin: ["http://localhost:1126", "https://library-management-frontend-rose.vercel.app"],
}));
exports.app.use("/", books_controller_1.bookRoutes);
exports.app.use("/", borrow_controller_1.borrowBookRoutes);
exports.app.get("/", (req, res) => {
    res.send("Welcome to our digital library");
});
