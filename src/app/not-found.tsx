import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/button";
import Header from "../components/HomeHeader";

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F7F9FB]">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-10">
          {/* 404 Illustration with Gradient */}
          <div className="space-y-3">
            <h1 className="text-8xl font-extrabold tracking-tight bg-gradient-to-r from-[#0D2A4B] to-[#FBBF24] bg-clip-text text-transparent">
              404
            </h1>
            <div className="w-20 h-1 mx-auto bg-[#2EC4B6] rounded-full" />
          </div>

          {/* Error Message */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-[#0D2A4B]">
              Page Not Found
            </h2>
            <p className="text-[#4B5563] leading-relaxed">
              Oops! The page you’re looking for doesn’t exist or may have been
              moved. Let’s get you back on track.
            </p>
          </div>

          {/* Action Button */}
          <div>
            <Button
              asChild
              className="w-full flex items-center justify-center gap-2 bg-[#FBBF24] text-[#0D2A4B] hover:bg-[#facc15] font-semibold rounded-xl shadow-md transition-all"
            >
              <Link href="/">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
    </div>
  );
}
