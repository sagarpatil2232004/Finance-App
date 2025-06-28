"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecentTransactions = exports.getAnalytics = exports.getLineChart = exports.getFilteredTransactions = exports.getBalance = exports.getTotalExpense = exports.getTotalRevenue = exports.getTransactions = exports.deleteTransaction = exports.updateTransaction = exports.addTransaction = void 0;
const transactionSchema_1 = __importDefault(require("../model/transactionSchema"));
const addTransaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { date, amount, category, status, user_id } = req.body;
    if (!date || !amount || !category || !status || !user_id) {
        res.status(400).json({ message: "All fields are required" });
        return;
    }
    try {
        const newTransaction = new transactionSchema_1.default({ date, amount, category, status, user_id });
        yield newTransaction.save();
        res.status(201).json(newTransaction);
    }
    catch (error) {
        res.status(500).json({ message: "Error adding transaction", error });
    }
});
exports.addTransaction = addTransaction;
// PUT /api/transaction/:id
const updateTransaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updated = yield transactionSchema_1.default.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        if (!updated) {
            res.status(404).json({ error: "Not found" });
            return;
        }
        res.status(200).json(updated);
    }
    catch (err) {
        res.status(400).json({ error: "Update failed" });
    }
});
exports.updateTransaction = updateTransaction;
// DELETE /api/transaction/:id
const deleteTransaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deleted = yield transactionSchema_1.default.findByIdAndDelete(req.params.id);
        if (!deleted) {
            res.status(404).json({ error: "Not found" });
            return;
        }
        res.status(200).json({ message: "Deleted successfully" });
    }
    catch (err) {
        res.status(400).json({ error: "Delete failed" });
    }
});
exports.deleteTransaction = deleteTransaction;
const getTransactions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch all transactions from DB
        const transactions = yield transactionSchema_1.default.find();
        // Send as JSON
        res.status(200).json({
            success: true,
            data: transactions,
        });
    }
    catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
});
exports.getTransactions = getTransactions;
// Total Revenue (All statuses)
const getTotalRevenue = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const totalRevenue = yield transactionSchema_1.default.aggregate([
            { $match: { category: "Revenue" } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);
        res.status(200).json({
            success: true,
            totalRevenue: ((_a = totalRevenue[0]) === null || _a === void 0 ? void 0 : _a.total) || 0,
        });
    }
    catch (error) {
        console.error('Error calculating total revenue:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
});
exports.getTotalRevenue = getTotalRevenue;
// Total Expense (All statuses)
const getTotalExpense = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const totalExpense = yield transactionSchema_1.default.aggregate([
            { $match: { category: "Expense" } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);
        res.status(200).json({
            success: true,
            totalExpense: ((_a = totalExpense[0]) === null || _a === void 0 ? void 0 : _a.total) || 0,
        });
    }
    catch (error) {
        console.error('Error calculating total expense:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
});
exports.getTotalExpense = getTotalExpense;
// Balance = Revenue - Expense (All statuses)
const getBalance = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [revenueAgg] = yield transactionSchema_1.default.aggregate([
            { $match: { category: "Revenue" } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);
        const [expenseAgg] = yield transactionSchema_1.default.aggregate([
            { $match: { category: "Expense" } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);
        const revenue = (revenueAgg === null || revenueAgg === void 0 ? void 0 : revenueAgg.total) || 0;
        const expense = (expenseAgg === null || expenseAgg === void 0 ? void 0 : expenseAgg.total) || 0;
        res.status(200).json({
            success: true,
            balance: revenue - expense,
        });
    }
    catch (error) {
        console.error('Error calculating balance:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
});
exports.getBalance = getBalance;
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
const getFilteredTransactions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { search, status, category, from, to } = req.query;
        const query = {};
        if (search) {
            const regex = new RegExp(search, 'i'); // case-insensitive
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
            if (from)
                query.date.$gte = new Date(from);
            if (to)
                query.date.$lte = new Date(to);
        }
        const transactions = yield transactionSchema_1.default.find(query).sort({ date: -1 });
        res.status(200).json(transactions);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch transactions", error });
    }
});
exports.getFilteredTransactions = getFilteredTransactions;
const getLineChart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { filter, startDate } = req.query;
        // Assign default value to filter if not provided
        if (!filter)
            filter = "monthly";
        const now = new Date();
        let fromDate;
        // If startDate is provided, use it
        if (startDate) {
            fromDate = new Date(startDate);
            if (isNaN(fromDate.getTime())) {
                res.status(400).json({ error: "Invalid startDate format" });
                return;
            }
        }
        else {
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
        const transactions = yield transactionSchema_1.default.find({
            date: { $gte: fromDate },
        }).sort({ date: 1 });
        res.status(200).json({ transactions });
        return;
    }
    catch (error) {
        console.error("Error in /overview:", error);
        res.status(500).json({ error: "Internal Server Error" });
        return;
    }
});
exports.getLineChart = getLineChart;
function getGroupFormat(filter) {
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
const getAnalytics = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { filter = "Monthly", startDate } = req.query;
        if (!startDate) {
            res.status(400).json({ error: "Missing startDate" });
            return;
        }
        const { format } = getGroupFormat(filter);
        const start = new Date(startDate);
        const match = { date: { $gte: start } };
        const grouped = yield transactionSchema_1.default.aggregate([
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
        const periodMap = {};
        grouped.forEach(entry => {
            const key = entry.period;
            if (!periodMap[key]) {
                periodMap[key] = { month: key, paid: 0, pending: 0 };
            }
            if (entry.status === "Paid")
                periodMap[key].paid += entry.total;
            else if (entry.status === "Pending")
                periodMap[key].pending += entry.total;
        });
        const stackedData = Object.values(periodMap);
        const summary = yield transactionSchema_1.default.aggregate([
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
            const cat = entry._id.category;
            const stat = entry._id.status;
            summaryTotals.Total[cat] += entry.total;
            summaryTotals[stat][cat] += entry.total;
        });
        const detailedSummaryData = Object.entries(summaryTotals).map(([status, values]) => ({
            category: status,
            Revenue: values.Revenue,
            Expense: values.Expense
        }));
        res.json({ stackedData, detailedSummaryData });
    }
    catch (error) {
        console.error("Analytics error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.getAnalytics = getAnalytics;
const getRecentTransactions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transactions = yield transactionSchema_1.default.find()
            .sort({ date: -1 }) // Most recent first
            .limit(3);
        res.status(200).json(transactions);
    }
    catch (error) {
        console.error("Error fetching recent transactions:", error);
        res.status(500).json({ message: "Failed to fetch recent transactions" });
    }
});
exports.getRecentTransactions = getRecentTransactions;
