
"use client"

import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Newspaper, ChevronRight } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

export type BlogPost = {
    title: string;
    excerpt: string;
    content: string;
    date: string;
    updatedDate: string;
    readTime: string;
    category: string;
    href: string;
    image: string;
    imageHint: string;
    author: string;
    authorImage: string;
};

const blogPosts: BlogPost[] = [
    {
        title: "Kotela Coin (KTC) Hits All-Time High Amidst Market Surge",
        excerpt: "Kotela Coin has shattered previous records, reaching an unprecedented value as market enthusiasm grows...",
        content: "The price of Kotela Coin (KTC) surged by over 40% in the last 24 hours, reaching an all-time high of $1.75. This rally is attributed to a combination of positive market sentiment, recent technological upgrades to the Kotela network, and increased adoption by institutional investors. Analysts are optimistic about its short-term performance, with some predicting it could break the $2.00 barrier by the end of the week.",
        date: "2 hours ago",
        updatedDate: "Dec 13th, 2024",
        readTime: "14 minutes read",
        category: "Market Update",
        href: "#",
        image: "https://picsum.photos/seed/ktc-high/800/600",
        imageHint: "market chart",
        author: "Kevin Groves",
        authorImage: "https://picsum.photos/seed/author1/40/40"
    },
    {
        title: "New, More Efficient Mining Algorithm Deployed on the Kotela Network",
        excerpt: "Today, we've rolled out a significant update to our mining protocol that enhances efficiency and security...",
        content: "The Kotela development team has successfully deployed the 'Phoenix' update, which introduces a new proof-of-stake mining algorithm. This change is expected to reduce energy consumption by up to 95% and significantly increase transaction throughput. The update aims to make the network more sustainable and scalable, paving the way for wider adoption of KTC-based applications.",
        date: "1 day ago",
        updatedDate: "Dec 12th, 2024",
        readTime: "8 minutes read",
        category: "Technology",
        href: "#",
        image: "https://picsum.photos/seed/mining-algo/800/600",
        imageHint: "network code",
        author: "Kevin Groves",
        authorImage: "https://picsum.photos/seed/author1/40/40"
    },
    {
        title: "Kotela Announces Strategic Partnership with Firebase for Web3 Integration",
        excerpt: "In a landmark move, Kotela is partnering with Google's Firebase to build the next generation of decentralized apps...",
        content: "This strategic partnership will combine Kotela's robust blockchain infrastructure with Firebase's powerful suite of development tools. The collaboration aims to simplify the process for developers to build, deploy, and manage decentralized applications (dApps) on the Kotela network, leveraging Firebase for authentication, data storage, and more.",
        date: "3 days ago",
        updatedDate: "Dec 10th, 2024",
        readTime: "5 minutes read",
        category: "Partnerships",
        href: "#",
        image: "https://picsum.photos/seed/partnership/800/600",
        imageHint: "handshake business",
        author: "Kevin Groves",
        authorImage: "https://picsum.photos/seed/author1/40/40"
    },
    {
        title: "Community Spotlight: Top Miners of the Month",
        excerpt: "We're celebrating the achievements of our most dedicated miners. See who topped the leaderboards this month...",
        content: "This month, we recognize the top three miners who have contributed significantly to the network's security and stability. 'MinerX_24', 'CryptoQueen', and 'KTC_Hodler' have shown exceptional performance and dedication. We'll be sending them an exclusive Kotela merchandise package as a token of our appreciation. Join us in congratulating them!",
        date: "4 days ago",
        updatedDate: "Dec 9th, 2024",
        readTime: "3 minutes read",
        category: "Community",
        href: "#",
        image: "https://picsum.photos/seed/community-miners/800/600",
        imageHint: "community people",
        author: "Kevin Groves",
        authorImage: "https://picsum.photos/seed/author1/40/40"
    },
    {
        title: "A Guide to Understanding Kotela's Tokenomics",
        excerpt: "Dive deep into the economic model of KTC, from total supply to distribution and utility within the ecosystem.",
        content: "Kotela Coin's tokenomics are designed for long-term stability and growth. With a fixed total supply of 1 billion KTC, the model includes mechanisms for deflationary pressure and rewards for network participants. This guide breaks down the allocation, vesting schedules, and the various utilities of KTC within our expanding ecosystem, from transaction fees to governance.",
        date: "5 days ago",
        updatedDate: "Dec 8th, 2024",
        readTime: "10 minutes read",
        category: "Education",
        href: "#",
        image: "https://picsum.photos/seed/tokenomics/800/600",
        imageHint: "coins crypto",
        author: "Kevin Groves",
        authorImage: "https://picsum.photos/seed/author1/40/40"
    }
];

export { blogPosts };

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
                <Link key={index} href="/news" className="block group">
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
