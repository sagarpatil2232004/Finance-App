import { SearchIcon } from "lucide-react";
import  { useEffect, useState } from "react";
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
import { getFilteredTransactions } from "../../../../Api/api";

interface Transaction {
  _id: string;
  date: string;
  amount: number;
  category: "Revenue" | "Expense";
  status: "Paid" | "Pending";
  user_id: string;
}

export const TransactionsSection = (): JSX.Element => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");



  const getStatusStyles = (status: string) => {
    return status === "Paid"
      ? { bg: "bg-[#1ecb4f4c]", text: "text-sec-100" }
      : { bg: "bg-[#ffbf1d4c]", text: "text-[#ffbf1d]" };
  };

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
      console.error("API fetch failed, using dummy data.");
    }
  };

  useEffect(() => {
    fetchTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, statusFilter, categoryFilter, fromDate, toDate]);

const filteredTransactions = Array.isArray(transactions)
  ? transactions.filter((t) => {
      const lowerSearch = searchTerm.toLowerCase();
      const matchSearch =
        t.user_id.toLowerCase().includes(lowerSearch) ||
        t.status.toLowerCase().includes(lowerSearch) ||
        t.category.toLowerCase().includes(lowerSearch);

      const matchStatus = statusFilter === "All" || t.status === statusFilter;
      const matchCategory = categoryFilter === "All" || t.category === categoryFilter;

      const matchDate =
        (!fromDate || moment(t.date).isSameOrAfter(fromDate)) &&
        (!toDate || moment(t.date).isSameOrBefore(toDate));

      return matchSearch && matchStatus && matchCategory && matchDate;
    })
  : [];


  return (
    <section className="w-full">
      <Card className="w-full bg-bgsec rounded-[10px] border-none">
        <CardContent className="p-4 md:p-7">
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 lg:gap-6">
              <h2 className="font-semibold text-white text-xl md:text-2xl font-['Poppins',Helvetica]">
                Transactions
              </h2>
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

          {/* Table Section */}
          <div className="overflow-x-auto overflow-y-scroll max-height: 500px" style={{maxHeight:"450px"}}>
            <Table>
              <TableHeader className="bg-bgsec-2 rounded-[10px]">
                <TableRow className="border-none">
                  {["User ID", "Date", "Amount", "Category", "Status"].map((h) => (
                    <TableHead
                      key={h}
                      className="font-['Poppins',Helvetica] text-[#8c89b4] text-sm"
                    >
                      {h}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((t) => {
                  const { bg, text } = getStatusStyles(t.status);
                  return (
                    <TableRow key={t._id} className="border-none">
                      <TableCell className="text-white text-sm">{t.user_id}</TableCell>
                      <TableCell className="text-white text-sm">
                        {moment(t.date).format("DD MMM YYYY")}
                      </TableCell>
                      <TableCell
                        className={`font-semibold ${
                          t.category === "Revenue" ? "text-sec-100" : "text-[#ffbf1d]"
                        } text-sm`}
                      >
                        {t.category === "Revenue" ? "+" : "-"}${t.amount.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-[#8c89b4] text-sm">{t.category}</TableCell>
                      <TableCell>
                        <Badge className={`${bg} ${text} text-xs px-3 py-1 rounded-[10px]`}>
                          {t.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {filteredTransactions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-[#8c89b4] text-sm py-6">
                      No matching transactions found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};
