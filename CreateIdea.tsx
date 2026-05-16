import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Loader2, Upload, X } from "lucide-react";
import { toast } from "sonner";

export default function CreateIdea() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    stage: "فكرة",
  });
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [mediaPreview, setMediaPreview] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createIdeaMutation = trpc.ideas.create.useMutation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    setLocation("/login");
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => {
      const isValidType = ["image/jpeg", "image/png", "image/gif", "image/webp", "video/mp4", "video/webm"].includes(file.type);
      const isValidSize = file.size <= 50 * 1024 * 1024; // 50MB
      return isValidType && isValidSize;
    });

    if (validFiles.length !== files.length) {
      toast.error("بعض الملفات غير صالحة. تأكد من نوع الملف والحجم (أقصى 50MB)");
    }

    setMediaFiles(prev => [...prev, ...validFiles]);

    // Create previews
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setMediaPreview(prev => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeMedia = (index: number) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
    setMediaPreview(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.category) {
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    setIsSubmitting(true);
    try {
      // Create the idea first
      const result = await createIdeaMutation.mutateAsync({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        stage: formData.stage as any,
      });

      // TODO: Upload media files to S3 using the media router
      // For now, just show success message
      toast.success("تم نشر الفكرة بنجاح!");
      setFormData({ title: "", description: "", category: "", stage: "فكرة" });
      setMediaFiles([]);
      setMediaPreview([]);

      // Redirect to dashboard
      setTimeout(() => setLocation("/dashboard"), 1500);
    } catch (error) {
      console.error("Error creating idea:", error);
      toast.error("حدث خطأ أثناء نشر الفكرة");
    } finally {
      setIsSubmitting(false);
    }
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
          <Button
            variant="outline"
            onClick={() => setLocation("/dashboard")}
            className="border-primary/30 text-primary hover:bg-primary/10"
          >
            العودة
          </Button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="p-8 border-border/50 bg-card/50 backdrop-blur">
          <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
            <span className="text-primary">✦</span> نشر فكرة جديدة
          </h1>
          <p className="text-muted-foreground mb-8">
            شارك فكرتك مع المجتمع والمستثمرين والمتخصصين
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                عنوان الفكرة *
              </label>
              <Input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="أدخل عنوان فكرتك..."
                className="bg-background border-border/50"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                وصف الفكرة *
              </label>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="اشرح فكرتك بالتفصيل، المشكلة التي تحل، والحل المقترح..."
                rows={6}
                className="bg-background border-border/50"
                required
              />
            </div>

            {/* Category and Stage */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                  الفئة *
                </label>
                <Input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  placeholder="تقنية، صحة، تعليم، الخ..."
                  className="bg-background border-border/50"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                  مرحلة المشروع
                </label>
                <Select value={formData.stage} onValueChange={(value) => setFormData(prev => ({ ...prev, stage: value }))}>
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

            {/* Media Upload */}
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                رفع الصور والفيديوهات (اختياري)
              </label>
              <div className="border-2 border-dashed border-border/50 rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleMediaChange}
                  className="hidden"
                  id="media-upload"
                />
                <label htmlFor="media-upload" className="cursor-pointer">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    اسحب الملفات هنا أو انقر لاختيار
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    الصور: JPG, PNG, GIF, WebP | الفيديوهات: MP4, WebM (أقصى 50MB)
                  </p>
                </label>
              </div>

              {/* Media Preview */}
              {mediaPreview.length > 0 && (
                <div className="mt-4 grid grid-cols-2 gap-4">
                  {mediaPreview.map((preview, idx) => (
                    <div key={idx} className="relative group">
                      {mediaFiles[idx].type.startsWith("image") ? (
                        <img
                          src={preview}
                          alt="preview"
                          className="w-full h-32 object-cover rounded-lg border border-border/50"
                        />
                      ) : (
                        <video
                          src={preview}
                          className="w-full h-32 object-cover rounded-lg border border-border/50"
                        />
                      )}
                      <button
                        type="button"
                        onClick={() => removeMedia(idx)}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting || createIdeaMutation.isPending}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 text-base"
            >
              {isSubmitting || createIdeaMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  جاري النشر...
                </>
              ) : (
                "نشر الفكرة"
              )}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
