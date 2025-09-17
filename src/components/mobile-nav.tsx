"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Pickaxe, Coins, TrendingUp, User, Gift, Newspaper } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGame } from "@/context/GameContext";

const navItems = [
  { href: "/", label: "Mine", icon: Pickaxe },
  { href: "/leaderboard", label: "Bonus", icon: Gift },
  { href: "/ratings", label: "Ratings", icon: TrendingUp },
  { href: "/news", label: "News", icon: Newspaper },
  { href: "/profile", label: "Profile", icon: User },
];

export function MobileNav() {
  const pathname = usePathname();
  const { gameState, score } = useGame();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 z-50 w-full h-16 bg-background border-t">
      <div className="grid h-full grid-cols-5 mx-auto font-medium">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/");
          const isMining = gameState === "playing" && item.href === "/";
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "inline-flex flex-col items-center justify-center px-2 hover:bg-accent",
                isActive ? "text-primary" : "text-muted-foreground",
                 isMining ? "animate-pulse" : ""
              )}
            >
              <item.icon className="w-5 h-5 mb-1" />
               <span className="text-xs">
                {isMining ? score.toLocaleString() : item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
