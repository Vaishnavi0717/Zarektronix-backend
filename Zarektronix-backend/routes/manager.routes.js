const express = require('express');
const Managerrouter = express.Router();
const {authenticateUser} = require('../middlewares/authMiddleware');
const {Expense} = require('../model/expense.model');

Managerrouter.get('/pending-expenses', authenticateUser, async (req, res) => {
  try {
    if (req.user.role !== 'Manager') {
      return res.status(400).json({ message: 'Access forbidden' });
    }

    const pendingExpenses = await Expense.find({ status: 'Pending' });
    res.status(200).json(pendingExpenses);
  } catch (error) {
    res.status(400).json({ message: 'Internal Server Error' });
  }
});

Managerrouter.post('/approve-expense/:expenseId', authenticateUser, async (req, res) => {
  try {
    if (req.user.role !== 'Manager') {
      return res.status(400).json({ message: 'Access forbidden' });
    }

    const expense = await Expense.findById(req.params.expenseId);
    if (!expense || expense.status !== 'Pending') {
      return res.status(400).json({ message: 'Invalid expense ID' });
    }

    expense.status = 'Approved';
    await expense.save();

    res.status(200).json({ message: 'Expense approved successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Internal Server Error' });
  }
});

Managerrouter.post('/reject-expense/:expenseId', authenticateUser, async (req, res) => {
  try {
    if (req.user.role !== 'Manager') {
      return res.status(400).json({ message: 'Access forbidden' });
    }

    const expense = await Expense.findById(req.params.expenseId);
    if (!expense || expense.status !== 'Pending') {
      return res.status(400).json({ message: 'Invalid expense ID' });
    }

    expense.status = 'Rejected';
    await expense.save();

    res.status(200).json({ message: 'Expense rejected successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Internal Server Error' });
  }
});



Managerrouter.get("/dashboard-analytics", authenticateUser, async (req, res) => {
  try {
    const totalExpenses = await Expense.aggregate([
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" },
          averageAmount: { $avg: "$amount" },
          totalPending: {
            $sum: {
              $cond: { if: { $eq: ["$status", "Pending"] }, then: 1, else: 0 },
            },
          },
        },
      },
    ]);
    res.status(200).json(totalExpenses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


module.exports = {Managerrouter};