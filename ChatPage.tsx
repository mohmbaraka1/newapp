import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function ChatPage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sendMessageMutation = trpc.chat.send.useMutation();
  const getHistoryQuery = trpc.chat.getHistory.useQuery();

  useEffect(() => {
    if (getHistoryQuery.data) {
      const history = getHistoryQuery.data as any[];
      setMessages(
        history.flatMap((msg: any) => [
          {
            id: `${msg.id}-user`,
            role: "user" as const,
            content: msg.message,
            timestamp: new Date(msg.createdAt),
          },
          {
            id: `${msg.id}-assistant`,
            role: "assistant" as const,
            content: msg.response,
            timestamp: new Date(msg.createdAt),
          },
        ])
      );
    }
  }, [getHistoryQuery.data]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const sentText = inputValue;
    setInputValue("");
    setIsLoading(true);

    try {
      const result = await sendMessageMutation.mutateAsync({ message: sentText });

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: result.response,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("حدث خطأ أثناء إرسال الرسالة");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navigation */}
      <nav className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center">
              <span className="text-xl font-bold text-primary">✦</span>
            </div>
            <span className="text-2xl font-bold tracking-widest text-foreground">AZZA</span>
          </div>
          <Button
            variant="outline"
            onClick={() => setLocation("/")}
            className="border-primary/30 text-primary hover:bg-primary/10"
          >
            الرئيسية
          </Button>
        </div>
      </nav>

      {/* Chat Container */}
      <div className="flex-1 container mx-auto px-4 py-8 max-w-2xl flex flex-col">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
            <span className="text-primary">✦</span> مساعد AZZA الذكي
          </h1>
          <p className="text-muted-foreground">اسأل عن الأفكار والمشاريع والمستثمرين والمزيد</p>
        </div>

        {/* Messages */}
        <Card className="flex-1 border-border/50 bg-card/50 backdrop-blur p-6 mb-6 overflow-y-auto max-h-[60vh]">
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-center py-12">
                <div>
                  <div className="text-5xl mb-4">💬</div>
                  <p className="text-muted-foreground text-lg">ابدأ محادثة مع مساعد AZZA الذكي</p>
                  <p className="text-sm text-muted-foreground mt-2">يمكنك السؤال عن الأفكار والمشاريع والمستثمرين والفرص</p>
                </div>
              </div>
            ) : (
              <>
                {messages.map(message => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground rounded-br-none"
                          : "bg-muted text-foreground border border-border/50 rounded-bl-none"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString("ar-SA")}
                      </p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-muted border border-border/50 px-4 py-3 rounded-lg rounded-bl-none flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm text-muted-foreground">جاري الكتابة...</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>
        </Card>

        {/* Input */}
        <form onSubmit={handleSendMessage} className="flex gap-3">
          <Input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="اكتب رسالتك هنا..."
            disabled={isLoading}
            className="bg-background border-border/50"
          />
          <Button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-6"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </form>
      </div>
    </div>
  );
}