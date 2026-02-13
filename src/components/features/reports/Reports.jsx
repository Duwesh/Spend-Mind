import { useState, useMemo } from "react";
import { useApp } from "../../../context/AppContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Download,
  Filter,
  Calendar as CalendarIcon,
  Tag,
  Search,
  ChevronDown,
} from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const Reports = () => {
  const { expenses, categories, formatCurrency } = useApp();
  const [dateRange, setDateRange] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [customStartDate, setCustomStartDate] = useState(null);
  const [customEndDate, setCustomEndDate] = useState(null);

  const filteredExpenses = useMemo(() => {
    return expenses.filter((exp) => {
      const date = new Date(exp.date);
      const now = new Date();
      let dateMatch = true;

      if (dateRange === "month") {
        dateMatch =
          date.getMonth() === now.getMonth() &&
          date.getFullYear() === now.getFullYear();
      } else if (dateRange === "year") {
        dateMatch = date.getFullYear() === now.getFullYear();
      } else if (dateRange === "custom") {
        if (customStartDate && customEndDate) {
          dateMatch = date >= customStartDate && date <= customEndDate;
        } else if (customStartDate) {
          dateMatch = date >= customStartDate;
        } else if (customEndDate) {
          dateMatch = date <= customEndDate;
        }
      }

      const categoryMatch =
        selectedCategory === "all" || exp.category_name === selectedCategory;

      return dateMatch && categoryMatch;
    });
  }, [expenses, dateRange, selectedCategory, customStartDate, customEndDate]);

  const totalFiltered = useMemo(() => {
    return filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  }, [filteredExpenses]);

  const generatePDF = () => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(20);
    doc.setTextColor(40);
    doc.text("Spend-Mind Expense Report", 14, 22);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
    let filterText = "All Time";
    if (dateRange === "month") filterText = "Current Month";
    else if (dateRange === "year") filterText = "Current Year";
    else if (dateRange === "custom") {
      const start = customStartDate
        ? customStartDate.toLocaleDateString()
        : "Beginning";
      const end = customEndDate
        ? customEndDate.toLocaleDateString()
        : "Present";
      filterText = `${start} to ${end}`;
    }

    doc.text(`Filter: ${filterText}`, 14, 35);
    doc.text(
      `Category: ${selectedCategory === "all" ? "All Categories" : selectedCategory}`,
      14,
      40,
    );

    // Summary Box
    doc.setDrawColor(200);
    doc.setFillColor(245, 247, 250);
    doc.rect(14, 45, 182, 15, "F");
    doc.setFontSize(12);
    doc.setTextColor(40);
    doc.text(
      `Total Spending in Period: ${formatCurrency(totalFiltered)}`,
      20,
      54,
    );

    // Table
    const tableData = filteredExpenses.map((exp) => [
      new Date(exp.date).toLocaleDateString(),
      exp.description || "N/A",
      exp.category_name,
      formatCurrency(exp.amount),
    ]);

    doc.autoTable({
      startY: 65,
      head: [["Date", "Description", "Category", "Amount"]],
      body: tableData,
      theme: "grid",
      headStyles: { fillColor: [34, 211, 238], textColor: 255 },
      styles: { fontSize: 9 },
    });

    doc.save(`SpendMind_Report_${new Date().toISOString().split("T")[0]}.pdf`);
  };

  return (
    <div className="space-y-8 pb-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white font-outfit">
          Expense Reports
        </h1>
        <p className="text-slate-400">
          Generate and export detailed spending summaries.
        </p>
      </div>

      <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
        <CardHeader className="border-b border-slate-800 pb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-wrap gap-3">
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <select
                  className="bg-slate-800 border-slate-700 text-slate-300 text-sm rounded-lg pl-10 pr-10 py-2 appearance-none focus:ring-1 focus:ring-cyan-500 outline-none"
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                >
                  <option value="all">All Time</option>
                  <option value="month">This Month</option>
                  <option value="year">This Year</option>
                  <option value="custom">Custom Range</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
              </div>

              {dateRange === "custom" && (
                <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-2">
                  <DatePicker
                    date={customStartDate}
                    setDate={setCustomStartDate}
                    className="w-[150px] h-9 text-xs"
                  />
                  <span className="text-slate-500 text-xs">to</span>
                  <DatePicker
                    date={customEndDate}
                    setDate={setCustomEndDate}
                    className="w-[150px] h-9 text-xs"
                  />
                </div>
              )}

              <div className="relative">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <select
                  className="bg-slate-800 border-slate-700 text-slate-300 text-sm rounded-lg pl-10 pr-10 py-2 appearance-none focus:ring-1 focus:ring-cyan-500 outline-none"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <Button
              className="bg-cyan-400 hover:bg-cyan-500 text-slate-950 font-bold gap-2"
              onClick={generatePDF}
            >
              <Download className="h-4 w-4" /> Export PDF
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
              <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">
                Total Period Spending
              </p>
              <p className="text-xl font-bold text-white">
                {formatCurrency(totalFiltered)}
              </p>
            </div>
            <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
              <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">
                Expense Count
              </p>
              <p className="text-xl font-bold text-white">
                {filteredExpenses.length}
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="pb-4 px-2">Date</th>
                  <th className="pb-4 px-2">Description</th>
                  <th className="pb-4 px-2">Category</th>
                  <th className="pb-4 px-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50 border-t border-slate-800">
                {filteredExpenses.length > 0 ? (
                  filteredExpenses.slice(0, 10).map((exp) => (
                    <tr
                      key={exp.id}
                      className="text-slate-300 hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="py-4 px-2">
                        {new Date(exp.date).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-2 font-medium text-white">
                        {exp.description || "Expense"}
                      </td>
                      <td className="py-4 px-2 text-xs">
                        <span className="bg-slate-800 px-2 py-1 rounded-md">
                          {exp.category_name}
                        </span>
                      </td>
                      <td className="py-4 px-2 text-right font-bold">
                        -{formatCurrency(exp.amount)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="py-12 text-center text-slate-500 italic"
                    >
                      No expenses found for the selected filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            {filteredExpenses.length > 10 && (
              <p className="mt-4 text-center text-xs text-slate-500 italic">
                Showing first 10 transactions. Export PDF for full report.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
