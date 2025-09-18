
"use client";

import { useState, useEffect } from 'react';
import { Flame, Star, MoreHorizontal, ChevronDown, Calendar, Dot } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';

type CalendarEvent = {
    title: string;
    country: string;
    date: string;
    impact: 'High' | 'Medium' | 'Low' | 'Holiday';
    forecast: string;
    previous: string;
    actual?: string;
};

const ImpactBadge = ({ impact }: { impact: CalendarEvent['impact'] }) => {
    const variants = {
        High: 'border-red-500 text-red-500',
        Medium: 'border-yellow-500 text-yellow-500',
        Low: 'border-gray-500 text-gray-500',
        Holiday: 'border-blue-500 text-blue-500',
    };
    
    if (impact === 'Holiday') {
         return (
            <div className={cn("flex items-center gap-1", variants[impact])}>
                <Dot className="w-4 h-4 fill-current" />
            </div>
        );
    }

    return (
        <div className={cn("flex items-center gap-1", variants[impact])}>
           <Flame className={cn("w-3 h-3", impact === 'High' && "fill-current")} />
           <Flame className={cn("w-3 h-3", impact === 'High' && "fill-current", impact === 'Medium' && "fill-current")} />
           <Flame className={cn("w-3 h-3", "fill-current")} />
        </div>
    );
};

export function EconomicCalendar() {
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch('/api/calendar');
                if (!response.ok) {
                    throw new Error(`Failed to fetch: ${response.statusText}`);
                }
                const data: CalendarEvent[] = await response.json();
                
                const allEvents = data
                    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

                setEvents(allEvents);
            } catch (error) {
                console.error("Failed to fetch economic calendar data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    const formatTime = (dateString: string) => {
        if (!dateString) return 'All Day';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'All Day';
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    };

    return (
        <div className="border-b">
            <div className='p-2 flex items-center justify-between'>
                <h3 className="font-semibold text-sm">Economic Calendar</h3>
                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                        <Calendar className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </div>
            </div>
            <div className="divide-y divide-border">
                {loading ? (
                    Array.from({ length: 5 }).map((_, index) => (
                        <div key={index} className="p-2 space-y-2">
                           <Skeleton className="h-4 w-3/4" />
                           <Skeleton className="h-4 w-1/2" />
                        </div>
                    ))
                ) : events.length > 0 ? (
                    events.slice(0, 10).map((event, index) => (
                        <div key={index} className="p-2 space-y-1 hover:bg-muted/50 transition-colors">
                            <div className="grid grid-cols-[40px_35px_1fr] items-center gap-2">
                               <div className="text-xs text-muted-foreground">{formatTime(event.date)}</div>
                               <Badge variant="outline" className="text-xs font-bold w-fit">{event.country}</Badge>
                               <div className="text-xs font-semibold truncate">{event.title}</div>
                            </div>
                            <div className="grid grid-cols-[40px_1fr] items-center gap-2 pl-[43px]">
                                 <div></div>
                                 <div className="flex items-center justify-between text-xs text-muted-foreground">
                                    <ImpactBadge impact={event.impact} />
                                    <div className="flex gap-2">
                                        <span>Act: <span className="text-foreground">{event.actual || '-'}</span></span>
                                        <span>Fore: <span className="text-foreground">{event.forecast || '-'}</span></span>
                                        <span>Prev: <span className="text-foreground">{event.previous || '-'}</span></span>
                                    </div>
                                 </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="p-4 text-center text-xs text-muted-foreground">
                        No events found for this week.
                    </div>
                )}
            </div>
             <div className="p-2 border-t">
                <Button variant="ghost" size="sm" className="w-full text-xs">
                    Show More
                    <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
