"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Borrow = void 0;
const books_model_1 = require("./books.model");
const mongoose_1 = require("mongoose");
const borrowSchema = new mongoose_1.Schema({
    book: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: books_model_1.Book,
        required: true,
        trim: true,
    },
    quantity: { type: Number, required: true, trim: true, min: 1 },
    dueDate: { type: Date, required: true, trim: true },
}, {
    versionKey: false,
    timestamps: true,
});
borrowSchema.pre("save", function (next) {
    this.quantity = Math.floor(this.quantity);
    if (this.quantity < 1) {
        return next(new Error("Quantity must be at least 1"));
    }
    const dueDate = new Date(this.dueDate);
    const currentDate = new Date();
    if (dueDate <= currentDate) {
        return next(new Error("Due Date must be in the future"));
    }
    next();
});
exports.Borrow = (0, mongoose_1.model)("Borrow", borrowSchema);
