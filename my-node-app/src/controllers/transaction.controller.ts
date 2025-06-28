import { Request, Response } from "express";
import Transaction from "../model/transactionSchema";
import fs from "fs";
import path from "path";

export const addTransaction = async (req: Request, res: Response) => {
    const { date, amount, category, status, user_id } = req.body;
    
    if(!date || !amount || !category || !status || !user_id) {
         res.status(400).json({ message: "All fields are required" });
         return;
    }

    try {
        const newTransaction = new Transaction({ date, amount, category, status, user_id });
        await newTransaction.save();
        res.status(201).json(newTransaction);
    } catch (error) {
        res.status(500).json({ message: "Error adding transaction", error });
    }
}

// PUT /api/transaction/:id
export const updateTransaction = async (req: Request, res: Response)  => {
  try {
    const updated = await Transaction.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!updated){
      res.status(404).json({ error: "Not found" });
      return;
    } 
      
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ error: "Update failed" });
  }
};

// DELETE /api/transaction/:id
export const deleteTransaction = async (req: Request, res: Response)  => {
  try {
    const deleted = await Transaction.findByIdAndDelete(req.params.id);
    if (!deleted) {
       res.status(404).json({ error: "Not found" });
      return;
    }

    res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: "Delete failed" });
  }
};

export const getTransactions = async (req: Request, res: Response) => {
  try {
    // Fetch all transactions from DB
    const transactions = await Transaction.find();
    

    // Send as JSON
    res.status(200).json({
      success: true,
      data: transactions,
    });

    
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};



// Total Revenue (All statuses)
export const getTotalRevenue = async (req: Request, res: Response) => {
  try {
    const totalRevenue = await Transaction.aggregate([
      { $match: { category: "Revenue" } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    res.status(200).json({
      success: true,
      totalRevenue: totalRevenue[0]?.total || 0,
    });
  } catch (error) {
    console.error('Error calculating total revenue:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// Total Expense (All statuses)
export const getTotalExpense = async (req: Request, res: Response) => {
  try {
    const totalExpense = await Transaction.aggregate([
      { $match: { category: "Expense" } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    res.status(200).json({
      success: true,
      totalExpense: totalExpense[0]?.total || 0,
    });
  } catch (error) {
    console.error('Error calculating total expense:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// Balance = Revenue - Expense (All statuses)
export const getBalance = async (req: Request, res: Response) => {
  try {
    const [revenueAgg] = await Transaction.aggregate([
      { $match: { category: "Revenue" } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    const [expenseAgg] = await Transaction.aggregate([
      { $match: { category: "Expense" } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    const revenue = revenueAgg?.total || 0;
    const expense = expenseAgg?.total || 0;

    res.status(200).json({
      success: true,
      balance: revenue - expense,
    });
  } catch (error) {
    console.error('Error calculating balance:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// export const getPendingRevenue = async (req: Request, res: Response) => {
//   try {
//     const result = await Transaction.aggregate([
//       { $match: { category: "Revenue", status: "Pending" } },
//       { $group: { _id: null, total: { $sum: "$amount" } } }
//     ]);

//     res.status(200).json({
//       success: true,
//       pendingRevenue: result[0]?.total || 0,
//     });
//   } catch (error) {
//     console.error('Error calculating pending revenue:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Internal server error',
//     });
//   }
// };

// export const getPendingExpense = async (req: Request, res: Response) => {
//   try {
//     const result = await Transaction.aggregate([
//       { $match: { category: "Expense", status: "Pending" } },
//       { $group: { _id: null, total: { $sum: "$amount" } } }
//     ]);

//     res.status(200).json({
//       success: true,
//       pendingExpense: result[0]?.total || 0,
//     });
//   } catch (error) {
//     console.error('Error calculating pending expense:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Internal server error',
//     });
//   }
// };



export const getFilteredTransactions = async (req: Request, res: Response) => {
  try {
    const { search, status, category, from, to } = req.query;

    const query: any = {};

    if (search) {
      const regex = new RegExp(search as string, 'i'); // case-insensitive
      query.$or = [
        { user_id: regex },
        { status: regex },
        { category: regex }
      ];
    }

    if (status && status !== "All") {
      query.status = status;
    }

    if (category && category !== "All") {
      query.category = category;
    }

    if (from || to) {
      query.date = {};
      if (from) query.date.$gte = new Date(from as string);
      if (to) query.date.$lte = new Date(to as string);
    }

    const transactions = await Transaction.find(query).sort({ date: -1 });

    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch transactions", error });
  }
};



export const getLineChart = async (req: Request, res: Response) => {
  try {
    let { filter, startDate } = req.query;

    // Assign default value to filter if not provided
    if (!filter) filter = "monthly";

    const now = new Date();
    let fromDate: Date;

    // If startDate is provided, use it
    if (startDate) {
      fromDate = new Date(startDate as string);
      if (isNaN(fromDate.getTime())) {
         res.status(400).json({ error: "Invalid startDate format" });
         return;
      }
    } else {
      // Derive fromDate based on filter
      switch (filter) {
        case "weekly":
          fromDate = new Date();
          fromDate.setDate(now.getDate() - 7);
          break;
        case "monthly":
          fromDate = new Date();
          fromDate.setMonth(now.getMonth() - 1);
          break;
        case "yearly":
          fromDate = new Date();
          fromDate.setFullYear(now.getFullYear() - 1);
          break;
        default:
           res.status(400).json({ error: "Invalid filter" });
           return;
      }
    }

    // Fetch and sort transactions
    const transactions = await Transaction.find({
      date: { $gte: fromDate },
    }).sort({ date: 1 });

    res.status(200).json({ transactions });
    return;
  } catch (error) {
    console.error("Error in /overview:", error);
     res.status(500).json({ error: "Internal Server Error" });
     return;
  }
};

function getGroupFormat(filter: string) {
  switch (filter) {
    case "Weekly":
      return { format: "%Y-%U", label: "%Y Week %U" };
    case "Yearly":
      return { format: "%Y", label: "%Y" };
    case "Monthly":
    default:
      return { format: "%Y-%m", label: "%b %Y" };
  }
}

export const getAnalytics = async (req: Request, res: Response) => {
  try {
    const { filter = "Monthly", startDate } = req.query;

    if (!startDate) {
      res.status(400).json({ error: "Missing startDate" });
      return ;
    }

  

    const { format } = getGroupFormat(filter as string);
    const start = new Date(startDate as string);
    const match = {  date: { $gte: start } };

    const grouped = await Transaction.aggregate([
      { $match: match },
      {
        $group: {
          _id: {
            period: { $dateToString: { format, date: "$date" } },
            category: "$category",
            status: "$status"
          },
          total: { $sum: "$amount" }
        }
      },
      {
        $project: {
          period: "$_id.period",
          category: "$_id.category",
          status: "$_id.status",
          total: 1,
          _id: 0
        }
      }
    ]);

    const periodMap: Record<string, { month: string, paid: number, pending: number }> = {};
    grouped.forEach(entry => {
      const key = entry.period;
      if (!periodMap[key]) {
        periodMap[key] = { month: key, paid: 0, pending: 0 };
      }
      if (entry.status === "Paid") periodMap[key].paid += entry.total;
      else if (entry.status === "Pending") periodMap[key].pending += entry.total;
    });

    const stackedData = Object.values(periodMap);

    const summary = await Transaction.aggregate([
      { $match: match },
      {
        $group: {
          _id: { category: "$category", status: "$status" },
          total: { $sum: "$amount" }
        }
      }
    ]);

    const summaryTotals = {
      Total: { Revenue: 0, Expense: 0 },
      Paid: { Revenue: 0, Expense: 0 },
      Pending: { Revenue: 0, Expense: 0 }
    };

    summary.forEach(entry => {
        const cat = entry._id.category as "Revenue" | "Expense";
        const stat = entry._id.status as "Paid" | "Pending";
      summaryTotals.Total[cat] += entry.total;
      summaryTotals[stat][cat] += entry.total;
    });

    const detailedSummaryData = Object.entries(summaryTotals).map(([status, values]) => ({
      category: status,
      Revenue: values.Revenue,
      Expense: values.Expense
    }));
    res.json({ stackedData, detailedSummaryData });
  } catch (error) {
    console.error("Analytics error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getRecentTransactions = async (req: Request, res: Response) => {
  try {
    const transactions = await Transaction.find()
      .sort({ date: -1 }) // Most recent first
      .limit(3);

    res.status(200).json(transactions);
  } catch (error) {
    console.error("Error fetching recent transactions:", error);
    res.status(500).json({ message: "Failed to fetch recent transactions" });
  }
};