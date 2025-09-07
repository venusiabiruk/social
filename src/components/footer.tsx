import React from "react";
import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="w-full border-t bg-white mt-16">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between px-6 py-6 text-sm text-gray-500">
        <p>© {new Date().getFullYear()} SocialSpark. All rights reserved.</p>
        <div className="flex gap-4 mt-3 md:mt-0">
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
};


