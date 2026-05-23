import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, LogOut } from "lucide-react";
import { ideasAPI } from "./api";
import { useAuthContext } from "./AuthContext";
import { useLocalStorage } from "./useLocalStorage";
import { toast } from "sonner";

export default function Dashboard() {
  const { user, logout } = useAuthContext();
  const [, setLocation] = useLocation();

  const [ideas, setIdeas] = useLocalStorage<any[]>("azza_ideas", []);
  const [ideaForm, setIdeaForm] = useLocalStorage("azza_draft", {
    title: "", description: "", category: "", stage: "فكرة"
  });

  const [loadingIdeas, setLoadingIdeas] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadIdeas();
  }, []);

  const loadIdeas = async () => {
    setLoadingIdeas(true);
    try {
      const data = await ideasAPI.getAll();
      setIdeas(data);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoadingIdeas(false);
    }
  };

  const handleCreate = async () => {
    if (!ideaForm.title || !ideaForm.description || !ideaForm.category)
      return toast.error("يرجى ملء جميع الحقول");
    setSubmitting(true);
    try {
      await ideasAPI.create(ideaForm as any);
      toast.success("تم نشر الفكرة بنجاح! 🎉");
      setIdeaForm({ title: "", description: "", category: "", stage: "فكرة" });
      loadIdeas();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    logout();
    setLocation("/");
  };

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
            <Button variant="outline" onClick={handleLogout}
              className="border-primary/30 text-primary hover:bg-primary/10 gap-2">
              <LogOut className="w-4 h-4" /> خروج
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">

          {/* نشر فكرة */}
          <div className="lg:col-span-2">
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
                    onChange={e => setIdeaForm({ ...ideaForm, title: e.target.value })}
                    className="bg-background border-border/50"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">وصف الفكرة</label>
                  <Textarea
                    placeholder="اشرح فكرتك بالتفصيل..."
                    value={ideaForm.description}
                    onChange={e => setIdeaForm({ ...ideaForm, description: e.target.value })}
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
                      onChange={e => setIdeaForm({ ...ideaForm, category: e.target.value })}
                      className="bg-background border-border/50"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">المرحلة</label>
                    <Select value={ideaForm.stage} onValueChange={v => setIdeaForm({ ...ideaForm, stage: v })}>
                      <SelectTrigger className="bg-background border-border/50"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="فكرة">فكرة</SelectItem>
                        <SelectItem value="نموذج أولي">نموذج أولي</SelectItem>
                        <SelectItem value="مشروع قائم">مشروع قائم</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button onClick={handleCreate} disabled={submitting}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                  {submitting
                    ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />جاري النشر...</>
                    : "نشر الفكرة"}
                </Button>
              </div>
            </Card>
          </div>

          {/* معلومات الحساب */}
          <div className="lg:col-span-1">
            <Card className="p-6 border-border/50 bg-card/50 backdrop-blur">
              <h3 className="font-bold text-foreground mb-4">👤 حسابي</h3>
              <div className="space-y-3">
                {[
                  { label: "الاسم", value: user?.name },
                  { label: "البريد", value: user?.email },
                  { label: "نوع الحساب", value:
                    user?.type === "idea" ? "💡 صاحب فكرة"
                    : user?.type === "skill" ? "🎯 صاحب مهارة"
                    : "💰 مستثمر" },
                ].map((item, i) => (
                  <div key={i} className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                    <p className="font-medium text-foreground text-sm">{item.value}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* الأفكار */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <span className="text-primary">✦</span> الأفكار المنشورة
              <span className="text-sm font-normal text-muted-foreground">({ideas.length})</span>
            </h2>
            <Button variant="outline" onClick={loadIdeas} disabled={loadingIdeas}
              className="border-primary/30 text-primary hover:bg-primary/10 text-sm">
              {loadingIdeas ? <Loader2 className="w-4 h-4 animate-spin" /> : "🔄 تحديث"}
            </Button>
          </div>

          {loadingIdeas && ideas.length === 0 ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : ideas.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ideas.map(idea => (
                <Card key={idea.id} className="p-6 border-border/50 bg-card/50 backdrop-blur hover:border-primary/30 transition-colors">
                  <h3 className="text-lg font-bold text-primary mb-2">{idea.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{idea.description}</p>
                  <div className="flex gap-2 mb-3 flex-wrap">
                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                      {idea.category}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-medium">
                      {idea.stage}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {idea.owner && <span>بواسطة: {idea.owner} • </span>}
                    {new Date(idea.created_at).toLocaleDateString("ar-SA")}
                  </p>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center border-border/50 bg-card/50">
              <p className="text-4xl mb-4">💡</p>
              <p className="text-muted-foreground text-lg">لا توجد أفكار بعد</p>
              <p className="text-sm text-muted-foreground mt-2">كن أول من ينشر فكرة!</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}