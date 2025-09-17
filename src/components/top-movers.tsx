
"use client";

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function TopMovers() {

  return (
    <div>
        <div className='p-2'>
            <h3 className="font-semibold text-sm">Top Movers</h3>
        </div>
        <div className='p-2'>
            <Tabs defaultValue="all" className="w-full">
                <TabsList className="w-full justify-start h-8 p-0 bg-transparent rounded-none">
                    <TabsTrigger value="all" className="text-xs px-2 data-[state=active]:bg-muted data-[state=active]:shadow-none">All</TabsTrigger>
                    <TabsTrigger value="change" className="text-xs px-2 data-[state=active]:bg-muted data-[state=active]:shadow-none">Change</TabsTrigger>
                    <TabsTrigger value="new" className="text-xs px-2 data-[state=active]:bg-muted data-[state=active]:shadow-none">New High/Low</TabsTrigger>
                </TabsList>
            </Tabs>
            <div className="text-center text-muted-foreground p-8 text-xs">
                Top Movers data will be displayed here.
            </div>
        </div>
    </div>
  );
}
