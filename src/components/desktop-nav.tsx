"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Pickaxe, Coins, TrendingUp, User, Gift, Newspaper } from "lucide-react"
import { cn } from "@/lib/utils"
import { useGame } from "@/context/GameContext"

const navItems = [
  { href: "/", label: "Mine", icon: Pickaxe },
  { href: "/leaderboard", label: "Bonus", icon: Gift },
  { href: "/ratings", label: "Ratings", icon: TrendingUp },
  { href: "/news", label: "News", icon: Newspaper },
  { href: "/profile", label: "Profile", icon: User },
];

export function DesktopNav() {
  const pathname = usePathname();
  const { gameState, score } = useGame();

  return (
    <nav className="hidden items-center gap-2 md:flex">
      {navItems.map((item) => {
        const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/");
        const isMining = gameState === "playing" && item.href === "/";
        
        return (
          <Button
            key={item.href}
            variant={isActive ? "secondary" : "ghost"}
            asChild
            className={cn(isActive && "font-bold", isMining && "animate-pulse")}
          >
            <Link href={item.href}>
              <item.icon className="mr-2" /> 
              {isMining ? (
                <span>Mining: {score.toLocaleString()}</span>
              ) : (
                item.label
              )}
            </Link>
          </Button>
        );
      })}
    </nav>
  );
}
