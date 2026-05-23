import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2, ArrowRight, User, Mail, Phone, MapPin, FileText, Save } from "lucide-react";
import { useAuthContext } from "./AuthContext";
import { toast } from "sonner";

const BASE = "/api";

function getToken() {
  return localStorage.getItem("token");
}

async function fetchProfile() {
  const res = await fetch(`${BASE}/profile`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "حدث خطأ");
  return data.user;
}

async function updateProfile(body: any) {
  const res = await fetch(`${BASE}/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "حدث خطأ");
  return data.user;
}

export default function Profile() {
  const { user, updateUser } = useAuthContext();
  const [, setLocation] = useLocation();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "",
    location: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [edited, setEdited] = useState(false);

  useEffect(() => {
    fetchProfile()
      .then((data) => {
        setForm({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          bio: data.bio || "",
          location: data.location || "",
        });
      })
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setEdited(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await updateProfile(form);
      // حدّث الـ AuthContext والـ localStorage فوراً
      updateUser(updated);
      setEdited(false);
      toast.success("تم حفظ التعديلات بنجاح ✅");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const typeLabel =
    user?.type === "idea"
      ? "💡 صاحب فكرة"
      : user?.type === "skill"
      ? "🎯 صاحب مهارة"
      : "💰 مستثمر";

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
            className="border-primary/30 text-primary hover:bg-primary/10 gap-2"
          >
            <ArrowRight className="w-4 h-4" />
            العودة للداشبورد
          </Button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-10 max-w-2xl">
        <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
          <span className="text-primary">✦</span> الملف الشخصي
        </h1>
        <p className="text-muted-foreground mb-8">عدّل بياناتك الشخصية وتأكد من حفظها</p>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* نوع الحساب - للعرض فقط */}
            <Card className="p-4 border-border/50 bg-card/50 backdrop-blur flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-lg">
                {user?.type === "idea" ? "💡" : user?.type === "skill" ? "🎯" : "💰"}
              </div>
              <div>
                <p className="text-xs text-muted-foreground">نوع الحساب</p>
                <p className="font-semibold text-foreground">{typeLabel}</p>
              </div>
            </Card>

            {/* الاسم */}
            <Card className="p-6 border-border/50 bg-card/50 backdrop-blur space-y-4">
              <h2 className="font-bold text-foreground flex items-center gap-2">
                <User className="w-4 h-4 text-primary" /> المعلومات الأساسية
              </h2>
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">الاسم الكامل</label>
                <Input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="أدخل اسمك الكامل"
                  className="bg-background border-border/50"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">البريد الإلكتروني</label>
                <div className="relative">
                  <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className="bg-background border-border/50 pr-10"
                  />
                </div>
              </div>
            </Card>

            {/* التواصل */}
            <Card className="p-6 border-border/50 bg-card/50 backdrop-blur space-y-4">
              <h2 className="font-bold text-foreground flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" /> معلومات التواصل
              </h2>
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">رقم الجوال</label>
                <div className="relative">
                  <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+966 5X XXX XXXX"
                    className="bg-background border-border/50 pr-10"
                    dir="ltr"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">مكان السكن</label>
                <div className="relative">
                  <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="المدينة، الدولة"
                    className="bg-background border-border/50 pr-10"
                  />
                </div>
              </div>
            </Card>

            {/* البايو */}
            <Card className="p-6 border-border/50 bg-card/50 backdrop-blur space-y-4">
              <h2 className="font-bold text-foreground flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" /> نبذة شخصية
              </h2>
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                  اكتب عن نفسك وخبراتك
                </label>
                <textarea
                  name="bio"
                  value={form.bio}
                  onChange={handleChange}
                  placeholder="مثال: مطور تطبيقات بخبرة 5 سنوات، مهتم بالذكاء الاصطناعي والمشاريع الناشئة..."
                  rows={4}
                  className="w-full rounded-md border border-border/50 bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
              </div>
            </Card>

            {/* زر الحفظ */}
            <Button
              onClick={handleSave}
              disabled={saving || !edited}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 text-base gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  جاري الحفظ...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {edited ? "حفظ التعديلات" : "لا يوجد تعديلات"}
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}