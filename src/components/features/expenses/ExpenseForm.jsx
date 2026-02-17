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
import {
  Upload,
  Loader2,
  ScanLine,
  FileText,
  FileSpreadsheet,
  CheckCircle2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { scanReceipt } from "../../../services/ocrService";

const ExpenseForm = ({ onClose }) => {
  const { addExpense, categories } = useApp();
  const [formData, setFormData] = useState({
    amount: "",
    category: categories[0],
    description: "",
  });
  const [date, setDate] = useState(new Date());
  const [error, setError] = useState("");
  const [scanning, setScanning] = useState(false);
  const [scanSuccess, setScanSuccess] = useState(false);
  const [receiptPreview, setReceiptPreview] = useState(null);
  const [fileType, setFileType] = useState(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError("File size should be less than 5MB");
      return;
    }

    // Create preview
    setFileType(file.type);
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setReceiptPreview(null);
    }

    setScanning(true);
    setError("");

    try {
      const scannedData = await scanReceipt(file);

      setScanSuccess(true);
      setTimeout(() => {
        setScanSuccess(false);
        setFormData((prev) => ({
          ...prev,
          amount: scannedData.amount || prev.amount,
          description: scannedData.description || prev.description,
          category: categories.includes(scannedData.category)
            ? scannedData.category
            : prev.category,
        }));

        if (scannedData.date) {
          setDate(new Date(scannedData.date));
        }
      }, 1500); // Show success animation for 1.5s
    } catch (err) {
      console.error("Scan failed:", err);
      setError("Failed to scan receipt. Please enter details manually.");
    } finally {
      if (!scanSuccess) setScanning(false);
    }
  };

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
      {/* Receipt Upload Section */}
      <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-700 rounded-lg hover:border-slate-500 transition-colors bg-slate-800/30">
        <input
          type="file"
          accept="image/*,.pdf,.xls,.xlsx"
          onChange={handleFileChange}
          className="hidden"
          id="receipt-upload"
          disabled={scanning}
        />
        <label
          htmlFor="receipt-upload"
          className="cursor-pointer flex flex-col items-center gap-2 w-full relative h-40 justify-center"
        >
          <AnimatePresence mode="wait">
            {scanning && !scanSuccess ? (
              <motion.div
                key="scanning"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex flex-col items-center gap-2 text-cyan-400"
              >
                <ScanLine className="w-10 h-10 animate-bounce" />
                <span className="text-sm font-medium">
                  Scanning Document...
                </span>
              </motion.div>
            ) : scanSuccess ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="flex flex-col items-center gap-2 text-green-500"
              >
                <CheckCircle2 className="w-12 h-12" />
                <span className="text-lg font-bold">Scan Complete!</span>
              </motion.div>
            ) : receiptPreview ? (
              <motion.div
                key="preview"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative w-full h-full rounded-md overflow-hidden bg-slate-900 flex items-center justify-center"
              >
                <img
                  src={receiptPreview}
                  alt="Receipt preview"
                  className="w-full h-full object-contain"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <span className="text-white text-sm font-medium bg-black/60 px-3 py-1 rounded-full">
                    Click to replace
                  </span>
                </div>
              </motion.div>
            ) : fileType === "application/pdf" ? (
              <motion.div
                key="pdf"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center gap-2 text-red-400"
              >
                <FileText className="w-12 h-12" />
                <span className="text-sm font-medium">PDF Selected</span>
                <span className="text-xs text-slate-400">Click to replace</span>
              </motion.div>
            ) : fileType ===
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
              fileType === "application/vnd.ms-excel" ? (
              <motion.div
                key="excel"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center gap-2 text-green-400"
              >
                <FileSpreadsheet className="w-12 h-12" />
                <span className="text-sm font-medium">Excel Selected</span>
                <span className="text-xs text-slate-400">Click to replace</span>
              </motion.div>
            ) : (
              <motion.div
                key="upload"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center gap-2 text-slate-400"
              >
                <Upload className="w-10 h-10" />
                <div className="text-center">
                  <p className="text-sm font-medium text-slate-300">
                    Upload Receipt (Image, PDF, Excel)
                  </p>
                  <p className="text-xs text-slate-500">Max size 5MB</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </label>
      </div>

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
