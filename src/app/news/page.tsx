"use client"

import { BlogWidget } from '@/components/blog-widget';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function NewsPage() {
    return (
        <div className="w-full max-w-4xl mx-auto space-y-6">
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
            <BlogWidget />
        </div>
    );
}
