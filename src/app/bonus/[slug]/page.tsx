
"use client";

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Plane, Coins, Disc, CircleDollarSign, Dice5, PlayCircle, Video, Award, Clock, CheckCircle, Hourglass, User, ChevronRight } from 'lucide-react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { addCurrency, getCurrency, spendCurrency } from '@/lib/storage';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";


const gameDetails: { [key: string]: { name: string; description: string, icon: React.ReactNode } } = {
  'aviator': {
    name: 'Aviator',
    description: 'Watch the multiplier grow and cash out before the plane flies away!',
    icon: <Plane className="h-6 w-6" />
  },
  'video-play': {
    name: 'Video Play',
    description: 'Watch videos to earn rewards.',
    icon: <Video className="h-6 w-6" />
  },
  'spin-the-wheel': {
    name: 'Spin the Wheel',
    description: 'Spin the wheel for a chance to win big!',
    icon: <Disc className="h-6 w-6" />
  },
  'coin-flip': {
    name: 'Coin Flip',
    description: 'Double or nothing! Flip a coin to test your luck.',
    icon: <CircleDollarSign className="h-6 w-6" />
  },
  'lucky-dice': {
    name: 'Lucky Dice',
    description: 'Roll the dice and win rewards based on your roll.',
    icon: <Dice5 className="h-6 w-6" />
  }
};

