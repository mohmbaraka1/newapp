import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { authAPI } from "./api";
import { useAuthContext } from "./AuthContext";

export default function Auth() {
  const { login, isLoggedIn } = useAuthContext();
  const [, setLocation] = useLocation();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState<"idea" | "skill" | "investor">("idea");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (isLoggedIn) setLocation("/dashboard");
  }, [isLoggedIn]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isLoginMode) {
      if (formData.password !== formData.confirmPassword)
        return setError("كلمات المرور غير متطابقة");
      if (formData.password.length < 6)
        return setError("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
    }

    setLoading(true);
    try {
      let result;
      if (isLoginMode) {
        result = await authAPI.login(formData.email, formData.password);
      } else {
        result = await authAPI.register(
          formData.name,
          formData.email,
          formData.password,
          userType
        );
      }
      login(result.token, result.user);
      setLocation("/dashboard");
    } catch (err: any) {
      setError(err.message || "حدث خطأ، حاول مرة أخرى");
    } finally {
      setLoading(false);
    }
  };

  if (isLoggedIn) return null;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-primary/5 animate-pulse"
            style={{
              width: Math.random() * 300 + 50 + "px",
              height: Math.random() * 300 + 50 + "px",
              left: Math.random() * 100 + "%",
              top: Math.random() * 100 + "%",
              animation: `float ${Math.random() * 10 + 15}s ease-in-out infinite`,
            }}
          />
        ))}
      </div>

      <Card className="w-full max-w-md p-8 border-border/50 bg-card/50 backdrop-blur relative z-10">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center">
            <span className="text-xl font-bold text-primary">✦</span>
          </div>
          <span className="text-2xl font-bold tracking-widest text-foreground">AZZA</span>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-center text-foreground mb-2">
          {isLoginMode ? "دخول" : "إنشاء حساب"}
        </h1>
        <p className="text-sm text-center text-muted-foreground mb-6">
          {isLoginMode
            ? "رحباً بعودتك إلى منصة AZZA"
            : "انضم إلى مجتمع الأفكار والمشاريع"}
        </p>

        {/* Error */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-500 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLoginMode && (
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                الاسم الكامل
              </label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="أدخل اسمك الكامل"
                className="bg-background border-border/50"
                required
              />
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              البريد الإلكتروني
            </label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              className="bg-background border-border/50"
              required
            />
          </div>

          {!isLoginMode && (
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-3 block">
                نوع الحساب
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: "idea" as const, label: "صاحب فكرة", icon: "💡" },
                  { value: "skill" as const, label: "صاحب مهارة", icon: "🎯" },
                  { value: "investor" as const, label: "مستثمر", icon: "💰" },
                ].map(t => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setUserType(t.value)}
                    className={`p-3 rounded-lg border-2 transition-all text-center ${
                      userType === t.value
                        ? "border-primary bg-primary/10"
                        : "border-border/30 hover:border-primary/50"
                    }`}
                  >
                    <div className="text-2xl mb-1">{t.icon}</div>
                    <div className="text-xs font-medium text-foreground">{t.label}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              كلمة المرور
            </label>
            <Input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="bg-background border-border/50"
              required
            />
          </div>

          {!isLoginMode && (
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                تأكيد كلمة المرور
              </label>
              <Input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="bg-background border-border/50"
                required
              />
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 mt-6"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                جاري المعالجة...
              </>
            ) : isLoginMode ? (
              "دخول"
            ) : (
              "إنشاء حساب"
            )}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          {isLoginMode ? (
            <>
              ليس لديك حساب؟{" "}
              <button
                onClick={() => { setIsLoginMode(false); setError(""); }}
                className="text-primary hover:underline font-medium"
              >
                إنشاء حساب جديد
              </button>
            </>
          ) : (
            <>
              هل لديك حساب بالفعل؟{" "}
              <button
                onClick={() => { setIsLoginMode(true); setError(""); }}
                className="text-primary hover:underline font-medium"
              >
                دخول
              </button>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}