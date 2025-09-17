
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Plane, Coins, Disc, CircleDollarSign, Dice5, PlayCircle, Video, Award, Clock } from 'lucide-react';
import { useParams } from 'next/navigation';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { cn } from '@/lib/utils';


const gameDetails: { [key: string]: { name: string; description: string } } = {
  'aviator': {
    name: 'Aviator',
    description: 'Watch the multiplier grow and cash out before the plane flies away!'
  },
  'video-play': {
    name: 'Video Play',
    description: 'Watch videos to earn rewards.'
  },
  'spin-the-wheel': {
    name: 'Spin the Wheel',
    description: 'Spin the wheel for a chance to win big!'
  },
  'coin-flip': {
    name: 'Coin Flip',
    description: 'Double or nothing! Flip a coin to test your luck.'
  },
  'lucky-dice': {
    name: 'Lucky Dice',
    description: 'Roll the dice and win rewards based on your roll.'
  }
};

const videos = [
    { id: 1, title: 'Introduction to Kotela', duration: '1:35', reward: 50, image: PlaceHolderImages[0] },
    { id: 2, title: 'How to use the Store', duration: '2:10', reward: 75, image: PlaceHolderImages[1] },
    { id: 3, title: 'Advanced Mining Techniques', duration: '3:00', reward: 100, image: PlaceHolderImages[2] },
    { id: 4, title: 'Community Highlights', duration: '5:20', reward: 150, image: PlaceHolderImages[3] },
]

const AviatorGame = () => {
  const [multiplier, setMultiplier] = useState(1.00);
  const [gameState, setGameState] = useState<'waiting' | 'playing' | 'crashed'>('waiting');

  useEffect(() => {
    let gameLoop: NodeJS.Timeout;
    if (gameState === 'playing') {
      const crashPoint = Math.random() * 10 + 1; // Plane flies away between 1x and 11x
      gameLoop = setInterval(() => {
        setMultiplier(m => {
            const nextMultiplier = m + 0.01;
            if (nextMultiplier >= crashPoint) {
                setGameState('crashed');
                clearInterval(gameLoop);
                return crashPoint;
            }
            return nextMultiplier;
        });
      }, 100);
    } else {
      setMultiplier(1.00);
    }
    return () => clearInterval(gameLoop);
  }, [gameState]);

  const handleBet = () => {
    setGameState('playing');
  };

  const handleCashOut = () => {
    // In a real game, you would reward the player here based on the multiplier
    setGameState('waiting');
  }

  const handleReset = () => {
    setGameState('waiting');
  };

  return (
    <div className='flex flex-col gap-4'>
        <Card>
            <CardContent className="p-4">
            <div className="relative aspect-video w-full bg-muted/20 rounded-lg overflow-hidden flex items-center justify-center">
                {/* Grid background */}
                <div className="absolute inset-0 z-0" style={{ backgroundImage: 'linear-gradient(rgba(128,128,128,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(128,128,128,0.2) 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                
                <div className="absolute inset-0 flex items-center justify-center">
                {gameState === 'playing' && (
                    <div className="relative">
                    <Plane className="h-16 w-16 text-primary transform -rotate-45 animate-pulse" />
                    <p className="absolute -top-8 left-1/2 -translate-x-1/2 text-2xl font-bold text-primary">{multiplier.toFixed(2)}x</p>
                    </div>
                )}
                {gameState === 'waiting' && (
                    <p className="text-2xl font-semibold text-muted-foreground">Waiting for next round...</p>
                )}
                {gameState === 'crashed' && (
                    <div className="text-center">
                    <p className="text-4xl font-bold text-destructive">Flew Away!</p>
                    <p className="text-lg text-muted-foreground">Multiplier: {multiplier.toFixed(2)}x</p>
                    </div>
                )}
                </div>
            </div>
            </CardContent>
        </Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="flex-1">
            <CardHeader className="pb-2">
                <CardTitle className="text-base">Bet Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">-</Button>
                    <Input defaultValue="1.00" className="text-center" />
                    <Button variant="outline" size="sm">+</Button>
                    <Coins className="text-yellow-500" />
                </div>
                {gameState === 'waiting' && (
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white text-lg h-12" onClick={handleBet}>
                    Bet
                </Button>
                )}
                {gameState === 'playing' && (
                    <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black text-lg h-12" onClick={handleCashOut}>
                        Cash Out
                    </Button>
                )}
                {gameState === 'crashed' && (
                <Button className="w-full text-lg h-12" onClick={handleReset} variant="secondary">
                    Play Again
                </Button>
                )}
            </CardContent>
            </Card>
            
            <Card className="flex-1">
            <CardHeader className="pb-2">
                <CardTitle className="text-base">Auto Play</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                <Label htmlFor="auto-bet">Auto Bet</Label>
                <Switch id="auto-bet" />
                </div>
                <div className="flex items-center justify-between">
                <Label htmlFor="auto-cashout">Auto Cashout</Label>
                <Switch id="auto-cashout" />
                </div>
                <div className='relative'>
                    <Input type="text" placeholder='Multiplier' defaultValue={"1.50"} />
                    <span className='absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground'>x</span>
                </div>
            </CardContent>
            </Card>
        </div>
    </div>
  );
}

const VideoPlayGame = () => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {videos.map(video => (
                <Card key={video.id}>
                    <CardContent className='p-0'>
                        <div className="relative aspect-video">
                            <Image src={video.image.imageUrl} alt={video.title} fill className="rounded-t-lg object-cover" data-ai-hint={video.image.imageHint} />
                             <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded">
                                {video.duration}
                            </div>
                        </div>
                    </CardContent>
                    <CardHeader>
                        <CardTitle className='text-base'>{video.title}</CardTitle>
                        <div className='flex items-center justify-between text-sm pt-2'>
                           <div className="flex items-center gap-1 text-muted-foreground">
                                <Award className="w-4 h-4 text-yellow-500" />
                                <span>Reward: {video.reward}</span>
                            </div>
                            <Button size="sm" variant="secondary">
                                <PlayCircle className='mr-2' />
                                Watch
                            </Button>
                        </div>
                    </CardHeader>
                </Card>
            ))}
        </div>
    )
}

