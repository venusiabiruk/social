"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, Languages, Menu, X } from "lucide-react";

const Header = () => {
  const pathname = usePathname();
  const [lang, setLang] = useState<"EN" | "አማ">("EN");
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { href: "/dashboard", label: lang === "EN" ? "Create Content" : "ዳሽቦርድ" },
    { href: "/Brand", label: lang === "EN" ? "Brand" : "ብራንድ" },
    { href: "/library", label: lang === "EN" ? "Library" : "ቤተ-መጻህፍት" },
  ];

  const toggleLang = () => {
    setLang((prev) => (prev === "EN" ? "አማ" : "EN"));
  };

  return (
    <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-black font-montserrat text-foreground">
                SocialSpark
              </h1>
              <p className="text-sm text-muted-foreground">
                {lang === "EN"
                  ? "AI-Powered Content Creation for Ethiopian SMEs"
                  : "ለኢትዮጵያ ቢዝነሶች በAI የተነሳ የይዘት ፈጠራ"}
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 font-medium">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`transition transform hover:scale-105 hover:text-accent ${
                  pathname === link.href
                    ? "underline underline-offset-4 text-primary font-semibold"
                    : ""
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Language toggle */}
            <button
              onClick={toggleLang}
              className="flex items-center gap-1 cursor-pointer transition transform hover:scale-105 hover:text-accent"
            >
              <Languages className="w-4 h-4" />
              <span>{lang}</span>
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileOpen && (
          <div className="mt-4 flex flex-col gap-4 md:hidden">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`transition transform hover:scale-105 hover:text-accent ${
                  pathname === link.href
                    ? "underline underline-offset-4 text-primary font-semibold"
                    : ""
                }`}
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={() => {
                toggleLang();
                setMobileOpen(false);
              }}
              className="flex items-center gap-1 cursor-pointer transition transform hover:scale-105 hover:text-accent"
            >
              <Languages className="w-4 h-4" />
              <span>{lang}</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
