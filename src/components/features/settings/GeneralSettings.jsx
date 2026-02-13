import { useApp } from "../../../context/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Globe, DollarSign } from "lucide-react";

const GeneralSettings = () => {
  const { settings, updateSettings, availableCurrencies } = useApp();

  const handleCurrencyChange = (code) => {
    const currency = availableCurrencies.find((c) => c.code === code);
    if (currency) {
      updateSettings({
        currency: {
          code: currency.code,
          symbol: currency.symbol,
          locale: currency.locale,
        },
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            Regional Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="currency">Currency & Locale</Label>
            <Select
              value={settings.currency.code}
              onValueChange={handleCurrencyChange}
            >
              <SelectTrigger id="currency">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                {availableCurrencies.map((currency) => (
                  <SelectItem key={currency.code} value={currency.code}>
                    <span className="flex items-center gap-2">
                      <span className="text-muted-foreground w-6 text-center font-mono">
                        {currency.symbol}
                      </span>
                      {currency.name} ({currency.code})
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              This will update formatting for all amounts across the
              application.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GeneralSettings;
