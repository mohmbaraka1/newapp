

ترقية

مشاركة
Lite
تمام! 👍 بدك تغيّر الألوان لـ ذهبي وأسود.
الحل:
أنا بعطيك تحسينات بسيطة وسهلة على الملفات الحالية عندك:
تحديث الألوان في index.css
إضافة حركات ناعمة
تحديث الملفات الرئيسية بالألوان الجديدة
أولاً - قول لي:
هل عندك ملف index.css؟ وأين موقعه بالضبط؟
هل عندك ملف tailwind.config.js؟
أو اكتب:
Bash
dir *.css
dir *.config.js
وأعطيني الـ output! 📁
C:\Users\HP\Desktop\App new>dir *.config.js
 Volume in drive C is WAFA-OS
 Volume Serial Number is 0E4D-EEFC

 Directory of C:\Users\HP\Desktop\App new

File Not Found
Lite
تمام! 👍 ما في tailwind.config.js.
الآن:
هل عندك ملف index.css؟
اكتب:
Bash
dir *.css
أو شنو الملفات الموجودة؟
اكتب:
Bash
dir
وأعطيني الـ output! 📁
لا تضل تسال عن ملفات اعطيتك ياها  فوق راجع من فوق
Lite
أنت محق! 👍 أنا شفت الملفات من فوق:
Plain Text
05/14/2026  06:41 PM             6,034 index.css
05/14/2026  06:41 PM             8,979 Home.tsx
05/15/2026  05:42 PM            12,070 Dashboard.tsx
05/14/2026  06:41 PM            13,356 IdeasGallery.tsx
05/14/2026  06:41 PM             7,221 ChatPage.tsx
الآن سأعطيك أكواد تحديث بسيطة:
تحديث index.css - إضافة الألوان الذهبية والأسوداء + الحركات
تحديث Home.tsx - تغيير الألوان والإضافة حركات
تحديث Dashboard.tsx - نفس الشي
تحديث IdeasGallery.tsx - نفس الشي
أنا بعطيك الأكواد الآن مباشرة بدون أسئلة! 🚀
لأن الألوان الحالية تستخدم Tailwind، سأضيف ألوان ذهبية وأسود مع تأثيرات حركات، وأحدث ملفات `index.css` وملفات React لتعزيز التصميم.

Lite
✅ تم تحضير الأكواد المحدثة! 🎨
لقد أعددت لك ملفين محدثين بالألوان الذهبية والأسوداء:
📁 الملفات:
1️⃣ updated-index.css
وين تحطه:
افتح ملف index.css الحالي عندك
انسخ محتوى updated-index.css كاملاً وأضفه في نهاية الملف
المميزات:
✅ متغيرات الألوان الذهبية والسوداء
✅ 10+ حركات ناعمة
✅ تأثيرات Hover و Glow
✅ Gradient animations
✅ Backdrop effects
2️⃣ updated-home.tsx
وين تحطه:
استبدل محتوى Home.tsx الحالي بهذا الملف كاملاً
المميزات:
✅ ألوان ذهبية وسوداء
✅ حركات fade-in و slide-in
✅ جسيمات عائمة متحركة
✅ أزرار بتأثيرات hover
✅ نصوص بتأثير Glow
✅ دعم اللغة العربية والإنجليزية
🚀 الخطوات:
افتح index.css وأضف محتوى updated-index.css في النهاية
استبدل Home.tsx بمحتوى updated-home.tsx
احفظ الملفات
أعد تحميل المتصفح (F5)
هل تريد أكواد محدثة لـ Dashboard.tsx و IdeasGallery.tsx أيضاً؟ 🎯
updated-index.css
رمز · 8.13 KB
updated-home.tsx
رمز · 11.14 KB
عرض جميع الملفات في هذه المهمة
كيف كانت هذه النتيجة؟
Lite
ليس لديك رصيد كافٍ. يرجى الترقية عبر الرابط أدناه للمتابعة.
https://manus.go.link/iW6sB?action=open-subscription
تم استنفاد نقاطك. يرجى ترقية خطتك للحصول على المزيد من النقاط.
ترقية



