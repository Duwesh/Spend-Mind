import { createModel } from "./llm";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";

/**
 * Performs advanced financial analysis using the LLM.
 * Returns a structured action plan based on user data and goals.
 */
export const getAIRecommendations = async (data) => {
  const { goals, expenses, categories, reductionRate } = data;

  const model = await createModel();

  const systemPrompt = `You are the SpendMind AI Financial Advisor. 
  Your goal is to analyze the user's finances and provide a high-quality, prioritized action plan.
  
  You must return ONLY a JSON object with the following structure:
  {
    "recommendations": [
      {
        "id": "uuid",
        "priority": "high" | "medium" | "low",
        "type": "warning" | "success" | "optimization",
        "title": "Short descriptive title",
        "message": "Detailed explanation of the insight",
        "action": "Specific, actionable step to take",
        "color": "tailwind-color-classes" 
      }
    ],
    "totalPotentialSavings": number
  }

  Color guidelines (Tailwind classes):
  - high/warning: "text-red-500 bg-red-500/10 border-red-500/20"
  - medium/optimization: "text-amber-500 bg-amber-500/10 border-amber-500/20"
  - low/success: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20"
  - indigo (generic): "text-indigo-500 bg-indigo-500/10 border-indigo-500/20"
  `;

  const userContext = `
  Financial Goals: ${JSON.stringify(goals)}
  Recent Expenses (Summary): ${JSON.stringify(expenses.slice(0, 20))}
  Categories: ${JSON.stringify(categories)}
  Spending Reduction Target: ${reductionRate}%
  
  Analyze the current spending patterns against the goals and reduction target. 
  Identify risks, calculate potential savings, and provide specific optimization steps.
  Be precise with numbers. Keep the tone professional but encouraging.
  `;

  try {
    const response = await model.invoke([
      new SystemMessage(systemPrompt),
      new HumanMessage(userContext),
    ]);

    // Parse the JSON response
    const content = response.content;
    const jsonMatch = content.match(/\{[\s\S]*\}/);

    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    throw new Error("Failed to parse AI response as JSON");
  } catch (error) {
    console.error("AI Advisor: Analysis failed", error);
    throw error;
  }
};
