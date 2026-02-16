import { useState } from "react";
import { useApp } from "../../../context/AppContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Brain,
  Target,
  Lightbulb,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  PiggyBank,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { getAIRecommendations } from "../../../lib/pennywise/advisor";

// Enhanced AI Analysis Logic (Legacy Mock - keeping as fallback)
const analyzeFinancesMock = (
  goals,
  expenses,
  categories,
  budgetLimits,
  reductionRate,
) => {
  const recommendations = [];
  let totalPotentialSavings = 0;

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  // Mock monthly income for calculation context
  const monthlyIncome = 5000;
  const currentSavings = Math.max(0, monthlyIncome - totalSpent);

  // 1. Calculate Potential Savings via Spending Reduction
  // Assume reduction applies to top 3 variable categories
  const categorySpending = categories
    .map((cat) => ({
      name: cat,
      amount: expenses
        .filter((e) => e.category === cat)
        .reduce((sum, e) => sum + e.amount, 0),
    }))
    .sort((a, b) => b.amount - a.amount);

  const top3Spending = categorySpending
    .slice(0, 3)
    .reduce((sum, c) => sum + c.amount, 0);
  const reductionAmount = top3Spending * (reductionRate / 100);
  totalPotentialSavings += reductionAmount;

  // 2. Goal Feasibility Analysis
  goals.forEach((goal) => {
    const months = parseInt(goal.months) || 12;
    const requiredMonthly = goal.amount / months;
    const projectedSavings = currentSavings + reductionAmount;

    if (projectedSavings < requiredMonthly) {
      recommendations.push({
        id: crypto.randomUUID(),
        priority: "high",
        type: "warning",
        title: `Goal At Risk: ${goal.title}`,
        message: `You need ${Math.round(requiredMonthly)}/mo but represent only ${Math.round(projectedSavings)} potential savings.`,
        action: `Reduce spending in ${categorySpending[0].name} by an additional 10%`,
        color: "text-red-500 bg-red-500/10 border-red-500/20",
      });
    } else {
      recommendations.push({
        id: crypto.randomUUID(),
        priority: "low",
        type: "success",
        title: `On Track: ${goal.title}`,
        message: `With your current plan, you will reach this goal on time!`,
        action: `Set up auto-deposit of ${Math.round(requiredMonthly)}`,
        color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
      });
    }
  });

  // 3. Category Optimization (Medium Priority)
  if (categorySpending.length > 0) {
    const topCat = categorySpending[0];
    recommendations.push({
      id: crypto.randomUUID(),
      priority: "medium",
      type: "optimization",
      title: `Optimize: ${topCat.name}`,
      message: `${topCat.name} is your highest expense (${Math.round(topCat.amount)}).`,
      action: `Apply the ${reductionRate}% reduction target here to save ${Math.round(topCat.amount * (reductionRate / 100))}/mo`,
      color: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    });
  }

  return { recommendations, totalPotentialSavings };
};

