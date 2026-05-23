import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuthContext } from "@/AuthContext";
import { ideasAPI } from "@/api";
import { Loader2, Search } from "lucide-react";

interface Idea {
  id: number;
  title: string;
  description: string;
  category: string;
  stage: string;
  owner: string;
  created_at: string;
  media?: { media_url: string; media_type: string }[];
}

export default function IdeasGallery() {
  const { isLoggedIn } = useAuthContext();
  const [, setLocation] = useLocation();
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [filteredIdeas, setFilteredIdeas] = useState<Idea[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStage, setSelectedStage] = useState("all");
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadIdeas();
  }, []);

  const loadIdeas = async () => {
    setIsLoading(true);
    try {
      const data = await ideasAPI.getAll();
      setIdeas(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let filtered = ideas;
    if (searchQuery) {
      filtered = filtered.filter(idea =>
        idea.title.includes(searchQuery) ||
        idea.description.includes(searchQuery)
      );
    }
    if (selectedCategory !== "all") {
      filtered = filtered.filter(idea => idea.category === selectedCategory);
    }
    if (selectedStage !== "all") {
      filtered = filtered.filter(idea => idea.stage === selectedStage);
    }
    setFilteredIdeas(filtered);
  }, [ideas, searchQuery, selectedCategory, selectedStage]);

  const categories = ["تقنية", "صحة", "تعليم", "مال", "ترفيه"];
  const stages = ["فكرة", "نموذج أولي", "مشروع قائم"];

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
          <div className="flex items-center gap-3">
            {isLoggedIn && (
              <Button
                onClick={() => setLocation("/create-idea")}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                + نشر فكرة
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => setLocation("/")}
              className="border-primary/30 text-primary hover:bg-primary/10"
            >
              الرئيسية
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2 flex items-center gap-2">
            <span className="text-primary">✦</span> تصفح الأفكار
          </h1>
          <p className="text-muted-foreground">اكتشف أفكاراً مبتكرة وتواصل مع أصحابها</p>
        </div>

        {/* Filters */}
        <Card className="p-6 mb-8 border-border/50 bg-card/50 backdrop-blur">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="ابحث عن أفكار..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background border-border/50"
              />
            </div>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="bg-background border-border/50">
                <SelectValue placeholder="الفئة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الفئات</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedStage} onValueChange={setSelectedStage}>
              <SelectTrigger className="bg-background border-border/50">
                <SelectValue placeholder="المرحلة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع المراحل</SelectItem>
                {stages.map(stage => (
                  <SelectItem key={stage} value={stage}>{stage}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {(searchQuery || selectedCategory !== "all" || selectedStage !== "all") && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                  setSelectedStage("all");
                }}
                className="border-primary/30 text-primary hover:bg-primary/10"
              >
                مسح الفلاتر
              </Button>
            )}
          </div>
        </Card>

        {/* Ideas Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filteredIdeas.length === 0 ? (
          <Card className="p-12 text-center border-border/50 bg-card/50 backdrop-blur">
            <p className="text-4xl mb-4">💡</p>
            <p className="text-muted-foreground text-lg">لا توجد أفكار تطابق البحث</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredIdeas.map(idea => (
              <Card
                key={idea.id}
                className="border-border/50 bg-card/50 backdrop-blur hover:border-primary/50 transition-all cursor-pointer overflow-hidden group"
                onClick={() => setSelectedIdea(idea)}
              >
                {idea.media && idea.media.length > 0 && (
                  <div className="w-full h-40 overflow-hidden">
                    <img
                      src={idea.media[0].media_url}
                      alt={idea.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                )}

                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full border border-primary/30">
                      {idea.category}
                    </span>
                    <span className="px-3 py-1 bg-muted text-muted-foreground text-xs font-medium rounded-full">
                      {idea.stage}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-foreground mb-2 line-clamp-2">{idea.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{idea.description}</p>

                  <div className="flex items-center justify-between pt-4 border-t border-border/30">
                    <div>
                      <p className="text-xs text-muted-foreground">صاحب الفكرة</p>
                      <p className="text-sm font-medium text-foreground">{idea.owner}</p>
                    </div>
                    <Button size="sm" variant="outline" className="border-primary/30 text-primary hover:bg-primary/10">
                      عرض التفاصيل
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <Dialog open={!!selectedIdea} onOpenChange={(open) => !open && setSelectedIdea(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto border-border/50 bg-card/50 backdrop-blur">
          {selectedIdea && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl text-foreground flex items-center gap-2">
                  <span className="text-primary">✦</span> {selectedIdea.title}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">الوصف</h4>
                  <p className="text-muted-foreground">{selectedIdea.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">الفئة</p>
                    <p className="text-sm font-medium text-foreground">{selectedIdea.category}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">المرحلة</p>
                    <p className="text-sm font-medium text-foreground">{selectedIdea.stage}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">صاحب الفكرة</p>
                    <p className="text-sm font-medium text-foreground">{selectedIdea.owner}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">تاريخ النشر</p>
                    <p className="text-sm font-medium text-foreground">
                      {new Date(selectedIdea.created_at).toLocaleDateString("ar-SA")}
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 pt-4 border-t border-border/30">
                  <Button className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
                    التواصل مع صاحب الفكرة
                  </Button>
                  <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/10">
                    حفظ الفكرة
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}