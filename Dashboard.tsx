import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import { Loader2, Send } from "lucide-react";

export default function Dashboard() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [showChat, setShowChat] = useState(false);

  const ideasQuery = trpc.ideas.getAll.useQuery();
  const createIdeaMutation = trpc.ideas.create.useMutation();
  const sendChatMutation = trpc.chat.send.useMutation();
  const chatHistoryQuery = trpc.chat.getHistory.useQuery();

  const [ideaForm, setIdeaForm] = useState({
    title: "",
    description: "",
    category: "",
    stage: "فكرة",
  });

  useEffect(() => {
    if (!loading && !user) {
      setLocation("/");
    }
  }, [user, loading, setLocation]);

  useEffect(() => {
    if (chatHistoryQuery.data) {
      setChatHistory(chatHistoryQuery.data);
    }
  }, [chatHistoryQuery.data]);

  const handleCreateIdea = async () => {
    if (!ideaForm.title || !ideaForm.description || !ideaForm.category) {
      alert("يرجى ملء جميع الحقول");
      return;
    }

    try {
      await createIdeaMutation.mutateAsync({
        title: ideaForm.title,
        description: ideaForm.description,
        category: ideaForm.category,
        stage: ideaForm.stage as any,
      });

      setIdeaForm({ title: "", description: "", category: "", stage: "فكرة" });
      ideasQuery.refetch();
    } catch (error) {
      console.error("Error creating idea:", error);
    }
  };

  const handleSendChat = async () => {
    if (!chatMessage.trim()) return;

    try {
      const result = await sendChatMutation.mutateAsync({ message: chatMessage });
      setChatHistory([...chatHistory, { message: chatMessage, response: result.response }]);
      setChatMessage("");
    } catch (error) {
      console.error("Error sending chat:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center">
              <span className="text-xl font-bold text-primary">✦</span>
            </div>
            <span className="text-2xl font-bold tracking-widest text-foreground">AZZA</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">مرحباً، {user?.name}</span>
            <Button
              variant="outline"
              onClick={() => {
                // Logout logic
                setLocation("/");
              }}
              className="border-primary/30 text-primary hover:bg-primary/10"
            >
              خروج
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Create Idea Section */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <Button
                onClick={() => setLocation("/create-idea")}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                + نشر فكرة جديدة
              </Button>
            </div>
            <Card className="p-6 border-border/50 bg-card/50 backdrop-blur">
              <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                <span className="text-primary">✦</span> نشر فكرة جديدة
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">عنوان الفكرة</label>
                  <Input
                    placeholder="أدخل عنوان فكرتك..."
                    value={ideaForm.title}
                    onChange={(e) => setIdeaForm({ ...ideaForm, title: e.target.value })}
                    className="bg-background border-border/50"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">وصف الفكرة</label>
                  <Textarea
                    placeholder="اشرح فكرتك بالتفصيل..."
                    value={ideaForm.description}
                    onChange={(e) => setIdeaForm({ ...ideaForm, description: e.target.value })}
                    rows={4}
                    className="bg-background border-border/50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">الفئة</label>
                    <Input
                      placeholder="تقنية، صحة، تعليم..."
                      value={ideaForm.category}
                      onChange={(e) => setIdeaForm({ ...ideaForm, category: e.target.value })}
                      className="bg-background border-border/50"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">المرحلة</label>
                    <Select value={ideaForm.stage} onValueChange={(value) => setIdeaForm({ ...ideaForm, stage: value })}>
                      <SelectTrigger className="bg-background border-border/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="فكرة">فكرة</SelectItem>
                        <SelectItem value="نموذج أولي">نموذج أولي</SelectItem>
                        <SelectItem value="مشروع قائم">مشروع قائم</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button
                  onClick={handleCreateIdea}
                  disabled={createIdeaMutation.isPending}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {createIdeaMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      جاري النشر...
                    </>
                  ) : (
                    "نشر الفكرة"
                  )}
                </Button>
              </div>
            </Card>
          </div>

          {/* Chat Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-4 border-border/50 bg-card/50 backdrop-blur sticky top-24">
              <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                <span>💬</span> مساعد AZZA
              </h3>

              <div className="space-y-3 max-h-96 overflow-y-auto mb-4">
                {chatHistory.map((msg, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="bg-primary/10 p-2 rounded text-sm text-foreground">
                      <strong>أنت:</strong> {msg.message}
                    </div>
                    <div className="bg-muted p-2 rounded text-sm text-foreground">
                      <strong>المساعد:</strong> {msg.response}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Input
                  placeholder="اسأل سؤالاً..."
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendChat()}
                  className="bg-background border-border/50 text-sm"
                />
                <Button
                  size="sm"
                  onClick={handleSendChat}
                  disabled={sendChatMutation.isPending}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          </div>
        </div>

        {/* Ideas List */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            <span className="text-primary">✦</span> الأفكار المنشورة
          </h2>

          {ideasQuery.isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : ideasQuery.data && ideasQuery.data.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ideasQuery.data.map((idea) => (
                <Card key={idea.id} className="p-6 border-border/50 bg-card/50 backdrop-blur hover:border-primary/30 transition-colors">
                  <h3 className="text-lg font-bold text-primary mb-2">{idea.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{idea.description}</p>

                  <div className="flex gap-2 mb-4 flex-wrap">
                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                      {idea.category}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-medium">
                      {idea.stage}
                    </span>
                  </div>

                  {idea.media && idea.media.length > 0 && (
                    <div className="flex gap-2 mb-4 flex-wrap">
                      {idea.media.map((m: any, idx: number) => (
                        m.mediaType === "image" ? (
                          <img
                            key={idx}
                            src={m.mediaUrl}
                            alt="idea"
                            className="w-16 h-16 object-cover rounded border border-border/50"
                          />
                        ) : (
                          <video
                            key={idx}
                            src={m.mediaUrl}
                            className="w-16 h-16 object-cover rounded border border-border/50"
                          />
                        )
                      ))}
                    </div>
                  )}

                  <p className="text-xs text-muted-foreground">
                    {new Date(idea.createdAt).toLocaleDateString("ar-SA")}
                  </p>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center border-border/50 bg-card/50 backdrop-blur">
              <p className="text-muted-foreground">لا توجد أفكار منشورة حتى الآن</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
