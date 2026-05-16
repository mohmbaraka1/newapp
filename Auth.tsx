import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Loader2 } from "lucide-react";

export default function Auth() {
  const [, setLocation] = useLocation();
  const { loading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [userType, setUserType] = useState<"idea" | "skill" | "investor">("idea");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleManuLogin = () => {
    const loginUrl = getLoginUrl("/dashboard");
    window.location.href = loginUrl;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isLogin) {
      if (formData.password !== formData.confirmPassword) {
        setError("كلمات المرور غير متطابقة");
        return;
      }
      if (formData.password.length < 6) {
        setError("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
        return;
      }
    }

    // For now, redirect to Manus OAuth
    handleManuLogin();
  };

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
          {isLogin ? "دخول" : "إنشاء حساب"}
        </h1>
        <p className="text-sm text-center text-muted-foreground mb-6">
          {isLogin
            ? "رحباً بعودتك إلى منصة AZZA"
            : "انضم إلى مجتمع الأفكار والمشاريع"}
        </p>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-500 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          {/* Name field (register only) */}
          {!isLogin && (
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                الاسم الكامل
              </label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="أدخل اسمك الكامل"
                className="bg-background border-border/50"
                required={!isLogin}
              />
            </div>
          )}

          {/* Email field */}
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              البريد الإلكتروني
            </label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="your@email.com"
              className="bg-background border-border/50"
              required
            />
          </div>

          {/* User Type (register only) */}
          {!isLogin && (
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-3 block">
                نوع الحساب
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: "idea" as const, label: "صاحب فكرة", icon: "💡" },
                  { value: "skill" as const, label: "صاحب مهارة", icon: "🎯" },
                  { value: "investor" as const, label: "مستثمر", icon: "💰" },
                ].map(type => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setUserType(type.value)}
                    className={`p-3 rounded-lg border-2 transition-all text-center ${
                      userType === type.value
                        ? "border-primary bg-primary/10"
                        : "border-border/30 bg-transparent hover:border-primary/50"
                    }`}
                  >
                    <div className="text-2xl mb-1">{type.icon}</div>
                    <div className="text-xs font-medium text-foreground">{type.label}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Password field */}
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              كلمة المرور
            </label>
            <Input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="••••••••"
              className="bg-background border-border/50"
              required={!isLogin}
            />
          </div>

          {/* Confirm Password field (register only) */}
          {!isLogin && (
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                تأكيد كلمة المرور
              </label>
              <Input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="••••••••"
                className="bg-background border-border/50"
                required={!isLogin}
              />
            </div>
          )}

          {/* Submit button */}
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
            ) : isLogin ? (
              "دخول"
            ) : (
              "إنشاء حساب"
            )}
          </Button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center gap-3">
          <div className="flex-1 h-px bg-border/30" />
          <span className="text-xs text-muted-foreground">أو</span>
          <div className="flex-1 h-px bg-border/30" />
        </div>

        {/* OAuth Login */}
        <Button
          onClick={handleManuLogin}
          variant="outline"
          className="w-full border-primary/30 text-primary hover:bg-primary/10"
        >
          {isLogin ? "دخول" : "إنشاء حساب"} عبر Manus
        </Button>

        {/* Toggle between login and register */}
        <div className="mt-6 text-center text-sm text-muted-foreground">
          {isLogin ? (
            <>
              ليس لديك حساب؟{" "}
              <button
                onClick={() => {
                  setIsLogin(false);
                  setError("");
                }}
                className="text-primary hover:underline font-medium"
              >
                إنشاء حساب جديد
              </button>
            </>
          ) : (
            <>
              هل لديك حساب بالفعل؟{" "}
              <button
                onClick={() => {
                  setIsLogin(true);
                  setError("");
                }}
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
