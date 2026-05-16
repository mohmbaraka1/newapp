import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Loader2, Search, X } from "lucide-react";
import { toast } from "sonner";

interface Idea {
  id: number;
  title: string;
  description: string;
  category: string;
  stage: string;
  authorId: number;
  authorName: string;
  createdAt: Date;
  mediaUrls?: string[];
}

export default function IdeasGallery() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [filteredIdeas, setFilteredIdeas] = useState<Idea[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStage, setSelectedStage] = useState("all");
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const getAllIdeasQuery = trpc.ideas.getAll.useQuery();

  useEffect(() => {
    if (getAllIdeasQuery.data) {
      setIdeas(getAllIdeasQuery.data as any);
      setIsLoading(false);
    }
  }, [getAllIdeasQuery.data]);

  // Filter ideas based on search and filters
  useEffect(() => {
    let filtered = ideas;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(idea =>
        idea.title.includes(searchQuery) ||
        idea.description.includes(searchQuery) ||
        idea.authorName.includes(searchQuery)
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(idea => idea.category === selectedCategory);
    }

    // Stage filter
    if (selectedStage !== "all") {
      filtered = filtered.filter(idea => idea.stage === selectedStage);
    }

    setFilteredIdeas(filtered);
  }, [ideas, searchQuery, selectedCategory, selectedStage]);

  const categories = ["Technology", "Health", "Education", "Finance", "Entertainment"];
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
            {user && (
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

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2 flex items-center gap-2">
            <span className="text-primary">✦</span> تصفح الأفكار
          </h1>
          <p className="text-muted-foreground">
            اكتشف أفكاراً مبتكرة وتواصل مع أصحابها
          </p>
        </div>

        {/* Filters */}
        <Card className="p-6 mb-8 border-border/50 bg-card/50 backdrop-blur">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
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

            {/* Category Filter */}
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

            {/* Stage Filter */}
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

            {/* Clear Filters */}
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
                {/* Media Preview */}
                {idea.mediaUrls && idea.mediaUrls.length > 0 && (
                  <div className="w-full h-40 bg-gradient-to-br from-primary/20 to-primary/5 overflow-hidden relative">
                    <img
                      src={idea.mediaUrls[0]}
                      alt={idea.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="p-6">
                  {/* Category & Stage */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full border border-primary/30">
                      {idea.category}
                    </span>
                    <span className="inline-block px-3 py-1 bg-accent/10 text-accent text-xs font-medium rounded-full border border-accent/30">
                      {idea.stage}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-foreground mb-2 line-clamp-2">
                    {idea.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {idea.description}
                  </p>

                  {/* Author */}
                  <div className="flex items-center justify-between pt-4 border-t border-border/30">
                    <div>
                      <p className="text-xs text-muted-foreground">صاحب الفكرة</p>
                      <p className="text-sm font-medium text-foreground">{idea.authorName}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-primary/30 text-primary hover:bg-primary/10"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedIdea(idea);
                      }}
                    >
                      عرض التفاصيل
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Idea Details Modal */}
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
                {/* Media Gallery */}
                {selectedIdea.mediaUrls && selectedIdea.mediaUrls.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-foreground">الوسائط</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {selectedIdea.mediaUrls.map((url, idx) => (
                        <div key={idx} className="rounded-lg overflow-hidden border border-border/50">
                          {url.match(/\.(mp4|webm|mov)$/i) ? (
                            <video src={url} controls className="w-full h-40 object-cover" />
                          ) : (
                            <img src={url} alt={`media-${idx}`} className="w-full h-40 object-cover" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Description */}
                <div>
                  <h4 className="font-semibold text-foreground mb-2">الوصف</h4>
                  <p className="text-muted-foreground whitespace-pre-wrap">{selectedIdea.description}</p>
                </div>

                {/* Details */}
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
                    <p className="text-sm font-medium text-foreground">{selectedIdea.authorName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">تاريخ النشر</p>
                    <p className="text-sm font-medium text-foreground">
                      {new Date(selectedIdea.createdAt).toLocaleDateString("ar-SA")}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
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
