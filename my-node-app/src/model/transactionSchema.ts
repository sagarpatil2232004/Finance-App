import mongoose from "mongoose";


const transactionSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  amount: { type: Number, required: true },
  category: { type: String, enum: ['Revenue', 'Expense'], required: true },
  status: { type: String, enum: ['Paid', 'Pending'], required: true },
  user_id: { type:String, required: true }
},{ timestamps: true })

const Transaction = mongoose.model("Transaction", transactionSchema);
export default Transaction;