"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "./button";
import { Sparkles } from "lucide-react";
import { Brand } from "@/app/types/common";

const Header = () => {
  const [brand, setBrand] = useState<Brand | null>(null);

  useEffect(() => {
    const brandData = localStorage.getItem("brandSetting");
    if (brandData) {
      setBrand(JSON.parse(brandData));
    }
  }, []);
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/90 backdrop-blur-md">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <div className="flex items-center gap-3 mb-0">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold font-montserrat">
              SocialSpark
            </span>
          </div>
        </Link>

        {/* Nav Links */}
        <nav className="flex items-center gap-6 text-sm font-medium">
          {/* Desktop links */}
          <Link
            href="#hero"
            className="hidden md:block text-[#0D2A4B] hover:text-[#2EC4B6]"
          >
            Hero
          </Link>

          <Link
            href="#features"
            className="hidden md:block text-[#0D2A4B] hover:text-[#2EC4B6]"
          >
            Features
          </Link>

          {/* Always show Get started */}
          <Button
            onClick={() =>
              brand
                ? (window.location.href = "/library")
                : (window.location.href = "/Brand")
            }
            className="bg-[#FBBF24] text-[#0D2A4B] hover:bg-[#facc15] rounded-lg px-4 py-2 font-semibold"
          >
            Get started
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
