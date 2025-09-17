"use client"

import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Newspaper, ChevronRight } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

const blogPosts = [
    {
        title: "Kotela Coin (KTC) Hits All-Time High Amidst Market Surge",
        excerpt: "Kotela Coin has shattered previous records, reaching an unprecedented value as market enthusiasm grows...",
        date: "2 hours ago",
        category: "Market Update",
        href: "#"
    },
    {
        title: "New, More Efficient Mining Algorithm Deployed on the Kotela Network",
        excerpt: "Today, we've rolled out a significant update to our mining protocol that enhances efficiency and security...",
        date: "1 day ago",
        category: "Technology",
        href: "#"
    },
    {
        title: "Kotela Announces Strategic Partnership with Firebase for Web3 Integration",
        excerpt: "In a landmark move, Kotela is partnering with Google's Firebase to build the next generation of decentralized apps...",
        date: "3 days ago",
        category: "Partnerships",
        href: "#"
    },
    {
        title: "Community Spotlight: Top Miners of the Month",
        excerpt: "We're celebrating the achievements of our most dedicated miners. See who topped the leaderboards this month...",
        date: "4 days ago",
        category: "Community",
        href: "#"
    },
    {
        title: "A Guide to Understanding Kotela's Tokenomics",
        excerpt: "Dive deep into the economic model of KTC, from total supply to distribution and utility within the ecosystem.",
        date: "5 days ago",
        category: "Education",
        href: "#"
    }
];

interface BlogWidgetProps {
    limit?: number;
    showViewAll?: boolean;
}

export function BlogWidget({ limit, showViewAll }: BlogWidgetProps) {
  const postsToShow = limit ? blogPosts.slice(0, limit) : blogPosts;
  
  return (
    <Card className="w-full max-w-md">
        <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
                <Newspaper className="h-5 w-5" />
                <span>News & Trends</span>
            </CardTitle>
            <CardDescription className="text-xs">
                The latest updates and news from the Kotela ecosystem.
            </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            {postsToShow.map((post, index) => (
                <Link key={index} href={post.href} className="block group">
                    <div className="p-3 rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-center justify-between">
                            <Badge variant="outline" className="mb-2 text-xs">{post.category}</Badge>
                            <span className="text-xs text-muted-foreground">{post.date}</span>
                        </div>
                        <h4 className="font-semibold group-hover:text-primary transition-colors">{post.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{post.excerpt}</p>
                         <div className="flex items-center justify-end text-primary text-xs font-semibold mt-2 invisible group-hover:visible">
                            Read More <ChevronRight className="h-4 w-4" />
                        </div>
                    </div>
                </Link>
            ))}
        </CardContent>
        {showViewAll && (
            <CardFooter className="border-t p-2">
                <Button variant="ghost" asChild className="w-full text-xs">
                    <Link href="/news">
                        View All News
                        <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                </Button>
            </CardFooter>
        )}
    </Card>
  );
}
