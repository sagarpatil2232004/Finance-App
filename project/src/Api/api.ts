import axios from 'axios'

const API = axios.create({ baseURL: 'https://finance-app-buib.onrender.com'});

const token = localStorage.getItem("token");

const accessHeader = {
    headers: {
        Authorization: `Bearer ${token}`,
    },
}

interface Transaction {
  _id: string;
  date: string;
  amount: number;
  category: "Revenue" | "Expense";
  status: "Paid" | "Pending";
  user_id: string;
}


export const loginUser = (formData:{user_id: string,password: string}) => API.post('/api/auth/login', formData);

export const register = (formData:{user_id: string,password: string}) => API.post('/api/auth/register', formData);


// Transaction route
export const getFilteredTransactions = (filters: {
  search?: string;
  status?: string;
  category?: string;
  from?: string;
  to?: string;
}) =>
  API.get("/api/transaction/filteredTransactions", {
    params: {
      search: filters.search || undefined,
      status: filters.status !== "All" ? filters.status : undefined,
      category: filters.category !== "All" ? filters.category : undefined,
      from: filters.from || undefined,
      to: filters.to || undefined,
    },
    ...accessHeader,
  });

  export const getAnalyticsData = (filter: string, startDate: string) =>
  API.get('/api/transaction/analytics', {
    params: { filter, startDate }, ...accessHeader
  });

  export const getRecentTransactions = () =>
  API.get("/api/transaction/recent",accessHeader);

  export const getTotalExpense = () =>
  API.get("/api/transaction/totalExpense", accessHeader);

export const getTotalRevenue = () =>
  API.get("/api/transaction/totalRevenue", accessHeader);

export const getBalance = () =>
  API.get("/api/transaction/balance", accessHeader);

export const addTransaction = (transaction: Omit<Transaction, "_id">) =>
  API.post("/api/transaction/add", transaction, accessHeader);

export const updateTransaction = (id: string, transaction: Partial<Transaction>) =>
  API.put(`/api/transaction/update/${id}`, transaction, accessHeader);

export const deleteTransaction = (id: string) =>
  API.delete(`/api/transaction/delete/${id}`, accessHeader);
