"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Book = void 0;
const mongoose_1 = require("mongoose");
const bookSchema = new mongoose_1.Schema({
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    genre: {
        type: String,
        enum: [
            "FICTION",
            "NON_FICTION",
            "SCIENCE",
            "HISTORY",
            "BIOGRAPHY",
            "FANTASY",
        ],
        required: true,
        trim: true,
        uppercase: true,
    },
    isbn: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 10,
        maxlength: 13,
    },
    description: { type: String, trim: true },
    copies: { type: Number, required: true, trim: true },
    available: { type: Boolean, default: true, required: true, trim: true },
}, {
    versionKey: false,
    timestamps: true,
});
bookSchema.methods.borrow = function (quantity) {
    this.copies -= quantity;
    if (this.copies <= 0) {
        this.available = false;
    }
    return this.save();
};
exports.Book = (0, mongoose_1.model)("Book", bookSchema);
