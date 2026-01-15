import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Palette, Type, Check, ChevronDown, X } from "lucide-react";

const fonts = [
  { id: "roboto", name: "Roboto", family: "'Roboto', sans-serif", vibe: "Clean & Modern" },
  { id: "lato", name: "Lato", family: "'Lato', sans-serif", vibe: "Friendly & Professional" },
  { id: "inter", name: "Inter", family: "'Inter', sans-serif", vibe: "Sharp & Technical" },
  { id: "georgia", name: "Georgia", family: "Georgia, serif", vibe: "Classic & Trustworthy" },
  { id: "system", name: "System UI", family: "system-ui, sans-serif", vibe: "Native & Fast" },
];

const themes = [
  { id: "blue", name: "Professional Blue", primary: "220 65% 40%", accent: "20 65% 50%" },
  { id: "teal", name: "Modern Teal", primary: "175 55% 35%", accent: "38 75% 50%" },
  { id: "indigo", name: "Deep Indigo", primary: "240 55% 45%", accent: "350 50% 52%" },
  { id: "emerald", name: "Fresh Emerald", primary: "155 55% 35%", accent: "210 65% 48%" },
  { id: "slate", name: "Executive Slate", primary: "220 15% 30%", accent: "20 65% 50%" },
];

export function ThemeSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"font" | "theme">("font");
  const [currentFont, setCurrentFont] = useState("roboto");
  const [currentTheme, setCurrentTheme] = useState("blue");

  // Apply font changes
  useEffect(() => {
    const font = fonts.find(f => f.id === currentFont);
    if (font) {
      document.documentElement.style.setProperty("--font-body", font.family);
      document.body.style.fontFamily = font.family;
      document.querySelectorAll("h1, h2, h3, h4, h5, h6").forEach(el => {
        (el as HTMLElement).style.fontFamily = font.family;
      });
    }
  }, [currentFont]);

  // Apply theme changes
  useEffect(() => {
    const theme = themes.find(t => t.id === currentTheme);
    if (theme) {
      document.documentElement.style.setProperty("--primary", theme.primary);
      document.documentElement.style.setProperty("--accent", theme.accent);
    }
  }, [currentTheme]);

  return (
    <div className="relative">
      {/* Trigger Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
          isOpen 
            ? "bg-primary/10 text-primary border border-primary/20" 
            : "text-foreground/70 hover:text-foreground hover:bg-foreground/5 border border-transparent"
        }`}
      >
        <Palette className="w-4 h-4" />
        <span className="hidden sm:inline">Customize</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </motion.button>

      {/* Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
              className="absolute right-0 top-full mt-2 w-[320px] sm:w-[360px] bg-card rounded-2xl shadow-2xl border border-border z-50 overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h3 className="font-display font-semibold text-foreground">Customize Experience</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-border">
                {[
                  { id: "font", icon: Type, label: "Typography" },
                  { id: "theme", icon: Palette, label: "Colors" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as "font" | "theme")}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-all duration-300 relative ${
                      activeTab === tab.id 
                        ? "text-primary" 
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                    {activeTab === tab.id && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                      />
                    )}
                  </button>
                ))}
              </div>

              {/* Content */}
              <div className="p-4 max-h-[400px] overflow-y-auto">
                <AnimatePresence mode="wait">
                  {activeTab === "font" ? (
                    <motion.div
                      key="font"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="space-y-2"
                    >
                      {fonts.map((font) => (
                        <button
                          key={font.id}
                          onClick={() => setCurrentFont(font.id)}
                          className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-300 ${
                            currentFont === font.id
                              ? "bg-primary/10 border border-primary/20"
                              : "hover:bg-muted/50 border border-transparent"
                          }`}
                        >
                          <div className="text-left">
                            <p 
                              className="font-semibold text-foreground"
                              style={{ fontFamily: font.family }}
                            >
                              {font.name}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">{font.vibe}</p>
                          </div>
                          {currentFont === font.id && (
                            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                              <Check className="w-3.5 h-3.5 text-primary-foreground" />
                            </div>
                          )}
                        </button>
                      ))}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="theme"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="space-y-2"
                    >
                      {themes.map((theme) => (
                        <button
                          key={theme.id}
                          onClick={() => setCurrentTheme(theme.id)}
                          className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-300 ${
                            currentTheme === theme.id
                              ? "bg-primary/10 border border-primary/20"
                              : "hover:bg-muted/50 border border-transparent"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex gap-1">
                              <div 
                                className="w-5 h-5 rounded-full shadow-sm border border-white/20"
                                style={{ backgroundColor: `hsl(${theme.primary})` }}
                              />
                              <div 
                                className="w-5 h-5 rounded-full shadow-sm border border-white/20 -ml-1.5"
                                style={{ backgroundColor: `hsl(${theme.accent})` }}
                              />
                            </div>
                            <p className="font-medium text-foreground text-sm">{theme.name}</p>
                          </div>
                          {currentTheme === theme.id && (
                            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                              <Check className="w-3.5 h-3.5 text-primary-foreground" />
                            </div>
                          )}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer hint */}
              <div className="px-4 pb-4">
                <p className="text-xs text-muted-foreground text-center">
                  Changes apply instantly. Refresh to reset.
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
