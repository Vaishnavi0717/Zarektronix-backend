const express = require('express');
const Submissionrouter = express.Router();
const {authenticateUser} = require('../middlewares/authMiddleware');
const {upload }= require('../middlewares/uploadMiddleware'); 
const {Expense} = require('../model/expense.model');

Submissionrouter.post('/submit-expense', authenticateUser, upload.single('receipt'), async (req, res) => {
  try {
    const { date, amount, category } = req.body;

    
    const newExpense = new Expense({
      date,
      amount,
      category,
      receiptUrl: req.file ? req.file.path : null,
      submittedBy: req.user.userId,
    });

    await newExpense.save();

   
    req.user.expenses.push(newExpense._id);
    await req.user.save();

    res.status(200).json({ message: 'Expense submitted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Internal Server Error' });
  }
});

Submissionrouter.get('/submission-history', authenticateUser, async (req, res) => {
  try {
    const submissionHistory = await Expense.find({ _id: { $in: req.user.expenses } });
    res.status(200).json(submissionHistory);
  } catch (error) {
    res.status(400).json({ message: 'Internal Server Error' });
  }
});



Submissionrouter.get("/expense-report", authenticateUser, async (req, res) => {
  try {
    const { userId, role } = req.user;
    let expenses;
    if (role === "Manager") {
      expenses = await Expense.find();
    } else {
      expenses = await Expense.find({ submittedBy: userId });
    }
    res.status(200).json(expenses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


module.exports = {Submissionrouter};