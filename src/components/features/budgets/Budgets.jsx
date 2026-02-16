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
        <h1 className="text-2xl font-bold tracking-tight text-foreground font-outfit transition-colors">
          Budget Management
        </h1>
        <p className="text-muted-foreground transition-colors">
          Set limits and track your spending efficiency.
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-card/50 border-border backdrop-blur-sm shadow-sm hover:shadow-md transition-all">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-cyan-500/10 rounded-lg">
                <Wallet className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Total Budget</p>
              <p className="text-2xl font-bold text-foreground">
                {formatCurrency(totalBudget)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border backdrop-blur-sm shadow-sm hover:shadow-md transition-all">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <CreditCard className="h-5 w-5 text-orange-600 dark:text-orange-500" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Total Spent</p>
              <p className="text-2xl font-bold text-foreground">
                {formatCurrency(totalSpent)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border backdrop-blur-sm shadow-sm hover:shadow-md transition-all">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-500" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Overall Usage</p>
              <p className="text-2xl font-bold text-foreground">
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
            className="bg-card/50 border-border hover:border-border/80 transition-all shadow-sm group"
          >
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-muted rounded-lg group-hover:bg-background transition-colors">
                    <Target className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                  </div>
                  <div>
                    <CardTitle className="text-foreground text-base font-bold">
                      {cat.name}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground text-xs uppercase font-medium tracking-tight">
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
                      className="w-24 h-8 bg-background border-border text-foreground text-sm focus:ring-primary"
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-emerald-600 dark:text-emerald-500 hover:bg-emerald-500/10"
                      onClick={() => handleSave(cat.name)}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-rose-600 dark:text-rose-500 hover:bg-rose-500/10"
                      onClick={() => setEditingId(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    <span className="text-foreground font-bold text-lg">
                      {formatCurrency(cat.budget_limit)}
                    </span>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground transition-colors hover:bg-muted"
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
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-muted-foreground font-medium">
                    Spent: {formatCurrency(cat.spent)}
                  </span>
                  <span
                    className={cn(
                      "font-bold",
                      cat.percentage > 100
                        ? "text-rose-600 dark:text-rose-500"
                        : cat.percentage > 85
                          ? "text-orange-600 dark:text-orange-500"
                          : "text-emerald-600 dark:text-emerald-500",
                    )}
                  >
                    {cat.percentage.toFixed(1)}%
                  </span>
                </div>
                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden shadow-inner">
                  <div
                    className={cn(
                      "h-full transition-all duration-500 rounded-full shadow-sm",
                      cat.percentage > 100
                        ? "bg-rose-500"
                        : cat.percentage > 85
                          ? "bg-orange-500"
                          : "bg-cyan-500",
                    )}
                    style={{ width: `${Math.min(cat.percentage, 100)}%` }}
                  />
                </div>
              </div>

              {cat.percentage > 100 && (
                <div className="flex items-center gap-2 text-[10px] text-rose-600 dark:text-rose-500 bg-rose-500/10 p-2.5 rounded-lg border border-rose-500/20 shadow-sm animate-in fade-in zoom-in duration-300">
                  <AlertCircle className="h-3.5 w-3.5" />
                  <span className="font-bold uppercase tracking-tight">
                    Budget exceeded by {formatCurrency(Math.abs(cat.remaining))}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center text-[10px] text-muted-foreground/80 font-medium">
                <span>
                  Remaining: {formatCurrency(Math.max(0, cat.remaining))}
                </span>
                <span className="italic">Resets on 1st of next month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Budgets;