const SpinWheelGame = () => {
    return (
        <Card className='overflow-hidden'>
            <CardContent className='p-6 flex flex-col items-center justify-center gap-8'>
                <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full border-8 border-primary/20 flex items-center justify-center">
                    {/* Placeholder for the wheel segments */}
                    <div className="absolute w-full h-full">
                        {[...Array(8)].map((_, i) => (
                             <div key={i} className="absolute w-1/2 h-1/2 top-1/2 left-1/2 origin-top-left" style={{ transform: `rotate(${i * 45}deg)` }}>
                                <div className={cn("w-full h-full", i % 2 === 0 ? 'bg-muted/30' : 'bg-muted/60')} style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }}></div>
                            </div>
                        ))}
                    </div>
                     <div className="absolute -top-4 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-primary z-10"></div>
                    <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center">
                        <Disc className="w-10 h-10 text-primary" />
                    </div>
                </div>
                <Button size="lg" className='bg-yellow-500 hover:bg-yellow-600 text-black'>Spin the Wheel</Button>
            </CardContent>
        </Card>
    )
}

const CoinFlipGame = () => {
  const [choice, setChoice] = useState<'heads' | 'tails' | null>(null);
  const [result, setResult] = useState<'heads' | 'tails' | null>(null);
  const [flipping, setFlipping] = useState(false);

  const handleFlip = () => {
    if (!choice) return;
    setFlipping(true);
    setResult(null);
    setTimeout(() => {
      const outcome = Math.random() > 0.5 ? 'heads' : 'tails';
      setResult(outcome);
      setFlipping(false);
    }, 1500);
  }

  return (
     <Card>
        <CardContent className="p-6 flex flex-col items-center justify-center gap-6 text-center">
            <div className="relative w-48 h-48">
                 <div className={cn("absolute w-full h-full rounded-full flex items-center justify-center transition-transform duration-1000", flipping && "[transform:rotateY(1800deg)]")} style={{ transformStyle: 'preserve-3d' }}>
                    <div className="absolute w-full h-full bg-muted rounded-full flex items-center justify-center [backface-visibility:hidden]">
                         { !result && <CircleDollarSign className='w-24 h-24 text-muted-foreground' /> }
                         { result && <p className='text-6xl font-bold'>{result === choice ? 'WIN' : 'LOSE'}</p>}
                    </div>
                    <div className="absolute w-full h-full bg-yellow-500 rounded-full flex items-center justify-center [transform:rotateY(180deg)] [backface-visibility:hidden]">
                        <p className='text-3xl font-bold text-black'>{result?.toUpperCase()}</p>
                    </div>
                </div>
            </div>
            <p className='text-muted-foreground'>
                {result ? `It was ${result}! You ${result === choice ? 'won!' : 'lost.'}` : 'Choose Heads or Tails'}
            </p>
            <div className="flex gap-4">
                <Button variant={choice === 'heads' ? 'default' : 'outline'} onClick={() => setChoice('heads')} disabled={flipping}>Heads</Button>
                <Button variant={choice === 'tails' ? 'default' : 'outline'} onClick={() => setChoice('tails')} disabled={flipping}>Tails</Button>
            </div>
            <Button onClick={handleFlip} disabled={!choice || flipping} size="lg">
                {flipping ? 'Flipping...' : 'Flip Coin'}
            </Button>
        </CardContent>
     </Card>
  )
}

const LuckyDiceGame = () => {
    return (
        <Card>
            <CardContent className="p-6 flex flex-col items-center justify-center gap-8">
                <div className="flex gap-4 sm:gap-8">
                    <Dice5 className="w-24 h-24 text-primary" />
                    <Dice5 className="w-24 h-24 text-primary" />
                </div>
                <p className='text-muted-foreground'>Click the button to roll the dice.</p>
                <Button size="lg" variant="secondary">Roll Dice</Button>
            </CardContent>
        </Card>
    )
}


export default function BonusGamePage() {
  const params = useParams();
  const slug = params.slug as string;
  const details = gameDetails[slug] || { name: 'Game', description: 'Play to win!' };

  const renderGame = () => {
    switch (slug) {
        case 'aviator':
            return <AviatorGame />;
        case 'video-play':
            return <VideoPlayGame />;
        case 'spin-the-wheel':
            return <SpinWheelGame />;
        case 'coin-flip':
            return <CoinFlipGame />;
        case 'lucky-dice':
            return <LuckyDiceGame />;
        default:
            return <p>Game not found.</p>;
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-primary">{details.name}</h1>
        <p className="text-muted-foreground">{details.description}</p>
      </div>

      {renderGame()}

    </div>
  );
}

