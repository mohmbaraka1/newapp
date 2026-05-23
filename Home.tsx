import { useTheme } from "@/ThemeContext";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useLocation } from "wouter";
import { Moon, Sun } from "lucide-react";

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  const [, setLocation] = useLocation();
  const [lang, setLang] = useState<"ar" | "en">("ar");

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden relative">
      {/* Navigation */}
      <nav className="relative z-10 border-b border-border/50 backdrop-blur-sm bg-background/80">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center">
              <span className="text-xl font-bold text-primary">✦</span>
            </div>
            <span className="text-2xl font-bold tracking-widest text-primary">AZZA</span>
          </div>

          <div className="flex items-center gap-4">
            {toggleTheme && (
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-primary/10 transition-all duration-300"
              >
                {theme === "dark" ? (
                  <Sun className="w-5 h-5 text-primary" />
                ) : (
                  <Moon className="w-5 h-5 text-primary" />
                )}
              </button>
            )}

            <button
              onClick={() => setLang(lang === "ar" ? "en" : "ar")}
              className="px-3 py-2 rounded-lg border border-primary/30 text-primary hover:bg-primary/10 transition-all duration-300 text-sm font-bold"
            >
              {lang === "ar" ? "EN" : "AR"}
            </button>

            <Button
              variant="outline"
              onClick={() => setLocation("/login")}
              className="border-primary/30 text-primary hover:bg-primary/10"
            >
              {lang === "ar" ? "دخول" : "Login"}
            </Button>
            <Button
              onClick={() => setLocation("/register")}
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold"
            >
              {lang === "ar" ? "إنشاء حساب" : "Sign Up"}
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 mb-8">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            <span className="text-sm font-medium text-primary tracking-wide">
              {lang === "ar" ? "منصة الأفكار والابتكار" : "Ideas & Innovation Platform"}
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 leading-tight">
            {lang === "ar" ? (
              <>
                حيث تلتقي <span className="text-primary">الأفكار</span>
                <br />
                بأصحاب <span className="text-primary">المستقبل</span>
              </>
            ) : (
              <>
                Where <span className="text-primary">Ideas</span>
                <br />
                Meet <span className="text-primary">The Future</span>
              </>
            )}
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed max-w-2xl mx-auto">
            {lang === "ar"
              ? "منصة احترافية تربط أصحاب الأفكار بالمهارات والمستثمرين."
              : "A professional platform connecting innovators with talents and investors."}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              size="lg"
              onClick={() => setLocation("/register")}
              className="bg-primary text-primary-foreground hover:bg-primary/90 text-base font-semibold px-8"
            >
              {lang === "ar" ? "ابدأ مجاناً الآن" : "Start Free Now"}
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => setLocation("/login")}
              className="border-2 border-primary text-primary hover:bg-primary/10 text-base font-semibold px-8"
            >
              {lang === "ar" ? "تسجيل الدخول" : "Login"}
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            {[
              { num: "+500", label: lang === "ar" ? "فكرة مبتكرة" : "Innovative Ideas" },
              { num: "+200", label: lang === "ar" ? "مستثمر نشط" : "Active Investors" },
              { num: "+1K",  label: lang === "ar" ? "مستخدم مسجل" : "Registered Users" },
            ].map((stat, i) => (
              <div key={i} className="text-center p-4 rounded-lg border border-primary/20 bg-primary/5 hover:border-primary/50 transition-all">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.num}</div>
                <div className="text-sm text-muted-foreground tracking-wide">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12 text-primary">
          {lang === "ar" ? "المميزات الرئيسية" : "Key Features"}
        </h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {[
            {
              icon: "💡",
              title: lang === "ar" ? "شارك فكرتك" : "Share Your Idea",
              description: lang === "ar"
                ? "انشر فكرتك أمام العالم وجد الفريق المناسب"
                : "Publish your idea and find the right team",
            },
            {
              icon: "👥",
              title: lang === "ar" ? "تواصل مع الفريق" : "Connect with Team",
              description: lang === "ar"
                ? "التقِ بمطورين ومستثمرين جاهزين للعمل"
                : "Meet developers and investors ready to work",
            },
            {
              icon: "🚀",
              title: lang === "ar" ? "ابن مستقبلك" : "Build Your Future",
              description: lang === "ar"
                ? "من الفكرة إلى الواقع - نحن هنا لدعمك"
                : "From idea to reality - we support you",
            },
          ].map((feature, idx) => (
            <div
              key={idx}
              className="p-6 rounded-lg border border-primary/20 bg-primary/5 hover:border-primary/50 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-primary mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}