import express from 'express';
import {addTransaction,getTransactions,getTotalRevenue,getTotalExpense,getBalance,getFilteredTransactions,getLineChart,getAnalytics,getRecentTransactions,updateTransaction,deleteTransaction} from '../controllers/transaction.controller';


const router = express.Router();

router.post('/add', addTransaction );
router.get('/getAll', getTransactions );

router.get('/totalExpense', getTotalExpense );
router.get('/totalRevenue', getTotalRevenue);
router.get("/balance",getBalance);
// router.get('/pendingExpense',getPendingExpense);
// router.get('/pendingRevenue',getPendingRevenue);
router.get('/filteredTransactions',getFilteredTransactions);
router.get("/lineChart",getLineChart );
router.get("/analytics",getAnalytics );
router.get('/recent', getRecentTransactions); 
router.post("/add", addTransaction);
router.put("/update/:id", updateTransaction);
router.delete("/delete/:id", deleteTransaction);
export default router;