const videos = [
    { id: 1, title: 'Learn Next.js in 100 Seconds', duration: '1:40', reward: 50, youtubeId: 'Sklc_fQB-B0', watchTime: 60 },
    { id: 2, title: 'The story of Genkit', duration: '6:37', reward: 75, youtubeId: 'j8-k0f9vR8g', watchTime: 60 },
    { id: 3, title: 'Fireship Explains The End', duration: '3:00', reward: 100, youtubeId: 'c5Gf0_C3F10', watchTime: 60 },
    { id: 4, title: 'The Most Important New UI Framework', duration: '9:25', reward: 150, youtubeId: 'pS8hhKM30iY', watchTime: 60 },
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
    const { toast } = useToast();
    const [selectedVideo, setSelectedVideo] = useState(videos[0]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [claimedRewards, setClaimedRewards] = useState<number[]>([]);

    const handleSelectVideo = (video: typeof videos[0]) => {
        setSelectedVideo(video);
        setIsPlaying(false);
        setProgress(0);
    }
    
    const handlePlay = () => {
        if (claimedRewards.includes(selectedVideo.id)) return;
        setIsPlaying(true);
        setProgress(0);
    }

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isPlaying && progress < 100) {
            timer = setInterval(() => {
                setProgress(p => p + 100 / selectedVideo.watchTime);
            }, 1000);
        }
        if (progress >= 100) {
            setIsPlaying(false);
        }
        return () => clearInterval(timer);
    }, [isPlaying, progress, selectedVideo.watchTime]);

    const handleClaimReward = () => {
        addCurrency(selectedVideo.reward);
        setClaimedRewards(prev => [...prev, selectedVideo.id]);
        toast({
            title: "Reward Claimed!",
            description: `You've received ${selectedVideo.reward} coins.`,
        });
        setProgress(0);
        setIsPlaying(false);
    }
    
    const isClaimed = useCallback((videoId: number) => {
        return claimedRewards.includes(videoId);
    }, [claimedRewards]);

    const canClaim = progress >= 100 && !isClaimed(selectedVideo.id);
    const getThumbnailUrl = (youtubeId: string) => `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
                <Card className='overflow-hidden'>
                    <div className="relative aspect-video bg-black flex items-center justify-center">
                        <Image src={getThumbnailUrl(selectedVideo.youtubeId)} alt={selectedVideo.title} fill className={cn("object-cover transition-opacity", isPlaying && "opacity-80")} />
                         {!isPlaying && progress === 0 && (
                            <button onClick={handlePlay} className='z-10 bg-black/50 p-4 rounded-full text-white hover:bg-black/70 transition-colors disabled:opacity-50 disabled:cursor-not-allowed' disabled={isClaimed(selectedVideo.id)}>
                                {isClaimed(selectedVideo.id) ? <CheckCircle className='w-16 h-16 text-green-500' /> : <PlayCircle className='w-16 h-16' />}
                            </button>
                         )}
                         {isPlaying && (
                            <div className='z-10 text-white flex items-center gap-2 bg-black/50 p-2 rounded'>
                                <Hourglass className='w-4 h-4 animate-spin' />
                                <span>Playing...</span>
                            </div>
                         )}
                    </div>
                    <CardContent className='p-4 space-y-4'>
                        <h2 className="text-xl font-bold">{selectedVideo.title}</h2>
                        <div className='flex items-center gap-4 text-sm text-muted-foreground'>
                            <div className="flex items-center gap-1">
                                <Award className="w-4 h-4 text-yellow-500" />
                                <span>Reward: {selectedVideo.reward} Coins</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span>Duration: {selectedVideo.duration}</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Progress value={progress} />
                            <Button onClick={handleClaimReward} disabled={!canClaim} className="w-full">
                                {isClaimed(selectedVideo.id) ? 'Reward Claimed' : 'Claim Reward'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div className="lg:col-span-1">
                <Card>
                    <CardHeader>
                        <CardTitle>Playlist</CardTitle>
                    </CardHeader>
                    <CardContent className='p-2'>
                        <ScrollArea className="h-[420px] pr-2">
                            <div className="space-y-2">
                            {videos.map(video => (
                                <button key={video.id} onClick={() => handleSelectVideo(video)} className={cn("flex items-center gap-3 p-2 rounded-lg w-full text-left hover:bg-muted", selectedVideo.id === video.id && "bg-muted")}>
                                    <div className="relative w-[120px] h-[68px] flex-shrink-0">
                                        <Image src={getThumbnailUrl(video.youtubeId)} alt={video.title} fill className="rounded-md object-cover" />
                                        {isClaimed(video.id) && (
                                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-md">
                                                <CheckCircle className="w-6 h-6 text-green-400" />
                                            </div>
                                        )}
                                    </div>
                                    <div className='flex-1'>
                                        <p className="font-semibold text-sm leading-tight">{video.title}</p>
                                        <p className="text-xs text-muted-foreground">{video.duration}</p>
                                         {isClaimed(video.id) && (
                                            <Badge variant="secondary" className='mt-1 text-green-600 bg-green-500/10 text-[10px] px-1.5 py-0'>Claimed</Badge>
                                        )}
                                    </div>
                                </button>
                            ))}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

const SpinWheelGame = () => {
    const { toast } = useToast();
    const [rotation, setRotation] = useState(0);
    const [spinning, setSpinning] = useState(false);
    const [betAmount, setBetAmount] = useState(10);
    const [balance, setBalance] = useState(0);

    const segments = [
        { value: 2, style: 'bg-green-500/50', textColor: 'text-green-50' },
        { value: 0.5, style: 'bg-blue-500/50', textColor: 'text-blue-50' },
        { value: 1.5, style: 'bg-yellow-500/50', textColor: 'text-yellow-50' },
        { value: 0, style: 'bg-red-500/50', textColor: 'text-red-50' },
        { value: 5, style: 'bg-purple-500/50', textColor: 'text-purple-50' },
        { value: 0.2, style: 'bg-indigo-500/50', textColor: 'text-indigo-50' },
        { value: 10, style: 'bg-pink-500/50', textColor: 'text-pink-50' },
        { value: 1, style: 'bg-gray-500/50', textColor: 'text-gray-50' },
    ];
    const segmentAngle = 360 / segments.length;

    const refreshBalance = useCallback(() => {
        setBalance(getCurrency());
    }, []);

    useEffect(() => {
        refreshBalance();
        window.addEventListener('storage', refreshBalance);
        return () => window.removeEventListener('storage', refreshBalance);
    }, [refreshBalance]);

    const handleSpin = () => {
        if (spinning) return;
        if (balance < betAmount) {
            toast({ variant: 'destructive', title: "Not enough coins", description: "You don't have enough coins to place this bet." });
            return;
        }

        setSpinning(true);
        spendCurrency(betAmount);
        refreshBalance();

        const randomSpins = Math.floor(Math.random() * 5) + 8; // 8 to 13 full spins
        const randomStop = Math.random() * 360;
        const targetRotation = rotation + (randomSpins * 360) + randomStop;
        
        const normalizedRotation = (targetRotation % 360 + 360) % 360;
        const prizeIndex = Math.floor((normalizedRotation + segmentAngle / 2) / segmentAngle);
        const prizeMultiplier = segments[segments.length - 1 - prizeIndex].value;

        setRotation(targetRotation);

        setTimeout(() => {
            setSpinning(false);
            const winnings = betAmount * prizeMultiplier;
            if (winnings > 0) {
                addCurrency(winnings);
                toast({
                    title: `You won ${winnings.toLocaleString()} coins!`,
                    description: `Your ${betAmount} coin bet returned ${prizeMultiplier}x.`,
                });
            } else {
                 toast({
                    variant: 'destructive',
                    title: "Better luck next time!",
                    description: `You lost your ${betAmount} coin bet.`,
                });
            }
            refreshBalance();
        }, 7000); // Corresponds to the animation duration
    };
    
    const handleBetChange = (amount: number) => {
        setBetAmount(prev => Math.max(0, prev + amount));
    }

    return (
        <Card className='overflow-hidden'>
            <CardContent className='p-6 flex flex-col items-center justify-center gap-8'>
                <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center">
                    <div className="absolute -top-4 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-primary z-10"></div>
                    <div
                        className={cn(
                            "relative w-full h-full rounded-full border-8 border-primary/20",
                            spinning ? "transition-transform duration-[7000ms] ease-out" : "animate-[spin_30s_linear_infinite]"
                        )}
                        style={{ transform: `rotate(${rotation}deg)` }}
                    >
                        {segments.map((segment, i) => (
                            <div
                                key={i}
                                className="absolute w-1/2 h-1/2 top-1/2 left-1/2 origin-top-left flex items-center justify-center"
                                style={{ transform: `rotate(${i * segmentAngle}deg)` }}
                            >
                                <div
                                    className={cn("w-full h-full text-center flex items-center justify-end pr-4", segment.style)}
                                    style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }}
                                >
                                     <span
                                        className={cn("transform -rotate-45 font-bold text-lg", segment.textColor)}
                                        style={{ transform: `rotate(-${segmentAngle/2}deg) translate(-10px, -60px)`}}
                                    >
                                        {segment.value}x
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="absolute w-16 h-16 bg-background rounded-full flex items-center justify-center">
                        <Disc className="w-10 h-10 text-primary" />
                    </div>
                </div>
                <div className="w-full max-w-sm space-y-4">
                    <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleBetChange(-10)} disabled={spinning}>-</Button>
                        <Input value={betAmount} onChange={(e) => setBetAmount(Number(e.target.value))} type="number" className="text-center" disabled={spinning} />
                        <Button variant="outline" size="sm" onClick={() => handleBetChange(10)} disabled={spinning}>+</Button>
                        <Coins className="text-yellow-500" />
                    </div>
                    <Button size="lg" className='w-full bg-yellow-500 hover:bg-yellow-600 text-black text-lg h-12' onClick={handleSpin} disabled={spinning || betAmount <= 0}>
                        {spinning ? 'Spinning...' : `Spin for ${betAmount.toLocaleString()}`}
                    </Button>
                </div>
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
  const details = gameDetails[slug] || { name: 'Game', description: 'Play to win!', icon: <User /> };
  const [currency, setCurrency] = useState(0);

  const refreshCurrency = useCallback(() => {
    setCurrency(getCurrency());
  }, []);

  useEffect(() => {
    refreshCurrency();
    
    const handleStorageChange = () => {
      refreshCurrency();
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
        window.removeEventListener('storage', handleStorageChange);
    };

  }, [refreshCurrency]);

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
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
                <Link href="/leaderboard">Bonus Games</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>{details.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex items-start justify-between">
        <div>
            <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
                {details.icon}
                {details.name}
            </h1>
            <p className="text-muted-foreground mt-1">{details.description}</p>
        </div>
        <div className="flex items-center justify-end gap-2 text-lg font-bold text-primary px-2 py-1 rounded-md bg-muted">
            <Coins className="w-5 h-5 text-yellow-500"/>
            <span className='text-lg'>{currency.toLocaleString()}</span>
        </div>
      </div>

      {renderGame()}

    </div>
  );
}
