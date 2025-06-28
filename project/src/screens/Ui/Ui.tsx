import { useState,useEffect } from "react";
import { Card, CardContent } from "../../components/ui/card";
import { HeaderSection } from "./sections/HeaderSection/HeaderSection";
import { OverviewSection } from "./sections/OverviewSection";
import { RecentTransactionsSection } from "./sections/RecentTransactionsSection";
import { SidebarSection } from "./sections/SidebarSection";
import { TransactionsSection } from "./sections/TransactionsSection";
import {
  getTotalExpense,
  getTotalRevenue,
  getBalance,
} from "../../Api/api";

export const Ui = (): JSX.Element => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [summary, setSummary] = useState({
    balance: 0,
    revenue: 0,
    expense: 0,
    savings: 0,
  });

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const [balanceRes, revenueRes, expenseRes] = await Promise.all([
          getBalance(),
          getTotalRevenue(),
          getTotalExpense(),
        ]);

        const balance = balanceRes.data.balance || 0;
        const revenue = revenueRes.data.totalRevenue || 0;
        const expense = expenseRes.data.totalExpense || 0;
        const savings = balance - expense; // or however you define savings

        setSummary({ balance, revenue, expense, savings });
      } catch (err) {
        console.error("Failed to fetch financial summary:", err);
      }
    };

    fetchSummary();
  }, []);
const financialCards = [
  {
    title: "Balance",
    amount: `$${summary.balance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    icon: <i className="fas fa-wallet text-green-500 text-lg" />,
  },
  {
    title: "Revenue",
    amount: `$${summary.revenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    icon: <i className="fas fa-money-bill-wave text-green-500 text-lg" />,
  },
  {
    title: "Expenses",
    amount: `$${summary.expense.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    icon: <i className="fas fa-credit-card text-green-500 text-lg" />,
  },
  {
    title: "Savings",
    amount: `$${summary.balance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    icon: <i className="fas fa-piggy-bank text-green-500 text-lg" />,
  },
];




  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#282b35] flex">
      {/* Sidebar */}
      <SidebarSection isOpen={isMobileMenuOpen} onClose={closeMobileMenu} />

      {/* Main content area */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Header */}
        <HeaderSection
          onMenuToggle={toggleMobileMenu}
          isMobileMenuOpen={isMobileMenuOpen}
        />

        {/* Main content */}
        <main className="flex-1 p-4 md:p-6 space-y-4 md:space-y-6 overflow-x-hidden">
          {/* Financial summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {financialCards.map((card, index) => (
              <Card
                key={index}
                className="bg-bgsec rounded-[8.33px] border-none hover:bg-bgsec/80 transition-colors"
              >
                <CardContent className="p-4 flex items-center space-x-4">
                  <div className="w-10 h-10 bg-bgsec-2 rounded-[8.33px] flex items-center justify-center flex-shrink-0">
                    {card.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-['Poppins',Helvetica] font-normal text-[#9e9e9e] text-[11.7px] truncate">
                      {card.title}
                    </p>
                    <p className="font-['Poppins',Helvetica] font-medium text-white text-lg md:text-[26.6px] truncate">
                      {card.amount}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Overview and Recent Transactions */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6">
            <div className="xl:col-span-2">
              <OverviewSection />
            </div>
            <div className="xl:col-span-1">
              <RecentTransactionsSection />
            </div>
          </div>

          {/* Transactions section */}
          <div className="overflow-x-auto">
            <TransactionsSection />
          </div>
        </main>
      </div>
    </div>
  );
};
