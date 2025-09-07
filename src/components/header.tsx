
import React from "react";
import Link from "next/link";
import { Button } from "./button";
const Header = () => {
  return (

    <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
  <div className="container mx-auto px-4 py-4 flex items-center justify-between">
    {/* Left side: Brand title + subtitle */}
    <div>
      <h1 className="text-xl font-black font-montserrat text-foreground">Brand setup</h1>
      <p className="text-sm text-muted-foreground">configure your brand identity</p>
    </div>

    {/* Right side: Navigation + Save button */}
    <div className="flex items-center gap-6">
      <nav className="flex items-center gap-4 text-sm text-foreground font-medium">
        <Link href="">Library</Link>
        <Link href="">Editor</Link>
        <Link href="">Schedule</Link>
        <Link href="/Brand">Brand</Link>
      </nav>

      <Button>
        Save Changes
      </Button>
    </div>
  </div>
</header>

  );
};

export default Header;

