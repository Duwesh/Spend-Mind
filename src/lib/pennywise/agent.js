import { createModel } from "./llm";
import { StateGraph, START, END, Annotation } from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { getExpenseSummary, getFinancialGoals, getSettings } from "./tools";
import {
  AIMessage,
  BaseMessage,
  HumanMessage,
  SystemMessage,
} from "@langchain/core/messages";

// Define the state for our graph using Annotation
const AgentState = Annotation.Root({
  messages: Annotation({
    reducer: (x, y) => x.concat(y),
    default: () => [],
  }),
  userId: Annotation({
    reducer: (x, y) => y ?? x,
    default: () => null,
  }),
});

// Define the tools
const tools = [getExpenseSummary, getFinancialGoals, getSettings];
const toolNode = new ToolNode(tools);

/**
 * Node that calls the Gemini model.
 * Configuration is handled centrally in llm.js
 */
async function callModel(state) {
  const { messages, userId } = state;

  // Get configured model with tools bound
  const model = await createModel(tools);

  const systemPrompt = `You are PennyWise, a friendly and intelligent AI financial advisor. 
  Your goal is to help users manage their money, track expenses, and reach financial goals.
  
  You have access to the following tools:
  - get_expense_summary: Use this to see how much the user is spending.
  - get_financial_goals: Use this to see what the user is saving for.
  - get_user_settings: Use this to check currency and other preferences.
  
  When the user asks about their finances, ALWAYS use the tools to get accurate data.
  Be encouraging, catchy, and use emojis! Current User ID: ${userId}`;

  const response = await model.invoke([
    new SystemMessage(systemPrompt),
    ...messages,
  ]);

  return { messages: [response] };
}

// Define the logic to determine whether to continue or exit
function shouldContinue(state) {
  const { messages } = state;
  const lastMessage = messages[messages.length - 1];

  if (lastMessage.tool_calls?.length > 0) {
    return "tools";
  }
  return END;
}

// Build the graph
const workflow = new StateGraph(AgentState)
  .addNode("agent", callModel)
  .addNode("tools", toolNode)
  .addEdge(START, "agent")
  .addConditionalEdges("agent", shouldContinue)
  .addEdge("tools", "agent");

// Compile the graph
export const pennywiseAgent = workflow.compile();
