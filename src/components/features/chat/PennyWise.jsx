import { useState, useRef, useEffect } from "react";
import { useChat } from "../../../context/ChatContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  MessageSquare,
  X,
  Send,
  Loader2,
  Trash2,
  Minimize2,
  Maximize2,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const PennyWise = () => {
  const { messages, isOpen, setIsOpen, isTyping, sendMessage, clearChat } =
    useChat();
  const [input, setInput] = useState("");
  const [isMinimized, setIsMinimized] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;
    sendMessage(input);
    setInput("");
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-4">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              height: isMinimized ? "auto" : "500px",
            }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={cn(
              "w-[350px] shadow-2xl overflow-hidden flex flex-col",
              isMinimized ? "h-auto" : "h-[500px]",
            )}
          >
            <Card className="h-full border-primary/20 flex flex-col">
              <CardHeader className="p-4 border-b bg-primary text-primary-foreground flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  PennyWise AI
                </CardTitle>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-primary-foreground hover:bg-primary-foreground/10"
                    onClick={() => setIsMinimized(!isMinimized)}
                  >
                    {isMinimized ? (
                      <Maximize2 className="h-4 w-4" />
                    ) : (
                      <Minimize2 className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-primary-foreground hover:bg-primary-foreground/10"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>

              {!isMinimized && (
                <>
                  <CardContent
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/30 scrollbar-thin scrollbar-thumb-primary/10"
                  >
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={cn(
                          "flex flex-col max-w-[85%] gap-1",
                          msg.role === "user"
                            ? "ml-auto items-end"
                            : "mr-auto items-start",
                        )}
                      >
                        <div
                          className={cn(
                            "p-3 rounded-2xl text-sm shadow-sm",
                            msg.role === "user"
                              ? "bg-primary text-primary-foreground rounded-tr-none"
                              : "bg-card text-card-foreground border rounded-tl-none",
                          )}
                        >
                          {msg.content}
                        </div>
                        <span className="text-[10px] text-muted-foreground px-1">
                          {new Date(msg.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    ))}
                    {isTyping && (
                      <div className="flex items-center gap-2 bg-card border p-3 rounded-2xl rounded-tl-none w-fit">
                        <Loader2 className="h-4 w-4 animate-spin text-primary" />
                        <span className="text-xs text-muted-foreground italic">
                          PennyWise is thinking...
                        </span>
                      </div>
                    )}
                  </CardContent>

                  <CardFooter className="p-3 border-t bg-card mt-auto flex-col gap-2">
                    <form onSubmit={handleSend} className="flex gap-2 w-full">
                      <Input
                        placeholder="Ask me anything..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="flex-1"
                        disabled={isTyping}
                      />
                      <Button
                        type="submit"
                        size="icon"
                        disabled={!input.trim() || isTyping}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </form>
                    <div className="flex justify-between w-full px-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 text-[10px] text-muted-foreground hover:text-destructive flex items-center gap-1"
                        onClick={clearChat}
                      >
                        <Trash2 className="h-3 w-3" />
                        Clear History
                      </Button>
                      <span className="text-[9px] text-muted-foreground/50 self-center">
                        Powered by LangGraph
                      </span>
                    </div>
                  </CardFooter>
                </>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "h-14 w-14 rounded-full shadow-lg flex items-center justify-center p-0 transition-all",
            isOpen
              ? "bg-destructive hover:bg-destructive/90 rounded-2xl rotate-90"
              : "bg-primary hover:bg-primary/90",
          )}
        >
          {isOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <MessageSquare className="h-6 w-6" />
          )}
        </Button>
      </motion.div>
    </div>
  );
};

export default PennyWise;
