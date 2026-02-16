import { createContext, useContext, useState, useCallback } from "react";
import { useAuth } from "./AuthContext";
import { pennywiseAgent } from "../lib/pennywise/agent";
import { HumanMessage, AIMessage } from "@langchain/core/messages";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hi! I'm PennyWise, your AI financial companion. How can I help you save more today? 💰✨",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = useCallback(
    async (content) => {
      if (!user) return;

      // Add user message
      const userMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsTyping(true);

      try {
        // Prepare chat history for LangChain
        const chatHistory = messages
          .filter((m) => m.id !== "welcome")
          .map((m) =>
            m.role === "user"
              ? new HumanMessage(m.content)
              : new AIMessage(m.content),
          );

        chatHistory.push(new HumanMessage(content));

        // Invoke the PennyWise agent
        // Note: This requires VITE_GEMINI_API_KEY to be set in .env
        const response = await pennywiseAgent.invoke({
          messages: chatHistory,
          userId: user.id,
        });

        const lastMessage = response.messages[response.messages.length - 1];

        const aiResponse = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: lastMessage.content,
          timestamp: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, aiResponse]);
      } catch (error) {
        console.error("PennyWise Error:", error);
        const errorMessage = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: `Oops! I'm having trouble connecting to my brain. ${error.message.includes("400") || error.message.includes("404") ? "**Tip: Please try a hard refresh (Ctrl+F5) or restart your dev server.**" : ""} Error: ${error.message} 🛠️🔌`,
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsTyping(false);
      }
    },
    [messages, user],
  );

  const clearChat = () => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content:
          "Hi! I'm PennyWise, your AI financial companion. How can I help you save more today? 💰✨",
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        isOpen,
        setIsOpen,
        isTyping,
        sendMessage,
        clearChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
