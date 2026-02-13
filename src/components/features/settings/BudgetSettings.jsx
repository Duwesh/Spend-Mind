import { useState, useEffect } from "react";
import { useApp } from "../../../context/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Save, AlertTriangle, TrendingUp } from "lucide-react";

const BudgetSettings = () => {
  const { categories, budgetLimits, updateLimit, settings } = useApp();
  const [localLimits, setLocalLimits] = useState(budgetLimits);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setLocalLimits(budgetLimits);
  }, [budgetLimits]);

  const handleLimitChange = (category, value) => {
    setLocalLimits((prev) => ({
      ...prev,
      [category]: value ? parseFloat(value) : "",
    }));
    setIsSaved(false);
  };

  const handleSave = () => {
    categories.forEach((category) => {
      updateLimit(
        category,
        localLimits[category] ? parseFloat(localLimits[category]) : 0,
      );
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>{/* Header removed for tab view */}</div>
        <Button onClick={handleSave} className="gap-2">
          <Save className="h-4 w-4" />
          {isSaved ? "Saved!" : "Save Changes"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Card
            key={category}
            className="group hover:border-primary/50 transition-colors"
          >
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <TrendingUp className="h-5 w-5" />
              </div>
              <CardTitle className="text-lg font-bold">{category}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor={`limit-${category}`}>
                  Monthly Limit ({settings?.currency?.symbol || "$"})
                </Label>
                <Input
                  id={`limit-${category}`}
                  type="number"
                  min="0"
                  placeholder="0.00"
                  value={
                    localLimits[category] !== undefined
                      ? localLimits[category]
                      : ""
                  }
                  onChange={(e) => handleLimitChange(category, e.target.value)}
                />
              </div>

              <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                <AlertTriangle className="h-3 w-3" />
                Set to 0 to disable warnings
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BudgetSettings;
