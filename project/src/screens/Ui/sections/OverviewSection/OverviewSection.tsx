import { useMemo, useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent } from "../../../../components/ui/card";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type Transaction = {
  _id: string;
  date: string;
  amount: number;
  category: "Revenue" | "Expense";
  status: string;
  user_id: string;
};

interface ChartPoint {
  name: string;
  Income: number;
  Expense: number;
}

type FilterType = "weekly" | "monthly" | "yearly";

const dummy: Transaction[] = [
  {
    _id: "1",
    date: "2025-06-25T10:00:00Z",
    amount: 120.5,
    category: "Revenue",
    status: "Paid",
    user_id: "user_001",
  },
  {
    _id: "2",
    date: "2025-06-24T09:00:00Z",
    amount: 45.0,
    category: "Expense",
    status: "Pending",
    user_id: "user_002",
  },
  {
    _id: "3",
    date: "2025-06-23T18:00:00Z",
    amount: 79.99,
    category: "Revenue",
    status: "Paid",
    user_id: "user_003",
  },
  {
    _id: "4",
    date: "2025-05-15T18:00:00Z",
    amount: 99.99,
    category: "Expense",
    status: "Paid",
    user_id: "user_004",
  },
  {
    _id: "5",
    date: "2025-01-10T18:00:00Z",
    amount: 150,
    category: "Revenue",
    status: "Paid",
    user_id: "user_005",
  },
];

const getFormattedDate = (dateStr: string, type: FilterType) => {
  const d = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions =
    type === "monthly"
      ? { month: "short" }
      : type === "weekly"
        ? { weekday: "short" }
        : { year: "numeric" };
  return d.toLocaleDateString("en-US", options);
};

export const OverviewSection = (): JSX.Element => {
  const [filter, setFilter] = useState<FilterType>("monthly");
  const [startDate, setStartDate] = useState<string>("2024-08-28");
  const [transactions, setTransactions] = useState<Transaction[]>(dummy);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = {
          filter,
          ...(startDate && { startDate }),
        };

        const token = localStorage.getItem("token");

        const response = await axios.get("http://localhost:3000/api/transaction/lineChart", {
          params,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const { transactions: fetched } = response.data;
        if (Array.isArray(fetched)) {
          setTransactions(fetched);
        }
      } catch (err) {
        console.error("Failed to fetch from API, using dummy data.", err);
        setTransactions(dummy);
      }
    };

    fetchData();
  }, [filter, startDate]);

  const chartData: ChartPoint[] = useMemo(() => {
    const grouped: Record<string, { income: number; expense: number }> = {};

    transactions.forEach((t) => {
      const key = getFormattedDate(t.date, filter);
      if (!grouped[key]) grouped[key] = { income: 0, expense: 0 };
      if (t.category === "Revenue") grouped[key].income += t.amount;
      else if (t.category === "Expense") grouped[key].expense += t.amount;
    });

    return Object.keys(grouped).map((key) => ({
      name: key,
      Income: grouped[key].income,
      Expense: grouped[key].expense,
    }));
  }, [transactions, filter]);

  return (
    <Card className="w-full bg-bgsec rounded-[8.33px] border-none">
      <CardContent className="p-4 md:p-6 relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap">
          <h3 className="font-medium text-white text-[15px]">Overview</h3>

          <div className="flex items-center gap-4">
            <select
              className="bg-[#1e1e1e] text-white text-xs px-2 py-1 rounded border border-[#383838]"
              value={filter}
              onChange={(e) => setFilter(e.target.value as FilterType)}
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>

            <input
              type="date"
              className="bg-[#1e1e1e] text-white text-xs px-2 py-1 rounded border border-[#383838]"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
        </div>


        {/* Chart */}
        <div className="w-full h-64">
          <ResponsiveContainer width="100%">
            <LineChart data={chartData}>
              <CartesianGrid stroke="#333" />
              <XAxis dataKey="name" stroke="#aaa" />
              <YAxis stroke="#aaa" />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="Income"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="Expense"
                stroke="#ffbf1d"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
