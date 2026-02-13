import { useMemo } from "react";
import { useApp } from "../../../context/AppContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { CategoryPieChart, DailySpendingBar } from "./ExpenseCharts";
import {
  AlertTriangle,
  TrendingUp,
  Wallet,
  PieChart as PieChartIcon,
} from "lucide-react";

const Dashboard = () => {
  const { expenses, budgetLimits, categories, formatCurrency } = useApp();

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

  const totalBudget = useMemo(() => {
    return Object.values(budgetLimits).reduce((sum, limit) => sum + limit, 0);
  }, [budgetLimits]);

  const budgetProgress =
    totalBudget > 0 ? (totalSpentThisMonth / totalBudget) * 100 : 0;

  // --- Chart Data Preparation ---
  const categoryData = useMemo(() => {
    const data = categories
      .map((cat) => ({
        name: cat,
        value: monthlyExpenses
          .filter((e) => e.category === cat)
          .reduce((sum, e) => sum + e.amount, 0),
      }))
      .filter((item) => item.value > 0);
    return data;
  }, [monthlyExpenses, categories]);

  const dailyData = useMemo(() => {
    const data = {};
    monthlyExpenses.forEach((expense) => {
      const day = new Date(expense.date).getDate();
      data[day] = (data[day] || 0) + expense.amount;
    });
    return Object.keys(data)
      .sort((a, b) => parseInt(a) - parseInt(b))
      .map((day) => ({
        date: `Day ${day}`,
        amount: data[day],
      }));
  }, [monthlyExpenses]);

  // --- Warnings Logic ---
  const warnings = useMemo(() => {
    return categories
      .map((cat) => {
        const limit = budgetLimits[cat] || 0;
        if (limit === 0) return null;

        const spent = monthlyExpenses
          .filter((e) => e.category === cat)
          .reduce((sum, e) => sum + e.amount, 0);

        if (spent > limit) {
          return { category: cat, spent, limit, type: "exceeded" };
        }
        if (spent > limit * 0.9) {
          return { category: cat, spent, limit, type: "warning" };
        }
        return null;
      })
      .filter(Boolean);
  }, [categories, budgetLimits, monthlyExpenses]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">
          {new Date().toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}{" "}
          Overview
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="relative overflow-hidden group hover:border-blue-500/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Spent
            </CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalSpentThisMonth)}
            </div>
            <div className="mt-4 h-1.5 w-full bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-1000"
                style={{ width: `${Math.min(budgetProgress, 100)}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden group hover:border-emerald-500/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Monthly Budget
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalBudget > 0 ? formatCurrency(totalBudget) : "Not Set"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Total of all category limits
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden group hover:border-purple-500/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Remaining
            </CardTitle>
            <PieChartIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${totalBudget - totalSpentThisMonth < 0 ? "text-destructive" : "text-emerald-500"}`}
            >
              {totalBudget > 0
                ? formatCurrency(totalBudget - totalSpentThisMonth)
                : "-"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Safe to spend</p>
          </CardContent>
        </Card>
      </div>

      {/* Warnings Section */}
      {warnings.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <AlertTriangle className="text-amber-500" />
            Budget Alerts
          </h3>
          <div className="grid gap-4">
            {warnings.map((warn) => (
              <div
                key={warn.category}
                className={`p-4 rounded-xl border flex items-center justify-between ${
                  warn.type === "exceeded"
                    ? "bg-destructive/10 border-destructive/20 text-destructive"
                    : "bg-amber-500/10 border-amber-500/20 text-amber-500"
                }`}
              >
                <div className="flex items-center gap-3">
                  <AlertTriangle size={20} />
                  <div>
                    <span className="font-bold">{warn.category}</span>
                    <span className="mx-2 opacity-60">|</span>
                    <span className="opacity-90">
                      {warn.type === "exceeded"
                        ? `Exceeded limit of ${formatCurrency(warn.limit)}`
                        : `Approaching limit of ${formatCurrency(warn.limit)}`}
                    </span>
                  </div>
                </div>
                <div className="font-bold">{formatCurrency(warn.spent)}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Spending by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <CategoryPieChart
              data={categoryData}
              currencyFormatter={formatCurrency}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Daily Spending Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <DailySpendingBar
              data={dailyData}
              currencyFormatter={formatCurrency}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
