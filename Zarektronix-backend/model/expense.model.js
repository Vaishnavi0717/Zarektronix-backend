const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  receiptUrl: { type: String },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },
  submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});


const Expense = mongoose.model('Expense', expenseSchema);

module.exports = {Expense};