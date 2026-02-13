import { useMemo, useState } from "react";
import { useApp as useAppData } from "../../../context/AppContext";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { CategoryPieChart, DailySpendingBar } from "./ExpenseCharts";
import {
  TrendingUp,
  Wallet,
  PieChart as PieChartIcon,
  Plus,
  Bell,
  ArrowUpRight,
  MoreVertical,
  CheckCircle2,
  Clock,
  Utensils,
  Home,
  Tv,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Dashboard = () => {
  const { expenses, categories, formatCurrency, goals } = useAppData();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showNotification, setShowNotification] = useState(false);

  // --- Stats Calculation ---
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const monthlyExpenses = useMemo(() => {
    return expenses.filter((expense) => {
      const date = new Date(expense.date);
      return (
        date.getMonth() === currentMonth && date.getFullYear() === currentYear
      );
    });
  }, [expenses, currentMonth, currentYear]);

  const totalSpentThisMonth = useMemo(() => {
    return monthlyExpenses.reduce((sum, item) => sum + item.amount, 0);
  }, [monthlyExpenses]);

  // Logic: Starting Balance ($50,000) - Total Expenses
  const totalBalance = useMemo(() => {
    const totalSpentEver = expenses.reduce((sum, e) => sum + e.amount, 0);
    return 50000 - totalSpentEver;
  }, [expenses]);

  // Savings Progress logic (Sum of all goals vs current total balances if we had deposits,
  // but for now let's use a percentage of the first target or a global one)
  const savingsProgress = useMemo(() => {
    const mainGoal = goals[0] || { target_amount: 50000 };
    const currentProgress = 50000 - totalBalance; // Just as a placeholder for actual savings logic
    return Math.min((currentProgress / mainGoal.target_amount) * 100, 100);
  }, [goals, totalBalance]);

  // --- Chart Data Preparation ---
  const categoryData = useMemo(() => {
    return categories
      .map((cat) => ({
        name: cat,
        value: monthlyExpenses
          .filter((e) => e.category === cat)
          .reduce((sum, e) => sum + e.amount, 0),
      }))
      .filter((item) => item.value > 0);
  }, [monthlyExpenses, categories]);

  const dailyData = useMemo(() => {
    const last6Months = [];
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = d.toLocaleString("default", { month: "short" });

      const monthlyTotal = expenses
        .filter((e) => {
          const ed = new Date(e.date);
          return (
            ed.getMonth() === d.getMonth() &&
            ed.getFullYear() === d.getFullYear()
          );
        })
        .reduce((sum, e) => sum + e.amount, 0);

      last6Months.push({
        date: monthName,
        amount: monthlyTotal,
      });
    }
    return last6Months;
  }, [expenses]);

  const recentTransactions = expenses.slice(0, 4);

  const getCategoryIcon = (category) => {
    const cat = (category || "").toLowerCase();
    if (cat.includes("food") || cat.includes("dining"))
      return <Utensils className="h-4 w-4" />;
    if (cat.includes("housing") || cat.includes("rent"))
      return <Home className="h-4 w-4" />;
    if (cat.includes("entertainment")) return <Tv className="h-4 w-4" />;
    return <DollarSign className="h-4 w-4" />;
  };

  return (
    <div className="space-y-8 pb-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Personal Dashboard
          </h1>
          <p className="text-slate-400">
            Welcome back,{" "}
            {user?.user_metadata?.full_name?.split(" ")[0] || "User"}!
          </p>
        </div>
        <div className="flex items-center gap-3 relative">
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              setShowNotification(true);
              setTimeout(() => setShowNotification(false), 3000);
            }}
            className="rounded-full bg-slate-800/50 border-slate-700 text-slate-300"
          >
            <Bell className="h-4 w-4" />
          </Button>
          {showNotification && (
            <div className="absolute top-12 right-0 bg-slate-800 border border-slate-700 text-white text-[10px] py-1 px-3 rounded-md shadow-xl z-50 animate-in fade-in zoom-in duration-200">
              No new notifications
            </div>
          )}
          <Button
            onClick={() => navigate("/expenses")}
            className="bg-cyan-400 hover:bg-cyan-500 text-slate-950 font-semibold gap-2"
          >
            <Plus className="h-4 w-4" /> Add Expense
          </Button>
        </div>
      </div>

      {/* Top Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-emerald-500/10 rounded-lg">
                <Wallet className="h-5 w-5 text-emerald-500" />
              </div>
              <div className="flex items-center gap-1 text-emerald-500 text-xs font-medium">
                <TrendingUp className="h-3 w-3" /> +12.5%
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-slate-400">Total Balance</p>
              <p className="text-2xl font-bold text-white">
                {formatCurrency(totalBalance)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <TrendingUp className="h-5 w-5 text-orange-500" />
              </div>
              <div className="flex items-center gap-1 text-orange-500 text-xs font-medium">
                <TrendingUp className="h-3 w-3" /> +4.2%
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-slate-400">Monthly Spending</p>
              <p className="text-2xl font-bold text-white">
                {formatCurrency(totalSpentThisMonth)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <PieChartIcon className="h-5 w-5 text-purple-500" />
              </div>
              <p className="text-xs text-slate-400">
                Goal: {formatCurrency(50000)}
              </p>
            </div>
            <div className="space-y-3">
              <div className="space-y-1">
                <p className="text-sm text-slate-400">Savings Progress</p>
                <p className="text-2xl font-bold text-white">
                  {savingsProgress.toFixed(1)}%
                </p>
              </div>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-cyan-400 rounded-full"
                  style={{ width: `${savingsProgress}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Spending Categories */}
        <Card className="lg:col-span-2 bg-slate-900/50 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-white text-lg font-semibold">
                Spending Categories
              </CardTitle>
              <CardDescription className="text-slate-500">
                This Month
              </CardDescription>
            </div>
            <select className="bg-transparent border-none text-xs text-slate-400 focus:ring-0">
              <option>This Month</option>
            </select>
          </CardHeader>
          <CardContent>
            <CategoryPieChart
              data={categoryData}
              currencyFormatter={formatCurrency}
            />
            <div className="mt-4 space-y-3">
              {categoryData.slice(0, 3).map((item, i) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full`}
                      style={{
                        backgroundColor: ["#22d3ee", "#f87171", "#a855f7"][
                          i % 3
                        ],
                      }}
                    />
                    <span className="text-slate-400">{item.name}</span>
                  </div>
                  <span className="text-white font-medium">
                    {formatCurrency(item.value)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Monthly Trends */}
        <Card className="lg:col-span-3 bg-slate-900/50 border-slate-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white text-lg font-semibold">
                  Monthly Trends
                </CardTitle>
                <CardDescription className="text-slate-500">
                  Income vs Expenses over 6 months
                </CardDescription>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-cyan-400" />
                  <span className="text-slate-400">Income</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-orange-500" />
                  <span className="text-slate-400">Expenses</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <DailySpendingBar
              data={dailyData}
              currencyFormatter={formatCurrency}
            />
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-white text-lg font-semibold">
            Recent Expenses
          </CardTitle>
          <Button
            variant="link"
            className="text-cyan-400 hover:text-cyan-300 text-sm"
          >
            View All
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-slate-500 uppercase tracking-wider border-b border-slate-800">
                  <th className="pb-4 font-medium">Date</th>
                  <th className="pb-4 font-medium">Merchant / Category</th>
                  <th className="pb-4 font-medium">Amount</th>
                  <th className="pb-4 font-medium">Status</th>
                  <th className="pb-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {recentTransactions.map((tx) => (
                  <tr
                    key={tx.id}
                    className="text-sm group hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="py-4">
                      <div className="text-slate-300">
                        {new Date(tx.date).toLocaleDateString()}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {new Date(tx.date).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-800 rounded-lg text-emerald-400">
                          {getCategoryIcon(tx.category)}
                        </div>
                        <div>
                          <div className="text-white font-medium">
                            {tx.description || "Expense"}
                          </div>
                          <div className="text-xs text-slate-500">
                            {tx.category}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 font-medium text-slate-300">
                      -{formatCurrency(tx.amount)}
                    </td>
                    <td className="py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-500">
                        Completed
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-500 hover:text-white"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
