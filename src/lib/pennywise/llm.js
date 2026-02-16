import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

/**
 * Centrally manages LLM configuration and initialization.
 * Follows standard Google Generative AI integration patterns.
 */

const getApiKey = () => {
  // Check for both user-defined and standard LangChain environment variables
  const apiKey =
    import.meta.env.VITE_GEMINI_API_KEY ||
    import.meta.env.VITE_GOOGLE_API_KEY ||
    (typeof process !== "undefined" && process.env
      ? process.env.GOOGLE_API_KEY
      : undefined);
  return apiKey?.trim();
};

export const createModel = async (tools = []) => {
  const apiKey = getApiKey();

  if (!apiKey) {
    console.error(
      "PennyWise: Missing API Key! (VITE_GEMINI_API_KEY or GOOGLE_API_KEY)",
    );
    throw new Error(
      "PennyWise is missing its Gemini API Key. Please check your .env file!",
    );
  }

  console.log("PennyWise: Initializing Gemini Model...");

  try {
    // Standard initialization per LangChain documentation
    const model = new ChatGoogleGenerativeAI({
      apiKey: apiKey,
      model: "gemini-3-flash-preview",
      maxOutputTokens: 2048,
      temperature: 0,
    });

    if (tools.length > 0) {
      return model.bindTools(tools);
    }

    return model;
  } catch (error) {
    console.error("PennyWise: Failed to create model:", error);
    throw error;
  }
};