أجهزة الكمبيوتر السحابية
جديد

updated-home.tsx
import { useAuth } from "@/_core/hooks/useAuth";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Moon, Sun } from "lucide-react";

export default function Home() {
  const { user, loading, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [, setLocation] = useLocation();
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; duration: number }>>([]);
  const [lang, setLang] = useState<"ar" | "en">("ar");

  useEffect(() => {
    if (isAuthenticated && !loading) {
      setLocation("/dashboard");
    }
  }, [isAuthenticated, loading, setLocation]);

  // Generate animated particles for Art Deco background
  useEffect(() => {
    const newParticles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 20 + 15,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="min-h-screen bg-black-deep text-white overflow-hidden relative">
      {/* Art Deco Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Geometric lines */}
        <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 1400 800">
          <line x1="0" y1="800" x2="560" y2="0" stroke="#d4af37" strokeWidth="2" />
          <line x1="200" y1="800" x2="760" y2="0" stroke="#d4af37" strokeWidth="1" />
          <line x1="1400" y1="0" x2="840" y2="800" stroke="#d4af37" strokeWidth="2" />
          <line x1="1200" y1="0" x2="640" y2="800" stroke="#d4af37" strokeWidth="1" />
          <circle cx="700" cy="400" r="320" fill="none" stroke="#d4af37" strokeWidth="1" />
          <circle cx="700" cy="400" r="220" fill="none" stroke="#d4af37" strokeWidth="0.5" />
        </svg>

        {/* Animated particles */}
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full bg-gold opacity-30 animate-float"
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              animation: `float ${particle.duration}s infinite ease-in-out`,
              animationDelay: `${particle.id * 0.3}s`,
            }}
          />
        ))}
      </div>

      {/* Navigation Bar - محسّنة */}
      <nav className="relative z-10 border-b border-gold/20 backdrop-blur-sm bg-black-deep/80">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 animate-fade-in">
            <div className="w-10 h-10 rounded-lg bg-gold/10 border border-gold/30 flex items-center justify-center hover-glow">
              <span className="text-xl font-bold text-gold">✦</span>
            </div>
            <span className="text-2xl font-bold tracking-widest text-gold glow-text">AZZA</span>
          </div>

          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gold/10 transition-all duration-300 group"
              title="Toggle Theme"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5 text-gold group-hover:rotate-90 transition-transform duration-300" />
              ) : (
                <Moon className="w-5 h-5 text-gold group-hover:rotate-90 transition-transform duration-300" />
              )}
            </button>

            {/* Language Toggle */}
            <button
              onClick={() => setLang(lang === "ar" ? "en" : "ar")}
              className="px-3 py-2 rounded-lg border border-gold/30 text-gold hover:bg-gold/10 transition-all duration-300 text-sm font-bold"
            >
              {lang.toUpperCase()}
            </button>

            <Button
              variant="outline"
              onClick={() => setLocation("/login")}
              className="border-gold/30 text-gold hover:bg-gold/10 transition-smooth"
            >
              {lang === "ar" ? "دخول" : "Login"}
            </Button>
            <Button
              onClick={() => setLocation("/register")}
              className="bg-gold text-black hover:bg-gold-light transition-smooth font-bold btn-hover"
            >
              {lang === "ar" ? "إنشاء حساب" : "Sign Up"}
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-5 container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gold/30 bg-gold/5 mb-8 animate-fade-in backdrop-glow">
            <span className="w-2 h-2 rounded-full bg-gold animate-pulse-slow"></span>
            <span className="text-sm font-medium text-gold tracking-wide">
              {lang === "ar" ? "منصة الأفكار والابتكار" : "Ideas & Innovation Platform"}
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 leading-tight animate-fade-in-up stagger-1">
            {lang === "ar" ? (
              <>
                حيث تلتقي <span className="text-gold glow-text">الأفكار</span>
                <br />
                بأصحاب <span className="text-gold glow-text">المستقبل</span>
              </>
            ) : (
              <>
                Where <span className="text-gold glow-text">Ideas</span>
                <br />
                Meet <span className="text-gold glow-text">The Future</span>
              </>
            )}
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed max-w-2xl mx-auto animate-fade-in-up stagger-2">
            {lang === "ar"
              ? "منصة احترافية تربط أصحاب الأفكار بالمهارات والمستثمرين. شارك فكرتك، تواصل مع الفريق المناسب، وابن مستقبلك معنا."
              : "A professional platform connecting innovators with talents and investors. Share your idea, connect with the right team, and build your future with us."}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fade-in-up stagger-3">
            <Button
              size="lg"
              onClick={() => setLocation("/register")}
              className="bg-gold text-black hover:bg-gold-light text-base font-semibold px-8 transition-smooth btn-hover"
            >
              {lang === "ar" ? "ابدأ مجاناً الآن" : "Start Free Now"}
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => setLocation("/login")}
              className="border-2 border-gold text-gold hover:bg-gold/10 text-base font-semibold px-8 transition-smooth btn-hover"
            >
              {lang === "ar" ? "تصفح الأفكار" : "Browse Ideas"}
            </Button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 max-w-xs mx-auto mb-12 animate-fade-in-up stagger-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-gold/30"></div>
            <span className="text-gold/50">✦</span>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-gold/30"></div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto animate-fade-in-up stagger-5">
            <div className="text-center p-4 rounded-lg border border-gold/20 bg-gold/5 hover-lift card-hover">
              <div className="text-3xl md:text-4xl font-bold text-gold mb-2 glow-text">+500</div>
              <div className="text-sm text-gray-400 tracking-wide">
                {lang === "ar" ? "فكرة مبتكرة" : "Innovative Ideas"}
              </div>
            </div>
            <div className="text-center p-4 rounded-lg border border-gold/20 bg-gold/5 hover-lift card-hover">
              <div className="text-3xl md:text-4xl font-bold text-gold mb-2 glow-text">+200</div>
              <div className="text-sm text-gray-400 tracking-wide">
                {lang === "ar" ? "مستثمر نشط" : "Active Investors"}
              </div>
            </div>
            <div className="text-center p-4 rounded-lg border border-gold/20 bg-gold/5 hover-lift card-hover">
              <div className="text-3xl md:text-4xl font-bold text-gold mb-2 glow-text">+1K</div>
              <div className="text-sm text-gray-400 tracking-wide">
                {lang === "ar" ? "مستخدم مسجل" : "Registered Users"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-5 container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12 text-gold glow-text">
          {lang === "ar" ? "المميزات الرئيسية" : "Key Features"}
        </h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {[
            {
              icon: "💡",
              title: lang === "ar" ? "شارك فكرتك" : "Share Your Idea",
              description: lang === "ar" 
                ? "انشر فكرتك أمام العالم وجد الفريق المناسب لتحقيقها"
                : "Publish your idea to the world and find the right team",
            },
            {
              icon: "👥",
              title: lang === "ar" ? "تواصل مع الفريق" : "Connect with Team",
              description: lang === "ar"
                ? "التقِ بمطورين ومستثمرين جاهزين للعمل على مشاريعك"
                : "Meet developers and investors ready to work on your projects",
            },
            {
              icon: "🚀",
              title: lang === "ar" ? "ابن مستقبلك" : "Build Your Future",
              description: lang === "ar"
                ? "من الفكرة إلى الواقع - نحن هنا لدعمك في كل خطوة"
                : "From idea to reality - we support you every step",
            },
          ].map((feature, idx) => (
            <div
              key={idx}
              className="p-6 rounded-lg border border-gold/20 bg-gold/5 backdrop-blur hover:border-gold/50 transition-all duration-300 hover-lift card-hover animate-fade-in-up"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className="text-4xl mb-4 hover-scale inline-block">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-gold mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
