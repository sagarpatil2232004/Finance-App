import React, { useEffect, useState } from "react";
import { Avatar, AvatarImage } from "../../../../components/ui/avatar";
import { Card, CardContent, CardHeader } from "../../../../components/ui/card";
import { Separator } from "../../../../components/ui/separator";
// import axios from "axios";
import moment from "moment";
import { getRecentTransactions } from "../../../../Api/api";

interface Transaction {
  _id: string;
  date: string;
  amount: number;
  category: "Revenue" | "Expense" | string;
  status: "Paid" | "Pending" | string;
  user_id: string;
}

export const RecentTransactionsSection = (): JSX.Element => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
//   const dummyTransactions = [
//   {
//     _id: "1",
//     date: new Date("2025-06-25T10:00:00Z").toISOString(),
//     amount: 120.5,
//     category: "Revenue",
//     status: "Paid",
//     user_id: "user_001"
//   },
//   {
//     _id: "2",
//     date: new Date("2025-06-24T14:30:00Z").toISOString(),
//     amount: 50.0,
//     category: "Expense",
//     status: "Pending",
//     user_id: "user_002"
//   },
//   {
//     _id: "3",
//     date: new Date("2025-06-23T18:45:00Z").toISOString(),
//     amount: 75.25,
//     category: "Revenue",
//     status: "Paid",
//     user_id: "user_003"
//   },
  
// ];

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await getRecentTransactions();
        console.log("recent",res.data);
        setTransactions(res.data);

      } catch (err) {
        console.error("Failed to fetch transactions:", err);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <Card className="bg-bgsec rounded-[8.33px] border-none h-fit">
      <CardHeader className="flex flex-row items-center justify-between py-4 px-3.5">
        <h3 className="font-medium text-white text-[15px] font-['Poppins',Helvetica]">
          Recent Transactions
        </h3>
      </CardHeader>
      <CardContent className="px-3.5 pb-4 pt-0 space-y-4">
        {transactions.map((transaction, index) => (
          <React.Fragment key={transaction._id}>
            <div className="flex justify-between items-center">
              <div className="flex items-start">
                <Avatar className="w-[35px] h-[35px] rounded-[6.66px]">
                  <AvatarImage
                    src="/photo.svg" // Optional: replace with user-specific photo
                    alt={transaction.user_id}
                    className="object-cover"
                  />
                </Avatar>
                <div className="ml-3">
                  <p className="font-normal text-[#9e9e9e] text-[10px] tracking-[-0.20px] font-['Poppins',Helvetica]">
                    {transaction.category === "Revenue" ? "Received from" : "Sent to"}
                  </p>
                  <p className="font-medium text-white text-[16px] tracking-[-0.23px] font-['Poppins',Helvetica]">
                     {transaction.user_id}
                  </p>
                  <p className="font-normal text-[10px] text-[#a0a0a0] font-['Poppins']">
                    {moment(transaction.date).format("DD MMM YYYY")}
                  </p>
                </div>
              </div>
              <div
                className={`font-medium ${
                  transaction.category === "Revenue"
                    ? "text-sec-100"
                    : "text-[#ffbf1d]"
                } text-[11.7px] text-right tracking-[-0.23px] font-['Poppins',Helvetica]`}
              >
                {transaction.category === "Revenue" ? "+" : "-"}${transaction.amount.toFixed(2)}
              </div>
            </div>
            {index < transactions.length - 1 && (
              <Separator className="bg-stroke h-px" />
            )}
          </React.Fragment>
        ))}
      </CardContent>
    </Card>
  );
};
