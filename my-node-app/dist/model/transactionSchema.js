"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const transactionSchema = new mongoose_1.default.Schema({
    date: { type: Date, required: true },
    amount: { type: Number, required: true },
    category: { type: String, enum: ['Revenue', 'Expense'], required: true },
    status: { type: String, enum: ['Paid', 'Pending'], required: true },
    user_id: { type: String, required: true }
}, { timestamps: true });
const Transaction = mongoose_1.default.model("Transaction", transactionSchema);
exports.default = Transaction;
