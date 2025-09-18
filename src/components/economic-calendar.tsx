
"use client";

import { Flame, Star, MoreHorizontal, ChevronDown, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';

const events = [
    { time: '12:30', currency: 'USD', event: 'Non-Farm Payrolls', impact: 'high', actual: '272K', forecast: '182K', previous: '165K' },
    { time: '12:30', currency: 'USD', event: 'Unemployment Rate', impact: 'high', actual: '4.0%', forecast: '3.9%', previous: '3.9%' },
    { time: '14:00', currency: 'CAD', event: 'Ivey PMI', impact: 'medium', actual: '52.0', forecast: '65.2', previous: '63.0' },
    { time: '18:00', currency: 'USD', event: 'Fed Chair Powell Speaks', impact: 'high', actual: '', forecast: '', previous: '' },
    { time: '23:30', currency: 'JPY', event: 'GDP Annualized', impact: 'low', actual: '-1.8%', forecast: '-1.9%', previous: '-2.0%' },
    { time: 'All Day', currency: 'CNY', event: 'Bank Holiday', impact: 'low', actual: '', forecast: '', previous: '' },
];

const ImpactBadge = ({ impact }: { impact: 'high' | 'medium' | 'low' }) => {
    const variants = {
        high: 'border-red-500 text-red-500',
        medium: 'border-yellow-500 text-yellow-500',
        low: 'border-gray-500 text-gray-500'
    };
    return (
        <div className={cn("flex items-center gap-1", variants[impact])}>
           <Flame className={cn("w-3 h-3", impact === 'high' && "fill-current")} />
           <Flame className={cn("w-3 h-3", impact === 'high' && "fill-current", impact === 'medium' && "fill-current")} />
           <Flame className={cn("w-3 h-3", "fill-current")} />
        </div>
    );
};

export function EconomicCalendar() {
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
                {events.map((event, index) => (
                    <div key={index} className="p-2 space-y-1 hover:bg-muted/50 transition-colors">
                        <div className="grid grid-cols-[40px_35px_1fr] items-center gap-2">
                           <div className="text-xs text-muted-foreground">{event.time}</div>
                           <Badge variant="outline" className="text-xs font-bold w-fit">{event.currency}</Badge>
                           <div className="text-xs font-semibold truncate">{event.event}</div>
                        </div>
                        <div className="grid grid-cols-[40px_1fr] items-center gap-2 pl-[43px]">
                             <div></div>
                             <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <ImpactBadge impact={event.impact as any} />
                                <div className="flex gap-2">
                                    <span>Act: <span className="text-foreground">{event.actual || '-'}</span></span>
                                    <span>Fore: <span className="text-foreground">{event.forecast || '-'}</span></span>
                                    <span>Prev: <span className="text-foreground">{event.previous || '-'}</span></span>
                                </div>
                             </div>
                        </div>
                    </div>
                ))}
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
