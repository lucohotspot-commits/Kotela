"use client"

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, Newspaper } from 'lucide-react';
import { blogPosts } from '@/components/blog-widget';
import { cn } from '@/lib/utils';

export default function NewsPage() {
    const [selectedPost, setSelectedPost] = useState(blogPosts[0]);

    return (
        <div className="w-full max-w-6xl mx-auto space-y-6">
            <Breadcrumb>
                <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                        <Link href="/">Home</Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                    <ChevronRight />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                    <BreadcrumbPage>News</BreadcrumbPage>
                </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
             <div className="flex items-center gap-2">
                <Newspaper className="h-6 w-6" />
                <h1 className="text-2xl font-bold">News & Trends</h1>
            </div>

            <Card className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-0 overflow-hidden h-[calc(100vh-15rem)]">
                <div className="md:col-span-1 lg:col-span-1 border-r">
                    <CardHeader className="p-4 border-b">
                        <CardTitle className="text-base">All Articles</CardTitle>
                    </CardHeader>
                    <ScrollArea className="h-[calc(100vh-20rem)]">
                        <div className="flex flex-col">
                            {blogPosts.map((post) => (
                                <button
                                    key={post.title}
                                    onMouseEnter={() => setSelectedPost(post)}
                                    onClick={() => setSelectedPost(post)}
                                    className={cn(
                                        "text-left p-4 border-b hover:bg-muted/50 transition-colors",
                                        selectedPost.title === post.title && "bg-muted"
                                    )}
                                >
                                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                                        <Badge variant="outline">{post.category}</Badge>
                                        <span>{post.date}</span>
                                    </div>
                                    <h3 className="font-semibold text-sm">{post.title}</h3>
                                </button>
                            ))}
                        </div>
                    </ScrollArea>
                </div>
                <div className="md:col-span-2 lg:col-span-3">
                     {selectedPost ? (
                        <ScrollArea className="h-[calc(100vh-15rem)]">
                            <div className="p-6">
                                <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-6">
                                    <Image 
                                        src={selectedPost.image} 
                                        alt={selectedPost.title} 
                                        fill 
                                        className="object-cover"
                                        data-ai-hint={selectedPost.imageHint}
                                    />
                                </div>
                                <h2 className="text-2xl font-bold mb-2">{selectedPost.title}</h2>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                                    <span>{selectedPost.date}</span>
                                    <Badge variant="secondary">{selectedPost.category}</Badge>
                                </div>
                                <div className="prose prose-sm dark:prose-invert max-w-none text-foreground/90">
                                    <p>{selectedPost.content}</p>
                                </div>
                            </div>
                        </ScrollArea>
                     ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground">
                            <p>Select an article to read</p>
                        </div>
                     )}
                </div>
            </Card>
        </div>
    );
}
