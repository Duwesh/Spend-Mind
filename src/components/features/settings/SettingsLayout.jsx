import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BudgetSettings from "./BudgetSettings";
import GeneralSettings from "./GeneralSettings";
import CategorySettings from "./CategorySettings";
import { Wallet, Settings, LayoutGrid } from "lucide-react";

const SettingsLayout = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Settings
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage your preferences and application data.
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center gap-2">
            <LayoutGrid className="h-4 w-4" />
            Categories
          </TabsTrigger>
          <TabsTrigger value="budget" className="flex items-center gap-2">
            <Wallet className="h-4 w-4" />
            Budget & Limits
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <GeneralSettings />
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <CategorySettings />
        </TabsContent>

        <TabsContent value="budget" className="space-y-4">
          <BudgetSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsLayout;
