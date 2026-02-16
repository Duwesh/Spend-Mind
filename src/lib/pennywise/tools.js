import { tool } from "@langchain/core/tools";
import { supabase } from "../supabase";
import { z } from "zod";

/**
 * Tool to fetch user's expense summary by category
 */
export const getExpenseSummary = tool(
  async ({ userId }) => {
    try {
      const { data: expenses, error } = await supabase
        .from("expenses")
        .select("*")
        .eq("user_id", userId);

      if (error) throw error;

      const summary = expenses.reduce((acc, exp) => {
        acc[exp.category_name] = (acc[exp.category_name] || 0) + exp.amount;
        return acc;
      }, {});

      return JSON.stringify(summary);
    } catch (error) {
      return `Error fetching expenses: ${error.message}`;
    }
  },
  {
    name: "get_expense_summary",
    description:
      "Fetches a summary of the user's expenses grouped by category.",
    schema: z.object({
      userId: z.string().describe("The unique ID of the user."),
    }),
  },
);

/**
 * Tool to fetch user's financial goals
 */
export const getFinancialGoals = tool(
  async ({ userId }) => {
    try {
      const { data: goals, error } = await supabase
        .from("goals")
        .select("*")
        .eq("user_id", userId);

      if (error) throw error;

      return JSON.stringify(goals);
    } catch (error) {
      return `Error fetching goals: ${error.message}`;
    }
  },
  {
    name: "get_financial_goals",
    description: "Fetches the list of financial goals set by the user.",
    schema: z.object({
      userId: z.string().describe("The unique ID of the user."),
    }),
  },
);

/**
 * Tool to fetch user's budget settings
 */
export const getSettings = tool(
  async ({ userId }) => {
    try {
      const { data: settings, error } = await supabase
        .from("settings")
        .select("*, currencies(*)")
        .eq("user_id", userId)
        .single();

      if (error) throw error;

      return JSON.stringify(settings);
    } catch (error) {
      return `Error fetching settings: ${error.message}`;
    }
  },
  {
    name: "get_user_settings",
    description:
      "Fetches the user's personal settings, including currency preference.",
    schema: z.object({
      userId: z.string().describe("The unique ID of the user."),
    }),
  },
);
