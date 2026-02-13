import { useState } from "react";
import { useApp } from "../../../context/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const ExpenseForm = ({ onClose }) => {
  const { addExpense, categories } = useApp();
  const [formData, setFormData] = useState({
    amount: "",
    category: categories[0],
    description: "",
  });
  const [date, setDate] = useState(new Date());
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }
    if (!formData.description.trim()) {
      setError("Please enter a description");
      return;
    }

    addExpense({
      ...formData,
      amount: parseFloat(formData.amount),
      date: format(date, "yyyy-MM-dd"),
    });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4 text-white">
      <div className="space-y-2">
        <Label htmlFor="amount">Amount</Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          placeholder="0.00"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          className={cn(
            "bg-slate-800/50 border-slate-700 text-white",
            error && !formData.amount ? "border-destructive" : "",
          )}
          autoFocus
        />
      </div>

      <div className="space-y-2">
        <Label>Category</Label>
        <Select
          value={formData.category}
          onValueChange={(value) =>
            setFormData({ ...formData, category: value })
          }
        >
          <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-slate-800 text-white">
            {categories.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Date</Label>
        <DatePicker date={date} setDate={setDate} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          placeholder="What was this for?"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className={cn(
            "bg-slate-800/50 border-slate-700 text-white",
            error && !formData.description ? "border-destructive" : "",
          )}
        />
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>

      <div className="pt-4 flex justify-end gap-3">
        <Button
          type="button"
          variant="ghost"
          onClick={onClose}
          className="text-slate-400 hover:text-white"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-cyan-500 hover:bg-cyan-600 text-slate-900 font-bold"
        >
          Add Expense
        </Button>
      </div>
    </form>
  );
};

export default ExpenseForm;
