

"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, PlayCircle, Puzzle, Disc, CircleDollarSign, Dice5, BookOpenCheck } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import Link from 'next/link';


const bonusGames = [
  {
    name: 'VideAds',
    slug: 'video-play',
    icon: <PlayCircle className="h-8 w-8 text-red-500" />,
    apr: '5.42%',
    isHot: true,
    duration: ['Flexible', '14', '30', '60', '90'],
    action: 'Play',
  },
  {
    name: 'Puzzle Game',
    slug: 'puzzle-game',
    icon: <Puzzle className="h-8 w-8 text-blue-500" />,
    apr: 'Up to 1000',
    isHot: true,
    duration: ['Real-time'],
    action: 'Play',
  },
  {
    name: 'WiseMan',
    slug: 'wiseman',
    icon: <BookOpenCheck className="h-8 w-8 text-purple-500" />,
    apr: '3x or 0x',
    isHot: false,
    duration: ['Per Question'],
    action: 'Play',
  },
  {
    name: 'Coin Flip',
    slug: 'coin-flip',
    icon: <CircleDollarSign className="h-8 w-8 text-yellow-500" />,
    apr: '2x or 0x',
    isHot: false,
    duration: ['Instant'],
    action: 'Play',
  },
    {
    name: 'Lucky Dice',
    slug: 'lucky-dice',
    icon: <Dice5 className="h-8 w-8 text-green-500" />,
    apr: '10.00%',
    isHot: true,
    duration: ['30', '60', '90', '120'],
    action: 'Play',
  },
];

const DurationButton = ({ duration, selected, onClick, special }: { duration: string; selected: boolean; onClick: () => void; special?: boolean }) => {
  if (special) {
    return (
      <div className="relative">
        <Button
          size="sm"
          variant={selected ? "secondary" : "outline"}
          onClick={onClick}
          className={cn("h-8 text-xs z-10", selected && "border-yellow-400")}
        >
          {duration}
        </Button>
        <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-yellow-400 [clip-path:polygon(100%_0,0_0,100%_100%)]"></div>
      </div>
    );
  }

  return (
    <Button
      size="sm"
      variant={selected ? "secondary" : "outline"}
      onClick={onClick}
      className="h-8 text-xs"
    >
      {duration}
    </Button>
  );
};


export default function LeaderboardPage() {
  const [selectedDurations, setSelectedDurations] = useState<{[key: string]: string}>({});
  const [searchTerm, setSearchTerm] = useState('');

  const handleDurationSelect = (game: string, duration: string) => {
    setSelectedDurations(prev => ({...prev, [game]: duration}));
  }

  const filteredGames = bonusGames.filter(game => 
    game.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-grow flex flex-col items-center">
      <Card className="w-full max-w-6xl">
        <CardHeader>
          <CardTitle className="text-2xl">
            Bonus Games
          </CardTitle>
          <CardDescription>Play games to earn more coins and rewards.</CardDescription>
            <div className="relative mt-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search Game" 
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </CardHeader>
        <CardContent>
            {/* Desktop Table */}
            <div className='hidden md:block overflow-x-auto'>
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Game</TableHead>
                        <TableHead>Est. APR</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {filteredGames.map((game) => (
                        <TableRow key={game.name}>
                        <TableCell>
                            <div className="flex items-center gap-3">
                                {game.icon}
                                <div className='font-bold'>{game.name}</div>
                            </div>
                        </TableCell>
                        <TableCell>
                            <div className="flex items-center gap-2">
                                <span className="text-green-500 text-base">{game.apr}</span>
                                {game.isHot && <Badge variant="outline" className="border-red-500 text-red-500 text-[10px]">HOT</Badge>}
                            </div>
                        </TableCell>
                        <TableCell>
                            <div className="flex items-center gap-1 flex-wrap">
                                {game.duration.map(d => (
                                    <DurationButton
                                        key={d}
                                        duration={d}
                                        selected={selectedDurations[game.name] === d}
                                        onClick={() => handleDurationSelect(game.name, d)}
                                        special={game.name === 'Lucky Dice' && d === '120'}
                                    />
                                ))}
                            </div>
                        </TableCell>
                        <TableCell className="text-right">
                           <Button asChild className='bg-yellow-500 hover:bg-yellow-600 text-black'>
                                <Link href={`/bonus/${game.slug}`}>
                                    {game.action}
                                </Link>
                            </Button>
                        </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </div>
             {/* Mobile List */}
             <div className="md:hidden space-y-4">
              {filteredGames.map((game) => (
                <div key={game.slug} className="border-b pb-4 last:border-b-0">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      {game.icon}
                      <div className='font-bold'>{game.name}</div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-green-500 text-base">{game.apr}</span>
                        {game.isHot && <Badge variant="outline" className="border-red-500 text-red-500 text-[10px]">HOT</Badge>}
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground mb-2">Duration</p>
                    <div className="flex items-center gap-1 flex-wrap">
                        {game.duration.map(d => (
                            <DurationButton
                                key={d}
                                duration={d}
                                selected={selectedDurations[game.name] === d}
                                onClick={() => handleDurationSelect(game.name, d)}
                                special={game.name === 'Lucky Dice' && d === '120'}
                            />
                        ))}
                    </div>
                  </div>
                   <Button asChild className='bg-yellow-500 hover:bg-yellow-600 text-black w-full mt-4'>
                        <Link href={`/bonus/${game.slug}`}>
                            {game.action}
                        </Link>
                    </Button>
                </div>
              ))}
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
