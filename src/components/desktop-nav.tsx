"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Pickaxe, Coins, TrendingUp, User } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/", label: "Mine", icon: Pickaxe },
  { href: "/leaderboard", label: "Leaderboard", icon: Coins },
  { href: "/ratings", label: "Ratings", icon: TrendingUp },
  { href: "/profile", label: "Profile", icon: User },
];

export function DesktopNav() {
  const pathname = usePathname();

  return (
    <nav className="hidden items-center gap-2 md:flex">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Button
            key={item.href}
            variant={isActive ? "secondary" : "ghost"}
            asChild
            className={cn(isActive && "font-bold")}
          >
            <Link href={item.href}>
              <item.icon className="mr-2" /> {item.label}
            </Link>
          </Button>
        );
      })}
    </nav>
  );
}
