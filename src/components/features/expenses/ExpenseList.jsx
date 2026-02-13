import { useState } from "react";
import { Plus, Trash2, Calendar, Tag } from "lucide-react";
import { useApp } from "../../../context/AppContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ExpenseForm from "./ExpenseForm";

const ExpenseList = () => {
  const { expenses, deleteExpense, formatCurrency } = useApp();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const sortedExpenses = [...expenses].sort(
    (a, b) => new Date(b.date) - new Date(a.date) || b.timestamp - a.timestamp,
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Expenses
          </h1>
          <p className="text-muted-foreground mt-1">
            Track your daily spending
          </p>
        </div>

        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Expense
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Expense</DialogTitle>
            </DialogHeader>
            <ExpenseForm onClose={() => setIsAddModalOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {sortedExpenses.length === 0 ? (
        <div className="p-12 rounded-2xl bg-card border text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 text-muted-foreground">
            <Plus className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-medium text-foreground">
            No expenses yet
          </h3>
          <p className="text-muted-foreground mt-2 max-w-sm mx-auto">
            Start tracking your spending by adding your first expense.
          </p>
          <Button
            variant="secondary"
            className="mt-6 mx-auto"
            onClick={() => setIsAddModalOpen(true)}
          >
            Add Now
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {sortedExpenses.map((expense) => (
            <Card
              key={expense.id}
              className="flex items-center justify-between p-4 group hover:border-primary/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-xl">
                  💰
                </div>
                <div>
                  <h3 className="font-medium text-foreground text-lg">
                    {expense.description}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                    <span className="flex items-center gap-1">
                      <Tag className="h-3 w-3" />
                      {expense.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(expense.date)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <span className="text-xl font-bold text-foreground">
                  {formatCurrency(expense.amount)}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteExpense(expense.id)}
                  className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-all"
                  title="Delete Expense"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExpenseList;
