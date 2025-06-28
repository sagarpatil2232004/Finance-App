import { SearchIcon, Pencil, Trash2, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "../../../../components/ui/badge";
import { Card, CardContent } from "../../../../components/ui/card";
import { Input } from "../../../../components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../components/ui/table";
import moment from "moment";
import {
  getFilteredTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
} from "../../../../Api/api";

interface Transaction {
  _id: string;
  date: string;
  amount: number;
  category: "Revenue" | "Expense";
  status: "Paid" | "Pending";
  user_id: string;
}

export const TransactionsPageSection = (): JSX.Element => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [formData, setFormData] = useState<Transaction>({
    _id: "",
    user_id: "",
    amount: 0,
    date: "",
    category: "Revenue",
    status: "Paid",
  });

  const fetchTransactions = async () => {
    try {
      const res = await getFilteredTransactions({
        search: searchTerm,
        status: statusFilter,
        category: categoryFilter,
        from: fromDate,
        to: toDate,
      });
      setTransactions(res.data);
    } catch (error) {
      console.error("API fetch failed:", error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [searchTerm, statusFilter, categoryFilter, fromDate, toDate]);

  const getStatusStyles = (status: string) =>
    status === "Paid"
      ? { bg: "bg-[#1ecb4f4c]", text: "text-sec-100" }
      : { bg: "bg-[#ffbf1d4c]", text: "text-[#ffbf1d]" };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setFormData(transaction);
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("Are you sure you want to delete?");
    if (confirmDelete) {
      try {
        await deleteTransaction(id);
        await fetchTransactions();
      } catch (error) {
        console.error("Delete failed", error);
      }
    }
  };

  const handleFormSubmit = async () => {
    try {
      if (editingTransaction) {
        await updateTransaction(editingTransaction._id, formData);
      } else {
        const { _id, ...newData } = formData;
        await addTransaction(newData);
      }
      await fetchTransactions();
      setIsAdding(false);
      setEditingTransaction(null);
      setFormData({
        _id: "",
        user_id: "",
        amount: 0,
        date: "",
        category: "Revenue",
        status: "Paid",
      });
    } catch (error) {
      console.error("Form submit failed", error);
    }
  };

  const downloadCSV = () => {
    const headers = ["User ID", "Date", "Amount", "Category", "Status"];
    const rows = transactions.map((t) => [
      t.user_id,
      moment(t.date).format("YYYY-MM-DD"),
      t.amount,
      t.category,
      t.status,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((e) => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "transactions.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="w-full">
      <Card className="w-full bg-bgsec rounded-[10px] border-none">
        <CardContent className="p-4 md:p-7">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 lg:gap-6">
              <h2 className="font-semibold text-white text-xl md:text-2xl font-['Poppins',Helvetica]">
                Transactions
              </h2>
              <button
                onClick={() => {
                  setFormData({
                    _id: "",
                    user_id: "",
                    amount: 0,
                    date: "",
                    category: "Revenue",
                    status: "Paid",
                  });
                  setIsAdding(true);
                  setEditingTransaction(null);
                }}
                className="flex items-center gap-2 bg-sec-100 text-white px-3 py-1.5 rounded text-sm"
              >
                <Plus size={16} /> Add
              </button>
              <button
                onClick={downloadCSV}
                className="flex items-center gap-2 bg-sec-100 text-white px-3 py-1.5 rounded text-sm"
              >
                📥 Download CSV
              </button>
              <div className="relative w-full sm:w-[250px]">
                <Input
                  className="w-full h-[35px] bg-bgsec-2 rounded-[10px] pl-4 pr-10 text-xs text-[#8c89b4] border-none"
                  placeholder="Search user, status, category"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <SearchIcon className="absolute w-[15px] h-[15px] top-[10px] right-[14px] text-[#8c89b4]" />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <select
                className="text-xs text-white bg-bgsec-2 px-3 py-2 rounded border border-stroke"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Status</option>
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
              </select>
              <select
                className="text-xs text-white bg-bgsec-2 px-3 py-2 rounded border border-stroke"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="All">All Categories</option>
                <option value="Revenue">Revenue</option>
                <option value="Expense">Expense</option>
              </select>
              <input
                type="date"
                className="text-xs text-white bg-bgsec-2 px-3 py-2 rounded border border-stroke"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
              <input
                type="date"
                className="text-xs text-white bg-bgsec-2 px-3 py-2 rounded border border-stroke"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto overflow-y-scroll max-height: 500px" style={{ maxHeight: "450px" }}>
            <Table>
              <TableHeader className="bg-bgsec-2 rounded-[10px]">
                <TableRow className="border-none">
                  {["User ID", "Date", "Amount", "Category", "Status", "Actions"].map((h) => (
                    <TableHead key={h} className="font-['Poppins',Helvetica] text-[#8c89b4] text-sm">
                      {h}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((t) => {
                  const { bg, text } = getStatusStyles(t.status);
                  return (
                    <TableRow key={t._id} className="border-none">
                      <TableCell className="text-white text-sm">{t.user_id}</TableCell>
                      <TableCell className="text-white text-sm">{moment(t.date).format("DD MMM YYYY")}</TableCell>
                      <TableCell className={`font-semibold ${t.category === "Revenue" ? "text-sec-100" : "text-[#ffbf1d]"} text-sm`}>
                        {t.category === "Revenue" ? "+" : "-"}${t.amount.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-[#8c89b4] text-sm">{t.category}</TableCell>
                      <TableCell>
                        <Badge className={`${bg} ${text} text-xs px-3 py-1 rounded-[10px]`}>
                          {t.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="flex gap-2">
                        <button onClick={() => handleEdit(t)}>
                          <Pencil className="w-4 h-4 text-blue-400" />
                        </button>
                        <button onClick={() => handleDelete(t._id)}>
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {transactions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-[#8c89b4] text-sm py-6">
                      No matching transactions found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Modal */}
      {(isAdding || editingTransaction) && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-bgsec p-6 rounded-xl w-full max-w-md">
            <h3 className="text-white text-lg font-semibold mb-4">
              {editingTransaction ? "Edit Transaction" : "Add Transaction"}
            </h3>
            <div className="flex flex-col gap-3 text-white">
              <input
                className="bg-bgsec-2 rounded p-2"
                placeholder="User ID"
                value={formData.user_id}
                onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
              />
              <input
                className="bg-bgsec-2 rounded p-2"
                placeholder="Amount"
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
              />
              <input
                className="bg-bgsec-2 rounded p-2"
                placeholder="Date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
              <select
                className="bg-bgsec-2 rounded p-2"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
              >
                <option value="Revenue">Revenue</option>
                <option value="Expense">Expense</option>
              </select>
              <select
                className="bg-bgsec-2 rounded p-2"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              >
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => {
                  setIsAdding(false);
                  setEditingTransaction(null);
                }}
                className="px-4 py-1 rounded bg-red-500 text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleFormSubmit}
                className="px-4 py-1 rounded bg-green-500 text-white"
              >
                {editingTransaction ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
