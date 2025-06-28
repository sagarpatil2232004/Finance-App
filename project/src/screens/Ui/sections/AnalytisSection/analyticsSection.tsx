import { useEffect, useRef, useState } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useTheme } from "next-themes";
import { getAnalyticsData } from "../../../../Api/api";

interface StackedChartData {
    month: string;
    paid: number;
    pending: number;
}

interface SummaryData {
    category: string;
    Revenue: number;
    Expense: number;
}

export const AnalyticsSection = (): JSX.Element => {
    const chartRef = useRef<HTMLDivElement>(null);
    const { theme } = useTheme();
    const isDarkMode = theme === "dark";

    const [filter, setFilter] = useState<"Weekly" | "Monthly" | "Yearly">("Monthly");

    // ✅ Initialize with today’s date in YYYY-MM-DD format
    const [startDate, setStartDate] = useState<string>(() => {
        const today = new Date("2024-01-01");
        return today.toISOString().split("T")[0];
    });

    const [stackedData, setStackedData] = useState<StackedChartData[]>([]);
    const [detailedSummaryData, setDetailedSummaryData] = useState<SummaryData[]>([]);

    const chartColors = {
        paid: isDarkMode ? "#10b981" : "#4caf50",
        pending: isDarkMode ? "#f59e0b" : "#ff9800",
        revenue: isDarkMode ? "#3b82f6" : "#1976d2",
        expense: isDarkMode ? "#ec4899" : "#d81b60"
    };

    const handleDownloadPDF = () => {
        if (!chartRef.current) return;
        html2canvas(chartRef.current).then((canvas) => {
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("p", "mm", "a4");
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
            pdf.save("charts.pdf");
        });
    };

    useEffect(() => {
        console.log("Effect triggered: ", { filter, startDate });

        if (!startDate) {
            console.log("No startDate, skipping fetch");
            return;
        }

        const fetchData = async () => {
            console.log("fetchData is called");

            try {
                

       const res = await getAnalyticsData(filter, startDate);
                setStackedData(res.data.stackedData);
                setDetailedSummaryData(res.data.detailedSummaryData);
            } catch (err) {
                console.error("Failed to fetch analytics data", err);
            }
        };

        fetchData();
    }, [filter, startDate]);

    return (
        <div className="p-6 space-y-6" ref={chartRef}>
            {/* Filter UI */}
            <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                    <label className="text-sm font-medium">Filter:</label>
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value as any)}
                        className="bg-[#1e1e1e] text-white text-xs px-2 py-1 rounded border border-[#383838]"
                    >
                        <option value="Weekly">Weekly</option>
                        <option value="Monthly">Monthly</option>
                        <option value="Yearly">Yearly</option>
                    </select>
                </div>

                <div className="flex items-center gap-2">
                    <label className="text-sm font-medium">Start Date:</label>
                    <input
                        type="date"
                        className="bg-[#1e1e1e] text-white text-xs px-2 py-1 rounded border border-[#383838]"
                        value={startDate}
                        onChange={(e) => {
                            console.log("Date changed to:", e.target.value);
                            setStartDate(e.target.value);
                        }}
                    />
                </div>

                <button
                    onClick={handleDownloadPDF}
                    className="ml-auto bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Download All Charts as PDF
                </button>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border rounded-xl p-4 shadow-md dark:bg-[#1e1e1e]">
                    <h2 className="text-xl text-white font-bold mb-2">Paid vs Pending Revenue</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={stackedData}>
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="paid" stackId="a" fill={chartColors.paid} />
                            <Bar dataKey="pending" stackId="a" fill={chartColors.pending} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="border rounded-xl p-4 shadow-md dark:bg-[#1e1e1e]">
                    <h2 className="text-xl text-white font-bold mb-2">Paid vs Pending Expenses</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={stackedData}>
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="paid" stackId="a" fill={chartColors.paid} />
                            <Bar dataKey="pending" stackId="a" fill={chartColors.pending} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="border rounded-xl p-4 shadow-md dark:bg-[#1e1e1e] md:col-span-2">
                    <h2 className="text-xl text-white font-bold mb-2">Detailed Financial Summary</h2>
                    <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={detailedSummaryData}>
                            <XAxis dataKey="category" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="Revenue" fill={chartColors.revenue} />
                            <Bar dataKey="Expense" fill={chartColors.expense} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};
