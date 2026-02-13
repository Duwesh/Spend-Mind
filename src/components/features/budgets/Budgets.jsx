import { useState } from "react";
import { useApp } from "../../../context/AppContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Wallet,
  Target,
  TrendingUp,
  AlertCircle,
  Pencil,
  Check,
  X,
  CreditCard,
} from "lucide-react";
import { cn } from "@/lib/utils";

const Budgets = () => {
  const { categoriesRaw, expenses, formatCurrency, updateLimit } = useApp();
  const [editingId, setEditingId] = useState(null);
  const [tempLimit, setTempLimit] = useState("");

  const categoriesWithSpending = categoriesRaw.map((cat) => {
    const spent = expenses
      .filter((e) => e.category_name === cat.name)
      .reduce((sum, e) => sum + e.amount, 0);

    const percentage =
      cat.budget_limit > 0 ? (spent / cat.budget_limit) * 100 : 0;
    const remaining = cat.budget_limit - spent;

    return {
      ...cat,
      spent,
      percentage,
      remaining,
    };
  });

  const handleEdit = (cat) => {
    setEditingId(cat.id);
    setTempLimit(cat.budget_limit.toString());
  };

  const handleSave = async (categoryName) => {
    const limitNum = parseFloat(tempLimit);
    if (!isNaN(limitNum)) {
      await updateLimit(categoryName, limitNum);
    }
    setEditingId(null);
  };

  const totalBudget = categoriesRaw.reduce(
    (sum, cat) => sum + (cat.budget_limit || 0),
    0,
  );
  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const overallPercentage =
    totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white font-outfit">
          Budget Management
        </h1>
        <p className="text-slate-400">
          Set limits and track your spending efficiency.
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-cyan-500/10 rounded-lg">
                <Wallet className="h-5 w-5 text-cyan-500" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-slate-400">Total Budget</p>
              <p className="text-2xl font-bold text-white">
                {formatCurrency(totalBudget)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <CreditCard className="h-5 w-5 text-orange-500" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-slate-400">Total Spent</p>
              <p className="text-2xl font-bold text-white">
                {formatCurrency(totalSpent)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <TrendingUp className="h-5 w-5 text-purple-500" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-slate-400">Overall Usage</p>
              <p className="text-2xl font-bold text-white">
                {overallPercentage.toFixed(1)}%
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Budgets Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {categoriesWithSpending.map((cat) => (
          <Card
            key={cat.id}
            className="bg-slate-900/50 border-slate-800 hover:border-slate-700 transition-colors"
          >
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-800 rounded-lg">
                    <Target className="h-4 w-4 text-cyan-400" />
                  </div>
                  <div>
                    <CardTitle className="text-white text-base">
                      {cat.name}
                    </CardTitle>
                    <CardDescription className="text-slate-500 text-xs">
                      Monthly Limit
                    </CardDescription>
                  </div>
                </div>

                {editingId === cat.id ? (
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={tempLimit}
                      onChange={(e) => setTempLimit(e.target.value)}
                      className="w-24 h-8 bg-slate-800 border-slate-700 text-white text-sm"
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-emerald-500"
                      onClick={() => handleSave(cat.name)}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-rose-500"
                      onClick={() => setEditingId(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    <span className="text-white font-bold">
                      {formatCurrency(cat.budget_limit)}
                    </span>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-slate-500 hover:text-white"
                      onClick={() => handleEdit(cat)}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">
                    Spent: {formatCurrency(cat.spent)}
                  </span>
                  <span
                    className={cn(
                      "font-medium",
                      cat.percentage > 100
                        ? "text-rose-500"
                        : cat.percentage > 85
                          ? "text-orange-500"
                          : "text-emerald-500",
                    )}
                  >
                    {cat.percentage.toFixed(1)}%
                  </span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full transition-all duration-500 rounded-full",
                      cat.percentage > 100
                        ? "bg-rose-500"
                        : cat.percentage > 85
                          ? "bg-orange-500"
                          : "bg-cyan-400",
                    )}
                    style={{ width: `${Math.min(cat.percentage, 100)}%` }}
                  />
                </div>
              </div>

              {cat.percentage > 100 && (
                <div className="flex items-center gap-2 text-[10px] text-rose-500 bg-rose-500/10 p-2 rounded-lg border border-rose-500/20">
                  <AlertCircle className="h-3 w-3" />
                  Budget exceeded by {formatCurrency(Math.abs(cat.remaining))}
                </div>
              )}

              <div className="flex justify-between items-center text-[10px] text-slate-500">
                <span>
                  Remaining: {formatCurrency(Math.max(0, cat.remaining))}
                </span>
                <span className="text-slate-600 italic">
                  Resets on 1st of next month
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Budgets;
