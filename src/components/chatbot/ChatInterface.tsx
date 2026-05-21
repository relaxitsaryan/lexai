import { useState, useRef, useEffect } from "react";
import { Send, Bot, Loader2, Info } from "lucide-react";
import { chatWithGroq } from "@/lib/groq";
import { VoiceRecorder } from "./VoiceRecorder";

// Custom light-weight markdown-like renderer
function FormattedMessage({ content }: { content: string }) {
  // Split into lines
  const lines = content.split("\n");
  
  return (
    <div className="space-y-2">
      {lines.map((line, i) => {
        // Heading 1
        if (line.startsWith("# ")) {
          return <h1 key={i} className="text-xl font-bold text-primary mt-4 mb-2">{line.replace("# ", "")}</h1>;
        }
        // Heading 2
        if (line.startsWith("## ")) {
          return <h2 key={i} className="text-lg font-bold text-primary mt-3 mb-1">{line.replace("## ", "")}</h2>;
        }
        // Heading 3
        if (line.startsWith("### ")) {
          return <h3 key={i} className="text-md font-bold text-primary mt-2 mb-1">{line.replace("### ", "")}</h3>;
        }
        
        // Bold and normal text
        const parts = line.split(/(\*\*.*?\*\*)/g);
        return (
          <p key={i} className="min-h-[1em]">
            {parts.map((part, j) => {
              if (part.startsWith("**") && part.endsWith("**")) {
                return <strong key={j} className="font-bold text-foreground underline-offset-2 decoration-accent/30 underline">{part.slice(2, -2)}</strong>;
              }
              return part;
            })}
          </p>
        );
      })}
    </div>
  );
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Namaste! I am LexAI, your legal aid assistant. How can I help you today? You can speak or type in Hindi, English, or Hinglish.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSubmit = async (e?: React.FormEvent, overrideInput?: string) => {
    e?.preventDefault();
    const text = overrideInput || input;
    if (!text.trim() || isLoading) return;

    const newMessages = [...messages, { role: "user" as const, content: text }];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      // @ts-ignore - createServerFn typing can be tricky but it works at runtime
      const response = await chatWithGroq({ data: newMessages.map(m => ({ role: m.role, content: m.content })) });
      const botMessage = response.choices[0].message.content;
      setMessages([...newMessages, { role: "assistant" as const, content: botMessage }]);
    } catch (err: any) {
      console.error(err);
      setMessages([
        ...newMessages,
        { role: "assistant" as const, content: "I'm sorry, I encountered an error. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTranscription = (text: string) => {
    setInput(text);
    handleSubmit(undefined, text);
  };

  return (
    <div className="flex flex-col h-[650px] border border-border bg-card relative overflow-hidden group shadow-2xl">
      <div className="absolute inset-0 grain opacity-[0.03] pointer-events-none" />
      
      {/* Header */}
      <div className="p-5 border-b border-border bg-secondary/30 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-4">
          <div className="p-2.5 border border-primary/20 bg-background text-primary rounded-none shadow-sm">
            <Bot size={20} />
          </div>
          <div>
            <h3 className="font-serif text-base font-semibold text-primary tracking-tight">LexAI Assistant</h3>
            <div className="mt-0.5 flex items-center gap-2">
              <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">
                Multilingual Legal Aid
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            type="button"
            title="Legal Disclaimer" 
            className="text-muted-foreground hover:text-primary transition-colors p-1"
          >
            <Info size={18} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-8 scroll-smooth relative z-0"
      >
        {messages.map((m, i) => (
          <div 
            key={i} 
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div className={`flex gap-4 max-w-[85%] ${m.role === "user" ? "flex-row-reverse" : ""}`}>
              <div className={`w-9 h-9 shrink-0 border flex items-center justify-center rounded-none text-[9px] font-bold tracking-tighter
                ${m.role === "user" ? "bg-primary text-primary-foreground border-primary" : "bg-background text-primary border-border shadow-sm"}
              `}>
                {m.role === "user" ? "USER" : "LEX"}
              </div>
              <div className={`space-y-1.5 ${m.role === "user" ? "items-end text-right" : "items-start"}`}>
                <div className={`p-4 md:p-5 text-sm leading-relaxed whitespace-pre-wrap transition-all
                  ${m.role === "user" 
                    ? "bg-secondary/80 text-foreground border border-border" 
                    : "bg-background border border-border text-foreground font-serif shadow-sm italic"}
                `}>
                  {m.role === "assistant" ? <FormattedMessage content={m.content} /> : m.content}
                </div>
                <p className="text-[9px] uppercase tracking-widest text-muted-foreground/60 px-1">
                  {m.role === "user" ? "Sent" : "Legal Intelligence"}
                </p>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex gap-4 max-w-[85%]">
              <div className="w-9 h-9 shrink-0 border border-border bg-background flex items-center justify-center rounded-none text-primary shadow-sm">
                <Loader2 size={14} />
              </div>
              <div className="p-5 bg-background border border-border border-dashed">
                <div className="flex gap-1.5">
                  <span className="w-1.5 h-1.5 bg-primary/30 rounded-full" />
                  <span className="w-1.5 h-1.5 bg-primary/30 rounded-full" />
                  <span className="w-1.5 h-1.5 bg-primary/30 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-5 border-t border-border bg-background relative z-10 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.05)]">
        <form onSubmit={handleSubmit} className="flex gap-3 items-end">
          <div className="flex-1 relative group">
            <textarea
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              placeholder="Describe your legal concern..."
              className="w-full bg-secondary/40 border border-border p-4 pr-12 text-sm focus:outline-none focus:border-primary focus:bg-background transition-all resize-none min-h-[52px] max-h-[150px] font-sans"
            />
            <div className="absolute top-0 right-0 h-full flex items-center pr-3 pointer-events-none opacity-0 group-focus-within:opacity-100 transition-opacity">
               <span className="text-[10px] text-muted-foreground border border-border px-1.5 py-0.5 bg-background font-mono">ENTER</span>
            </div>
          </div>
          <div className="flex gap-2">
            <VoiceRecorder onTranscription={handleTranscription} />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="p-4 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-all shadow-md active:scale-95"
            >
              {isLoading ? <Loader2 size={20} /> : <Send size={20} />}
            </button>
          </div>
        </form>
        <div className="mt-3 flex justify-between items-center px-1">
          <p className="text-[9px] text-muted-foreground/70 flex items-center gap-1">
            <Info size={10} /> LexAI Assistant may produce errors. Verify legal facts.
          </p>
          <p className="text-[9px] text-primary/40 font-serif italic">§ Justice for all</p>
        </div>
      </div>
    </div>
  );
}