const AIAdvisor = () => {
  const {
    expenses,
    categories,
    budgetLimits,
    formatCurrency,
    goals,
    addGoal,
    deleteGoal,
  } = useApp();

  const [newGoal, setNewGoal] = useState({
    title: "",
    amount: "",
    months: "12",
  });

  const [reductionRate, setReductionRate] = useState(10); // Default 10% reduction
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAddGoal = (e) => {
    e.preventDefault();
    if (!newGoal.title || !newGoal.amount) return;
    addGoal(newGoal);
    setNewGoal({ title: "", amount: "", months: "12" });
  };

  const runAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const results = await getAIRecommendations({
        goals,
        expenses,
        categories,
        reductionRate,
      });
      setAnalysisResult(results);
    } catch (error) {
      console.error("AI Analysis failed:", error);
      // Fallback to mock logic if LLM fails
      const results = analyzeFinancesMock(
        goals,
        expenses,
        categories,
        budgetLimits,
        reductionRate,
      );
      setAnalysisResult(results);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Brain className="h-8 w-8 text-indigo-500" />
            AI Financial Advisor
          </h1>
          <p className="text-muted-foreground mt-1">
            Advanced analytics to optimize your savings strategy.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Column: Configuration */}
        <div className="xl:col-span-1 space-y-6">
          {/* Goal Setting */}
          <Card className="border-l-4 border-l-emerald-500 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Target className="h-5 w-5 text-emerald-500" />
                Set Financial Goals
              </CardTitle>
              <CardDescription>
                Define clear targets for the AI to analyze.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddGoal} className="space-y-4">
                <div className="grid gap-2">
                  <Label>Goal Title</Label>
                  <Input
                    placeholder="e.g. Dream Vacation"
                    value={newGoal.title}
                    onChange={(e) =>
                      setNewGoal({ ...newGoal, title: e.target.value })
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Target Amount</Label>
                    <Input
                      type="number"
                      placeholder="5000"
                      value={newGoal.amount}
                      onChange={(e) =>
                        setNewGoal({ ...newGoal, amount: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Timeline (Mo)</Label>
                    <Input
                      type="number"
                      placeholder="12"
                      value={newGoal.months}
                      onChange={(e) =>
                        setNewGoal({ ...newGoal, months: e.target.value })
                      }
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                >
                  Add Goal
                </Button>
              </form>

              {/* Active Goals List */}
              <div className="mt-6 space-y-3">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Active Goals
                </div>
                {goals.length === 0 && (
                  <p className="text-sm text-muted-foreground italic">
                    No goals active.
                  </p>
                )}
                {goals.map((goal) => (
                  <div
                    key={goal.id}
                    className="flex justify-between items-center p-3 rounded-lg border bg-card/40 hover:bg-card/60 transition-colors group"
                  >
                    <div>
                      <div className="font-semibold text-sm">{goal.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {formatCurrency(goal.amount)} by{" "}
                        {new Date(
                          new Date().setMonth(
                            new Date().getMonth() + parseInt(goal.months),
                          ),
                        ).toLocaleDateString(undefined, {
                          month: "short",
                          year: "numeric",
                        })}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteGoal(goal.id)}
                      className="h-7 w-7 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      &times;
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Strategy Settings */}
          <Card className="border-l-4 border-l-indigo-500 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingDown className="h-5 w-5 text-indigo-500" />
                Strategy Settings
              </CardTitle>
              <CardDescription>
                Adjust aggressiveness of savings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>Spending Reduction Target</Label>
                  <span className="text-sm font-bold text-indigo-500 bg-indigo-500/10 px-2 py-0.5 rounded">
                    {reductionRate}%
                  </span>
                </div>
                <Slider
                  defaultValue={[10]}
                  max={50}
                  step={1}
                  value={[reductionRate]}
                  onValueChange={(vals) => setReductionRate(vals[0])}
                  className="py-4"
                />
                <p className="text-xs text-muted-foreground">
                  Target reduction for variable expenses to free up cash for
                  goals.
                </p>
              </div>
              <Button
                onClick={runAnalysis}
                disabled={isAnalyzing}
                className="w-full"
                size="lg"
              >
                {isAnalyzing ? "Analyzing..." : "Run AI Analysis"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Analysis & Insights */}
        <div className="xl:col-span-2 space-y-6">
          {/* Empty State */}
          {!analysisResult && !isAnalyzing && (
            <Card className="h-full flex flex-col items-center justify-center p-12 border-dashed">
              <div className="bg-primary/5 p-6 rounded-full mb-4">
                <Brain className="h-12 w-12 text-primary/40" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                Ready to Analyze
              </h3>
              <p className="text-muted-foreground text-center max-w-sm mt-2">
                Add your financial goals and adjust your strategy settings, then
                click "Run AI Analysis" to generate personalized insights.
              </p>
            </Card>
          )}

          {/* Loading State */}
          {isAnalyzing && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="h-32 bg-primary/5 rounded-xl animate-pulse" />
                <div className="h-32 bg-primary/5 rounded-xl animate-pulse" />
              </div>
              <div className="h-64 bg-primary/5 rounded-xl animate-pulse" />
            </div>
          )}

          {/* Results Display */}
          {analysisResult && !isAnalyzing && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-indigo-500/20">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Potential Monthly Savings
                        </p>
                        <h3 className="text-3xl font-bold text-indigo-500 mt-2">
                          {formatCurrency(analysisResult.totalPotentialSavings)}
                        </h3>
                      </div>
                      <div className="p-3 bg-indigo-500/20 rounded-lg">
                        <PiggyBank className="h-6 w-6 text-indigo-500" />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-4">
                      Based on {reductionRate}% reduction in top categories
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-card">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Active Recommendations
                        </p>
                        <h3 className="text-3xl font-bold text-foreground mt-2">
                          {analysisResult.recommendations.length}
                        </h3>
                      </div>
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <Lightbulb className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-500/10 text-red-500">
                        {
                          analysisResult.recommendations.filter(
                            (r) => r.priority === "high",
                          ).length
                        }{" "}
                        High
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-500/10 text-amber-500">
                        {
                          analysisResult.recommendations.filter(
                            (r) => r.priority === "medium",
                          ).length
                        }{" "}
                        Med
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recommendations List */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-indigo-500" />
                  Personalized Action Plan
                </h3>

                {analysisResult.recommendations
                  .sort((a) => (a.priority === "high" ? -1 : 1)) // High priority first
                  .map((rec) => (
                    <Card
                      key={rec.id}
                      className={`border-l-4 ${
                        rec.priority === "high"
                          ? "border-l-red-500"
                          : rec.priority === "medium"
                            ? "border-l-amber-500"
                            : "border-l-emerald-500"
                      }`}
                    >
                      <CardContent className="pt-6">
                        <div className="flex gap-4 items-start">
                          <div
                            className={`p-2 rounded-full shrink-0 ${rec.color.split(" ")[1]}`}
                          >
                            {" "}
                            {/* Extract bg color */}
                            {rec.type === "warning" && (
                              <AlertTriangle
                                className={`h-6 w-6 ${rec.color.split(" ")[0]}`}
                              />
                            )}
                            {rec.type === "optimization" && (
                              <TrendingDown
                                className={`h-6 w-6 ${rec.color.split(" ")[0]}`}
                              />
                            )}
                            {rec.type === "success" && (
                              <CheckCircle2
                                className={`h-6 w-6 ${rec.color.split(" ")[0]}`}
                              />
                            )}
                          </div>
                          <div className="flex-1 space-y-1">
                            <div className="flex justify-between items-start">
                              <h4 className="font-bold text-lg">{rec.title}</h4>
                              <span
                                className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded ${rec.color}`}
                              >
                                {rec.priority} Priority
                              </span>
                            </div>
                            <p className="text-muted-foreground">
                              {rec.message}
                            </p>

                            {/* Action Item Box */}
                            <div className="mt-4 bg-secondary/50 rounded-lg p-3 flex items-start gap-3">
                              <ArrowRight className="h-4 w-4 text-primary mt-0.5" />
                              <div className="text-sm">
                                <span className="font-semibold text-foreground">
                                  Action:{" "}
                                </span>
                                <span className="text-muted-foreground">
                                  {rec.action}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Start of sparkles icon definition for local use if not imported
const Sparkles = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    <path d="M5 3v4" />
    <path d="M9 5h4" />
    <path d="M19 19v4" />
    <path d="M15 21h4" />
  </svg>
);

export default AIAdvisor;
