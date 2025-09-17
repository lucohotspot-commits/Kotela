
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, PlayCircle, Plane, Disc, CircleDollarSign, Dice5 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';


const bonusGames = [
  {
    name: 'Video Play',
    icon: <PlayCircle className="h-8 w-8 text-red-500" />,
    apr: '5.42%',
    isHot: true,
    duration: ['Flexible', '14', '30', '60', '90'],
    action: 'Play',
  },
  {
    name: 'Aviator',
    icon: <Plane className="h-8 w-8 text-blue-500" />,
    apr: 'Up to 25x',
    isHot: true,
    duration: ['Real-time'],
    action: 'Play',
  },
  {
    name: 'Spin the Wheel',
    icon: <Disc className="h-8 w-8 text-purple-500" />,
    apr: '0.88%',
    isHot: false,
    duration: ['Daily'],
    action: 'Play',
  },
  {
    name: 'Coin Flip',
    icon: <CircleDollarSign className="h-8 w-8 text-yellow-500" />,
    apr: '2x or 0x',
    isHot: false,
    duration: ['Instant'],
    action: 'Play',
  },
    {
    name: 'Lucky Dice',
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
            <div className='overflow-x-auto'>
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
                            <div className='flex items-center gap-2'>
                                <span className='text-green-500 font-semibold text-base'>{game.apr}</span>
                                {game.isHot && <Badge variant="destructive">HOT</Badge>}
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
                            <Button className='bg-yellow-500 hover:bg-yellow-600 text-black'>
                                {game.action}
                            </Button>
                        </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
