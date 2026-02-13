import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "./AuthContext";

const AppContext = createContext();

export function AppProvider({ children }) {
  const { user } = useAuth();

  // State
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [goals, setGoals] = useState([]);
  // Settings now includes currency
  const [settings, setSettings] = useState({
    currency: { code: "USD", symbol: "$", locale: "en-US" },
    country: "US",
  });

  const [isLoading, setIsLoading] = useState(true);

  // Fetch Initial Data
  useEffect(() => {
    if (!user) {
      setExpenses([]);
      setCategories([]);
      setGoals([]);
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      try {
        // 1. Fetch Settings
        const { data: settingsData } = await supabase
          .from("settings")
          .select("*, currencies(*)")
          .single();

        if (settingsData) {
          setSettings({
            currency: {
              code: settingsData.currencies?.code || "USD",
              symbol: settingsData.currencies?.symbol || "$",
              locale: "en-US", // Logic to determine locale could be added
            },
            country: settingsData.country_code,
          });
        }

        // 2. Fetch Categories
        const { data: catsData } = await supabase
          .from("categories")
          .select("*")
          .order("name");
        if (catsData) setCategories(catsData);

        // 3. Fetch Expenses
        const { data: expData } = await supabase
          .from("expenses")
          .select("*")
          .order("date", { ascending: false });
        if (expData) {
          // Transform for frontend: amount to number, map category_name to category
          setExpenses(
            expData.map((e) => ({
              ...e,
              amount: Number(e.amount),
              category: e.category_name,
            })),
          );
        }

        // 4. Fetch Goals
        const { data: goalsData } = await supabase.from("goals").select("*");
        if (goalsData) setGoals(goalsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // Actions
  const addExpense = async (expense) => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from("expenses")
        .insert([
          {
            user_id: user.id,
            amount: expense.amount,
            category_name: expense.category,
            // logic to link category_id if needed, for now using name for simplicity/legacy
            date: expense.date,
            description: expense.description,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      setExpenses((prev) => [
        { ...data, amount: Number(data.amount) },
        ...prev,
      ]);
    } catch (err) {
      console.error("Error adding expense:", err);
    }
  };

  const deleteExpense = async (id) => {
    if (!user) return;
    try {
      const { error } = await supabase.from("expenses").delete().eq("id", id);
      if (error) throw error;
      setExpenses((prev) => prev.filter((exp) => exp.id !== id));
    } catch (err) {
      console.error("Error deleting expense:", err);
    }
  };

  const addCategory = async (categoryName) => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from("categories")
        .insert([{ user_id: user.id, name: categoryName, budget_limit: 0 }])
        .select()
        .single();

      if (error) throw error;
      setCategories((prev) => [...prev, data]);
    } catch (err) {
      console.error("Error adding category:", err);
    }
  };

  const deleteCategory = async (id) => {
    if (!user) return;
    try {
      const { error } = await supabase.from("categories").delete().eq("id", id);
      if (error) throw error;
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Error deleting category:", err);
    }
  };

  const updateLimit = async (categoryName, limit) => {
    if (!user) return;
    // Find category ID by name (simpler if we passed ID, but legacy code passes name)
    const cat = categories.find((c) => c.name === categoryName);
    if (!cat) return;

    try {
      const { error } = await supabase
        .from("categories")
        .update({ budget_limit: limit })
        .eq("id", cat.id);

      if (error) throw error;

      setCategories((prev) =>
        prev.map((c) => (c.id === cat.id ? { ...c, budget_limit: limit } : c)),
      );
    } catch (err) {
      console.error("Error updating limit:", err);
    }
  };

  const addGoal = async (goal) => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from("goals")
        .insert([
          {
            user_id: user.id,
            title: goal.title,
            target_amount: goal.amount,
            months: goal.months,
          },
        ])
        .select()
        .single();
      if (error) throw error;
      setGoals((prev) => [...prev, data]);
    } catch (err) {
      console.error("Error adding goal:", err);
    }
  };

  const deleteGoal = async (id) => {
    if (!user) return;
    try {
      const { error } = await supabase.from("goals").delete().eq("id", id);
      if (error) throw error;
      setGoals((prev) => prev.filter((g) => g.id !== id));
    } catch (err) {
      console.error("Error deleting goal:", err);
    }
  };

  const updateSettings = async (newSettings) => {
    // TODO: Implement settings update logic specifically for currency
    console.log(
      "Settings update not fully implemented for DB yet",
      newSettings,
    );
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  // Analytics Helpers
  const getTotalSpent = () => {
    return expenses.reduce((sum, item) => sum + item.amount, 0);
  };

  const getCategorySpent = (categoryName) => {
    return expenses
      .filter((item) => item.category_name === categoryName)
      .reduce((sum, item) => sum + item.amount, 0);
  };

  const getRemainingBudget = (categoryName) => {
    const cat = categories.find((c) => c.name === categoryName);
    const limit = cat?.budget_limit || 0;
    if (limit === 0) return Infinity;
    const spent = getCategorySpent(categoryName);
    return limit - spent;
  };

  const formatCurrency = (amount) => {
    const { locale, code } = settings.currency;
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: code,
    }).format(amount);
  };

  return (
    <AppContext.Provider
      value={{
        expenses,
        categories: categories.map((c) => c.name), // Adapter for components expecting strings
        categoriesRaw: categories, // Access to full category objects
        budgetLimits: categories.reduce(
          (acc, c) => ({ ...acc, [c.name]: c.budget_limit }),
          {},
        ), // Adapter for limits object
        goals,
        settings,
        isLoading,
        addExpense,
        deleteExpense,
        updateLimit,
        addCategory,
        deleteCategory, // Note: This now likely expects ID, might break UI calling with name
        addGoal,
        deleteGoal,
        updateSettings,
        getTotalSpent,
        getCategorySpent,
        getRemainingBudget,
        formatCurrency,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
