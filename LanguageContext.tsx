import React, { createContext, useContext, useEffect, useState } from "react";

type Language = "ar" | "en";

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string, defaultValue?: string) => string;
  dir: "rtl" | "ltr";
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation dictionary
const translations: Record<Language, Record<string, string>> = {
  ar: {
    "app.title": "AZZA",
    "app.subtitle": "منصة الأفكار والابتكار",
    "app.description": "منصة احترافية تربط أصحاب الأفكار بالمهارات والمستثمرين",
    "nav.browse": "تصفح الأفكار",
    "nav.chat": "المساعد الذكي",
    "nav.login": "دخول",
    "nav.signup": "إنشاء حساب",
    "nav.logout": "تسجيل الخروج",
    "nav.dashboard": "لوحة التحكم",
    "hero.badge": "منصة الأفكار والابتكار",
    "hero.title": "حيث تلتقي الأفكار بأصحاب المستقبل",
    "hero.description": "منصة احترافية تربط أصحاب الأفكار بالمهارات والمستثمرين. شارك فكرتك، تواصل مع الفريق المناسب، وابن مستقبلك معنا.",
    "hero.cta1": "ابدأ مجاناً الآن",
    "hero.cta2": "تصفح الأفكار",
    "stats.ideas": "فكرة مشتركة",
    "stats.investors": "مستثمر نشط",
    "stats.users": "مستخدم مسجل",
    "ideas.title": "تصفح الأفكار",
    "ideas.subtitle": "اكتشف أفكاراً مبتكرة وتواصل مع أصحابها",
    "ideas.search": "ابحث عن أفكار...",
    "ideas.category": "الفئة",
    "ideas.stage": "المرحلة",
    "ideas.allCategories": "جميع الفئات",
    "ideas.allStages": "جميع المراحل",
    "ideas.clearFilters": "مسح الفلاتر",
    "ideas.noResults": "لا توجد أفكار تطابق البحث",
    "ideas.author": "صاحب الفكرة",
    "ideas.viewDetails": "عرض التفاصيل",
    "ideas.contact": "التواصل مع صاحب الفكرة",
    "ideas.save": "حفظ الفكرة",
    "ideas.published": "تاريخ النشر",
    "ideas.stage.idea": "فكرة",
    "ideas.stage.prototype": "نموذج أولي",
    "ideas.stage.live": "مشروع قائم",
    "chat.title": "مساعد AZZA الذكي",
    "chat.subtitle": "اسأل عن الأفكار والمشاريع والمستثمرين والمزيد",
    "chat.placeholder": "اكتب رسالتك هنا...",
    "chat.start": "ابدأ محادثة مع مساعد AZZA الذكي",
    "chat.startDesc": "يمكنك السؤال عن الأفكار والمشاريع والمستثمرين والفرص",
    "chat.typing": "جاري الكتابة...",
    "auth.login": "دخول",
    "auth.signup": "إنشاء حساب",
    "auth.email": "البريد الإلكتروني",
    "auth.password": "كلمة المرور",
    "auth.confirmPassword": "تأكيد كلمة المرور",
    "auth.fullName": "الاسم الكامل",
    "auth.userType": "نوع الحساب",
    "auth.ideaOwner": "صاحب فكرة",
    "auth.skillOwner": "صاحب مهارة",
    "auth.investor": "مستثمر",
    "auth.submit": "دخول",
    "auth.signupSubmit": "إنشاء حساب",
    "auth.haveAccount": "هل لديك حساب بالفعل؟",
    "auth.noAccount": "ليس لديك حساب؟",
    "auth.mausLogin": "دخول عبر Manus",
    "createIdea.title": "نشر فكرة جديدة",
    "createIdea.subtitle": "شارك فكرتك مع المجتمع والمستثمرين والمتخصصين",
    "createIdea.titleLabel": "عنوان الفكرة",
    "createIdea.descriptionLabel": "وصف الفكرة",
    "createIdea.categoryLabel": "الفئة",
    "createIdea.stageLabel": "مرحلة المشروع",
    "createIdea.mediaLabel": "رفع الصور والفيديوهات (اختياري)",
    "createIdea.submit": "نشر الفكرة",
    "createIdea.success": "تم نشر الفكرة بنجاح!",
    "createIdea.error": "حدث خطأ أثناء نشر الفكرة",
    "dashboard.title": "لوحة التحكم",
    "dashboard.welcome": "أهلاً بك",
    "dashboard.myIdeas": "أفكاري",
    "dashboard.createIdea": "+ نشر فكرة جديدة",
    "common.loading": "جاري التحميل...",
    "common.error": "حدث خطأ",
    "common.success": "تم بنجاح",
    "common.back": "العودة",
    "common.home": "الرئيسية",
  },
  en: {
    "app.title": "AZZA",
    "app.subtitle": "Ideas & Innovation Platform",
    "app.description": "A professional platform connecting idea owners with skills and investors",
    "nav.browse": "Browse Ideas",
    "nav.chat": "Smart Assistant",
    "nav.login": "Login",
    "nav.signup": "Sign Up",
    "nav.logout": "Logout",
    "nav.dashboard": "Dashboard",
    "hero.badge": "Ideas & Innovation Platform",
    "hero.title": "Where Ideas Meet the Future",
    "hero.description": "A professional platform connecting idea owners with skills and investors. Share your idea, connect with the right team, and build your future with us.",
    "hero.cta1": "Start Free Now",
    "hero.cta2": "Browse Ideas",
    "stats.ideas": "Shared Ideas",
    "stats.investors": "Active Investors",
    "stats.users": "Registered Users",
    "ideas.title": "Browse Ideas",
    "ideas.subtitle": "Discover innovative ideas and connect with their creators",
    "ideas.search": "Search for ideas...",
    "ideas.category": "Category",
    "ideas.stage": "Stage",
    "ideas.allCategories": "All Categories",
    "ideas.allStages": "All Stages",
    "ideas.clearFilters": "Clear Filters",
    "ideas.noResults": "No ideas match your search",
    "ideas.author": "Idea Owner",
    "ideas.viewDetails": "View Details",
    "ideas.contact": "Contact Idea Owner",
    "ideas.save": "Save Idea",
    "ideas.published": "Published Date",
    "ideas.stage.idea": "Idea",
    "ideas.stage.prototype": "Prototype",
    "ideas.stage.live": "Live Project",
    "chat.title": "AZZA Smart Assistant",
    "chat.subtitle": "Ask about ideas, projects, investors and more",
    "chat.placeholder": "Type your message here...",
    "chat.start": "Start a conversation with AZZA Smart Assistant",
    "chat.startDesc": "You can ask about ideas, projects, investors and opportunities",
    "chat.typing": "Typing...",
    "auth.login": "Login",
    "auth.signup": "Sign Up",
    "auth.email": "Email",
    "auth.password": "Password",
    "auth.confirmPassword": "Confirm Password",
    "auth.fullName": "Full Name",
    "auth.userType": "Account Type",
    "auth.ideaOwner": "Idea Owner",
    "auth.skillOwner": "Skill Owner",
    "auth.investor": "Investor",
    "auth.submit": "Login",
    "auth.signupSubmit": "Sign Up",
    "auth.haveAccount": "Already have an account?",
    "auth.noAccount": "Don't have an account?",
    "auth.mausLogin": "Login with Manus",
    "createIdea.title": "Publish New Idea",
    "createIdea.subtitle": "Share your idea with the community, investors and specialists",
    "createIdea.titleLabel": "Idea Title",
    "createIdea.descriptionLabel": "Idea Description",
    "createIdea.categoryLabel": "Category",
    "createIdea.stageLabel": "Project Stage",
    "createIdea.mediaLabel": "Upload Images and Videos (Optional)",
    "createIdea.submit": "Publish Idea",
    "createIdea.success": "Idea published successfully!",
    "createIdea.error": "Error publishing idea",
    "dashboard.title": "Dashboard",
    "dashboard.welcome": "Welcome",
    "dashboard.myIdeas": "My Ideas",
    "dashboard.createIdea": "+ Publish New Idea",
    "common.loading": "Loading...",
    "common.error": "Error",
    "common.success": "Success",
    "common.back": "Back",
    "common.home": "Home",
  },
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("language") as Language) || "ar";
    }
    return "ar";
  });

  useEffect(() => {
    localStorage.setItem("language", lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  const t = (key: string, defaultValue: string = key): string => {
    return translations[lang][key] || translations["en"][key] || defaultValue;
  };

  const value: LanguageContextType = {
    lang,
    setLang: setLangState,
    t,
    dir: lang === "ar" ? "rtl" : "ltr",
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
