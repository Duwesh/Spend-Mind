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
  Mail,
  Send,
  Loader2,
} from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker";
import { supabase } from "../../../lib/supabase";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const Reports = () => {
  const { expenses, categories, formatCurrency, settings } = useApp();
  const [dateRange, setDateRange] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [customStartDate, setCustomStartDate] = useState(null);
  const [customEndDate, setCustomEndDate] = useState(null);
  const [isSendingEmail, setIsSendingEmail] = useState(false);

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

  // Safe formatter for PDF to avoid encoding issues with symbols like ₹ or special spaces
  const formatCurrencySafe = (amount) => {
    try {
      const { locale, code } = settings.currency;
      return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: code,
        currencyDisplay: "code", // Use "INR" instead of "₹" to ensure ASCII compatibility
      })
        .format(amount)
        .replace(/\u00a0/g, " ")
        .replace(/\u202f/g, " ");
    } catch (e) {
      return amount?.toLocaleString() || "0";
    }
  };

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
      `Total Spending in Period: ${formatCurrencySafe(totalFiltered)}`,
      20,
      54,
    );

    // Table
    const tableData = filteredExpenses.map((exp) => [
      new Date(exp.date).toLocaleDateString(),
      exp.description || "N/A",
      exp.category_name,
      formatCurrencySafe(exp.amount),
    ]);

    autoTable(doc, {
      startY: 65,
      head: [["Date", "Description", "Category", "Amount"]],
      body: tableData,
      theme: "striped",
      headStyles: {
        fillColor: [34, 197, 94], // emerald-500 for a professional header
        textColor: 255,
        fontSize: 10,
        fontStyle: "bold",
        halign: "center",
      },
      columnStyles: {
        3: { halign: "right" }, // Right align Amount column
      },
      styles: {
        fontSize: 9,
        cellPadding: 3,
        font: "helvetica",
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251],
      },
    });

    doc.save(`SpendMind_Report_${new Date().toISOString().split("T")[0]}.pdf`);
  };

  const handleSendEmail = async () => {
    setIsSendingEmail(true);
    try {
      // 1. Generate PDF Blob (reuse logic essentially)
      const doc = new jsPDF();

      // ... (Header and Summary logic replicated for Blob generation) ...
      // Ideally refactor PDF generation to a utility, but keeping inline for now to avoid large refactor

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
        `Total Spending in Period: ${formatCurrencySafe(totalFiltered)}`,
        20,
        54,
      );

      // Table
      const tableData = filteredExpenses.map((exp) => [
        new Date(exp.date).toLocaleDateString(),
        exp.description || "N/A",
        exp.category_name,
        formatCurrencySafe(exp.amount),
      ]);

      autoTable(doc, {
        startY: 65,
        head: [["Date", "Description", "Category", "Amount"]],
        body: tableData,
        theme: "striped",
        headStyles: {
          fillColor: [34, 197, 94],
          textColor: 255,
          fontSize: 10,
          fontStyle: "bold",
          halign: "center",
        },
        columnStyles: {
          3: { halign: "right" },
        },
        styles: {
          fontSize: 9,
          cellPadding: 3,
          font: "helvetica",
        },
        alternateRowStyles: {
          fillColor: [249, 250, 251],
        },
      });

      const pdfBlob = doc.output("blob");

      // Convert Blob to Base64
      const reader = new FileReader();
      reader.readAsDataURL(pdfBlob);
      reader.onloadend = async () => {
        const base64data = reader.result.split(",")[1];

        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user || !user.email) {
          alert("User email not found. Please log in.");
          return;
        }

        const { data, error } = await supabase.functions.invoke("send-report", {
          body: {
            email: user.email,
            subject: `Spend Mind Report: ${filterText}`,
            pdfBase64: base64data,
          },
        });

        if (error) throw error;

        alert("Email sent successfully!");
      };
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Failed to send email. Please check your configuration.");
    } finally {
      setIsSendingEmail(false);
    }
  };

  return (
    <div className="space-y-8 pb-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground font-outfit transition-colors">
          Expense Reports
        </h1>
        <p className="text-muted-foreground transition-colors">
          Generate and export detailed spending summaries.
        </p>
      </div>

      <Card className="bg-card/50 border-border backdrop-blur-sm shadow-sm transition-all overflow-hidden">
        <CardHeader className="border-b border-border pb-6 bg-muted/30">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-wrap gap-3">
              <div className="relative group">
                <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                <select
                  className="bg-background border-border text-foreground text-sm rounded-lg pl-10 pr-10 py-2 appearance-none focus:ring-1 focus:ring-cyan-500 outline-none hover:bg-muted transition-colors cursor-pointer"
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                >
                  <option value="all">All Time</option>
                  <option value="month">This Month</option>
                  <option value="year">This Year</option>
                  <option value="custom">Custom Range</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none group-hover:text-foreground transition-colors" />
              </div>

              {dateRange === "custom" && (
                <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-2 duration-300">
                  <DatePicker
                    date={customStartDate}
                    setDate={setCustomStartDate}
                    className="w-[150px] h-9 text-xs shadow-sm"
                  />
                  <span className="text-muted-foreground text-xs font-medium">
                    to
                  </span>
                  <DatePicker
                    date={customEndDate}
                    setDate={setCustomEndDate}
                    className="w-[150px] h-9 text-xs shadow-sm"
                  />
                </div>
              )}

              <div className="relative group">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                <select
                  className="bg-background border-border text-foreground text-sm rounded-lg pl-10 pr-10 py-2 appearance-none focus:ring-1 focus:ring-cyan-500 outline-none hover:bg-muted transition-colors cursor-pointer"
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
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none group-hover:text-foreground transition-colors" />
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="gap-2 border-cyan-500/20 text-cyan-500 hover:bg-cyan-500/10"
                onClick={handleSendEmail}
                disabled={isSendingEmail}
              >
                {isSendingEmail ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Mail className="h-4 w-4" />
                )}
                {isSendingEmail ? "Sending..." : "Send Email"}
              </Button>
              <Button
                className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold gap-2 shadow-sm transition-all shadow-cyan-500/20 active:scale-95"
                onClick={generatePDF}
              >
                <Download className="h-4 w-4" /> Export PDF
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="p-4 bg-accent/20 rounded-xl border border-border/50 shadow-sm transition-all hover:bg-accent/30">
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-1.5 px-0.5">
                Total Period Spending
              </p>
              <p className="text-xl font-bold text-foreground">
                {formatCurrency(totalFiltered)}
              </p>
            </div>
            <div className="p-4 bg-accent/20 rounded-xl border border-border/50 shadow-sm transition-all hover:bg-accent/30">
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-1.5 px-0.5">
                Expense Count
              </p>
              <p className="text-xl font-bold text-foreground">
                {filteredExpenses.length}
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest bg-muted/20">
                <tr>
                  <th className="py-3 px-4 rounded-l-lg font-bold">Date</th>
                  <th className="py-3 px-4 font-bold">Description</th>
                  <th className="py-3 px-4 font-bold">Category</th>
                  <th className="py-3 px-4 text-right rounded-r-lg font-bold">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filteredExpenses.length > 0 ? (
                  filteredExpenses.slice(0, 10).map((exp) => (
                    <tr
                      key={exp.id}
                      className="text-foreground/80 hover:bg-muted/50 transition-colors group"
                    >
                      <td className="py-4 px-4 font-medium">
                        {new Date(exp.date).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4 font-bold text-foreground group-hover:text-primary transition-colors">
                        {exp.description || "Expense"}
                      </td>
                      <td className="py-4 px-4 text-xs">
                        <span className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md font-bold text-[10px] uppercase tracking-tighter">
                          {exp.category_name}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right font-bold text-foreground">
                        -{formatCurrency(exp.amount)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="py-12 text-center text-muted-foreground italic font-medium"
                    >
                      No expenses found for the selected filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            {filteredExpenses.length > 10 && (
              <p className="mt-4 text-center text-[10px] text-muted-foreground font-bold uppercase tracking-widest opacity-60">
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
