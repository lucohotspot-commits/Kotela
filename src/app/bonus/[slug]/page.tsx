
"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Plane, Coins, Disc, Circle, CircleDollarSign, PlayCircle, Video, Award, Clock, CheckCircle, Hourglass, User, ChevronRight, Dice1, Dice2, Dice3, Dice4, Dice5, Dice6 } from 'lucide-react';
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
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogFooter,
} from "@/components/ui/alert-dialog";
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
    const { toast } = useToast();
    const [multiplier, setMultiplier] = useState(1.00);
    const [gameState, setGameState] = useState<'waiting' | 'playing' | 'cashed_out' | 'crashed'>('waiting');
    const [flightTime, setFlightTime] = useState(0);
    const [betAmount, setBetAmount] = useState(10);
    const [balance, setBalance] = useState(0);
    const [cashOutMultiplier, setCashOutMultiplier] = useState(0);

    const refreshBalance = useCallback(() => {
        setBalance(getCurrency());
    }, []);

    useEffect(() => {
        refreshBalance();
        window.addEventListener('storage', refreshBalance);
        return () => window.removeEventListener('storage', refreshBalance);
    }, [refreshBalance]);

    useEffect(() => {
        let gameLoop: NodeJS.Timeout;
        if (gameState === 'playing') {
            const startTime = Date.now();
            const crashPoint = (Math.random() * 10 + 2) * 1000;

            gameLoop = setInterval(() => {
                const elapsedTime = Date.now() - startTime;
                setFlightTime(elapsedTime);

                const newMultiplier = 1 + (elapsedTime / 1000) * 0.2 + (elapsedTime / 5000) ** 2;
                setMultiplier(newMultiplier);

                if (elapsedTime >= crashPoint) {
                    setGameState('crashed');
                    clearInterval(gameLoop);
                }
            }, 50);
        } else if (gameState === 'waiting') {
            setMultiplier(1.00);
            setFlightTime(0);
            setCashOutMultiplier(0);
        }
        return () => clearInterval(gameLoop);
    }, [gameState]);

    const handleBet = () => {
        if (balance < betAmount) {
            toast({ variant: 'destructive', title: "Not enough coins", description: `You need ${betAmount.toLocaleString()} coins to play.` });
            return;
        }
        spendCurrency(betAmount);
        refreshBalance();
        setGameState('playing');
    };

    const handleCashOut = () => {
        const winnings = betAmount * multiplier;
        addCurrency(winnings);
        refreshBalance();
        setCashOutMultiplier(multiplier);
        setGameState('cashed_out');
        toast({
            title: `Cashed out at ${multiplier.toFixed(2)}x!`,
            description: `You won ${winnings.toLocaleString()} coins.`,
        });
    }

    const handleReset = () => {
        setGameState('waiting');
    };

    const handleBetChange = (amount: number) => {
        setBetAmount(prev => Math.max(1, prev + amount));
    }

    const planeX = Math.min(100, (flightTime / 8000) * 100);
    const planeY = 100 - Math.pow(planeX / 100, 0.5) * 80;

    const multiplierFontSize = Math.min(10, 2 + multiplier / 5);

    return (
        <div className='flex flex-col items-center gap-4'>
            <Card className="w-full max-w-4xl overflow-hidden">
                <CardContent className="p-0">
                    <div className="relative w-full aspect-video bg-[#1e2024] flex items-center justify-center overflow-hidden">
                        <div
                            className="absolute inset-0 bg-transparent"
                            style={{
                                backgroundImage: `
                                    radial-gradient(ellipse at 50% 120%, hsla(0,0%,100%,0.05) 0%, transparent 40%),
                                    radial-gradient(circle at 50% 120%, transparent 20%, #1e2024 20.5%, #1e2024 30%, transparent 30.5%, transparent 100%)
                                `,
                                backgroundSize: '100% 100%, 80px 80px',
                            }}
                        ></div>

                        <div className="absolute inset-0 flex items-center justify-center z-20">
                            {gameState === 'waiting' && (
                                <p className="text-xl font-semibold text-muted-foreground animate-pulse">Waiting for next round...</p>
                            )}
                             {gameState === 'cashed_out' && (
                                <div className="text-center">
                                    <p className="text-2xl text-green-400 font-bold">You Cashed Out!</p>
                                    <p className="text-5xl text-white font-bold">{cashOutMultiplier.toFixed(2)}x</p>
                                </div>
                            )}
                            {gameState === 'crashed' && (
                                <div className="text-center">
                                    <p className="text-3xl font-bold text-destructive">Flew Away!</p>
                                    <p className="text-2xl text-white font-bold">{multiplier.toFixed(2)}x</p>
                                </div>
                            )}
                            {(gameState === 'playing') && (
                                <p
                                    className="text-white font-bold transition-all duration-100"
                                    style={{ fontSize: `${multiplierFontSize}rem` }}
                                >
                                    {multiplier.toFixed(2)}x
                                </p>
                            )}
                        </div>

                        {(gameState === 'playing' || gameState === 'crashed' || gameState === 'cashed_out') && (
                            <div className="absolute h-full w-full">
                                <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute bottom-0 left-0">
                                    <path
                                        d={`M 0 100 C 30 100, 70 60, 100 20`}
                                        stroke={gameState === 'crashed' ? "#ef4444" : "#facc15"}
                                        strokeWidth="0.5"
                                        fill="none"
                                        strokeDasharray="1"
                                        strokeDashoffset={1 - (planeX / 100)}
                                        pathLength="1"
                                    />
                                </svg>
                                <Plane
                                    className={cn("h-8 w-8 text-red-500 absolute bottom-0 left-0 transform transition-all ease-linear duration-[50ms]", gameState === 'cashed_out' && 'opacity-50')}
                                    style={{
                                        left: `${planeX}%`,
                                        bottom: `${100 - planeY}%`,
                                        transform: `rotate(${-(planeX / 2)}deg)  translate(-50%, 50%)`,
                                    }}
                                />
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-lg">
                <Card className="flex-1">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base">Bet Controls</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm" onClick={() => handleBetChange(-10)} disabled={gameState !== 'waiting'}>-</Button>
                            <Input value={betAmount.toLocaleString()} className="text-center" readOnly />
                            <Button variant="outline" size="sm" onClick={() => handleBetChange(10)} disabled={gameState !== 'waiting'}>+</Button>
                            <Coins className="text-yellow-500" />
                        </div>
                        {gameState === 'waiting' && (
                            <Button className="w-full bg-green-600 hover:bg-green-700 text-white" onClick={handleBet} disabled={betAmount <= 0 || balance < betAmount}>
                                Bet
                            </Button>
                        )}
                        {gameState === 'playing' && (
                            <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black" onClick={handleCashOut}>
                                Cash Out
                            </Button>
                        )}
                        {(gameState === 'crashed' || gameState === 'cashed_out') && (
                            <Button className="w-full" onClick={handleReset} variant="secondary">
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
    const [isResultDialogOpen, setIsResultDialogOpen] = useState(false);
    const [spinResult, setSpinResult] = useState<{ multiplier: number; winnings: number } | null>(null);

    const segments = useMemo(() => [
        { value: 2, color: 'bg-green-500/50', textColor: 'text-green-50' },
        { value: 0.5, color: 'bg-blue-500/50', textColor: 'text-blue-50' },
        { value: 1.5, color: 'bg-yellow-500/50', textColor: 'text-yellow-50' },
        { value: 0, color: 'bg-red-500/50', textColor: 'text-red-50' },
        { value: 5, color: 'bg-purple-500/50', textColor: 'text-purple-50' },
        { value: 0.2, color: 'bg-indigo-500/50', textColor: 'text-indigo-50' },
        { value: 10, color: 'bg-pink-500/50', textColor: 'text-pink-50' },
        { value: 1, color: 'bg-gray-500/50', textColor: 'text-gray-50' },
    ].reverse(), []); // Reversed to match visual layout with calculation

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
        
        setRotation(targetRotation);

        setTimeout(() => {
            setSpinning(false);
            const prizeIndex = Math.floor((targetRotation % 360) / segmentAngle);
            const prizeMultiplier = segments[prizeIndex].value;
            const winnings = betAmount * prizeMultiplier;

            if (winnings > 0) {
                addCurrency(winnings);
            }
            
            setSpinResult({ multiplier: prizeMultiplier, winnings });
            setIsResultDialogOpen(true);
            refreshBalance();
        }, 7000); // Corresponds to the animation duration
    };
    
    const handleBetChange = (amount: number) => {
        setBetAmount(prev => Math.max(0, prev + amount));
    }

    const closeDialog = () => {
        setIsResultDialogOpen(false);
        setSpinResult(null);
    }

    return (
        <>
            <Card className='overflow-hidden'>
                <CardContent className='p-6 flex flex-col items-center justify-center gap-6'>
                    <div className="relative w-96 h-96 flex items-center justify-center">
                        <div className="absolute -top-3 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[12px] border-t-primary z-20"></div>
                        <div
                            className={cn(
                                "relative w-full h-full rounded-full border-8 border-primary/20",
                                spinning ? "transition-transform duration-[7000ms] ease-out" : ""
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
                                        className={cn("w-full h-full text-center flex items-center justify-end", segment.color)}
                                        style={{ clipPath: 'polygon(50% 50%, 100% 0, 100% 100%)' }}
                                    >
                                         <span
                                            className={cn("transform font-bold text-lg", segment.textColor)}
                                            style={{ transform: `rotate(${segmentAngle/2}deg) translate(-50px, -50px)`}}
                                        >
                                            {segment.value}x
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="absolute w-20 h-20 bg-background rounded-full border-4 border-primary/20 flex items-center justify-center z-10">
                            <Circle className="w-12 h-12 text-primary" />
                        </div>
                    </div>
                    <div className="w-full max-w-xs space-y-4">
                        <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm" onClick={() => handleBetChange(-10)} disabled={spinning}>-</Button>
                            <Input value={betAmount} onChange={(e) => setBetAmount(Number(e.target.value))} type="number" className="text-center w-24" disabled={spinning} />
                            <Button variant="outline" size="sm" onClick={() => handleBetChange(10)} disabled={spinning}>+</Button>
                            <Input value={`Bet: ${betAmount.toLocaleString()}`} className="text-center flex-1" disabled />
                        </div>
                        <Button size="lg" className='w-full bg-yellow-500 hover:bg-yellow-600 text-black text-lg h-12' onClick={handleSpin} disabled={spinning || betAmount <= 0}>
                            {spinning ? 'Spinning...' : `Spin for ${betAmount.toLocaleString()}`}
                        </Button>
                    </div>
                </CardContent>
            </Card>
            <AlertDialog open={isResultDialogOpen} onOpenChange={setIsResultDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className='text-center text-2xl'>
                            {spinResult && spinResult.multiplier > 0 ? `You won ${spinResult.multiplier}x!` : 'Better luck next time!'}
                        </AlertDialogTitle>
                        <AlertDialogDescription className='text-center'>
                            {spinResult && spinResult.winnings > 0 
                                ? `Your ${betAmount} coin bet returned ${spinResult.winnings.toLocaleString()} coins.`
                                : `You lost your ${betAmount.toLocaleString()} coin bet.`
                            }
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <Button onClick={closeDialog} className="w-full">Play Again</Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}

const CoinFlipGame = () => {
    const { toast } = useToast();
    const [choice, setChoice] = useState<'heads' | 'tails' | null>(null);
    const [result, setResult] = useState<'heads' | 'tails' | null>(null);
    const [flipping, setFlipping] = useState(false);
    const [balance, setBalance] = useState(0);

    const refreshBalance = useCallback(() => {
        setBalance(getCurrency());
    }, []);

    useEffect(() => {
        refreshBalance();
        window.addEventListener('storage', refreshBalance);
        return () => window.removeEventListener('storage', refreshBalance);
    }, [refreshBalance]);

    const handleFlip = () => {
        if (!choice || flipping) return;

        setFlipping(true);
        setResult(null);

        setTimeout(() => {
            const outcome = Math.random() > 0.5 ? 'heads' : 'tails';
            setResult(outcome);
            setFlipping(false);

            if (outcome === choice) {
                const winnings = 50;
                addCurrency(winnings);
                toast({
                    title: `You won ${winnings.toLocaleString()} coins!`,
                    description: `It was ${outcome}.`,
                });
            } else {
                toast({
                    variant: 'destructive',
                    title: "Better luck next time!",
                    description: `It was ${outcome}.`,
                });
            }
            refreshBalance();
        }, 2500); // Increased duration for better animation feel
    }

    const CoinFace = ({ children, isFront }: { children: React.ReactNode, isFront?: boolean }) => (
        <div className={cn(
            "absolute w-full h-full rounded-full flex items-center justify-center [backface-visibility:hidden] text-yellow-900/70",
            "bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600", // Gold gradient
            "shadow-inner shadow-black/30", // Inner shadow for depth
            isFront ? "" : "[transform:rotateY(180deg)]"
        )}>
            <div className="w-[90%] h-[90%] rounded-full border-2 border-yellow-600/50 flex items-center justify-center">
                 {children}
            </div>
        </div>
    );
    
    const hasWon = result && result === choice;

    return (
        <Card>
            <CardContent className="p-6 flex flex-col items-center justify-center gap-6 text-center">
                <div className="relative w-48 h-48 [perspective:1200px]">
                    <div className={cn(
                        "relative w-full h-full transition-transform duration-[2500ms] ease-in-out",
                        flipping && "[transform:rotateY(1800deg)]",
                        result && (hasWon ? "animate-bounce" : "animate-pulse-subtle")
                     )} style={{ transformStyle: 'preserve-3d' }}>
                        <CoinFace isFront>
                           {!result && <CircleDollarSign className='w-24 h-24 text-yellow-800/80' />}
                           {result && (
                            <span className={cn('text-5xl font-extrabold', hasWon ? 'text-green-800' : 'text-red-800')}>
                                {hasWon ? 'WIN' : 'LOSE'}
                            </span>
                           )}
                        </CoinFace>
                        <CoinFace>
                            <span className='text-3xl font-bold tracking-widest text-shadow-lg'>
                                {result ? result.toUpperCase() : choice ? choice.toUpperCase() : ''}
                            </span>
                        </CoinFace>
                    </div>
                </div>
                
                <div className="w-full max-w-xs space-y-4">
                    <div className="flex gap-4 justify-center">
                        <Button variant={choice === 'heads' ? 'default' : 'outline'} onClick={() => setChoice('heads')} disabled={flipping}>Heads</Button>
                        <Button variant={choice === 'tails' ? 'default' : 'outline'} onClick={() => setChoice('tails')} disabled={flipping}>Tails</Button>
                    </div>

                    <Button onClick={handleFlip} disabled={!choice || flipping} size="lg" className="w-full">
                        {flipping ? 'Flipping...' : 'Flip Coin'}
                    </Button>
                </div>
                 <p className='text-muted-foreground text-sm h-5'>
                    {result ? `It was ${result}! You ${result === choice ? 'won!' : 'lost.'}` : 'Choose Heads or Tails to get a bonus'}
                </p>
            </CardContent>
        </Card>
    )
}

const LuckyDiceGame = () => {
    const { toast } = useToast();
    const [dice1, setDice1] = useState<number>(5);
    const [dice2, setDice2] = useState<number>(5);
    const [rolling, setRolling] = useState<boolean>(false);
    const [betAmount, setBetAmount] = useState<number>(10);
    const [balance, setBalance] = useState(0);

    const refreshBalance = useCallback(() => {
        setBalance(getCurrency());
    }, []);

    useEffect(() => {
        refreshBalance();
        window.addEventListener('storage', refreshBalance);
        return () => window.removeEventListener('storage', refreshBalance);
    }, [refreshBalance]);

    const handleRoll = () => {
        if (rolling) return;
        if (balance < betAmount) {
            toast({ variant: 'destructive', title: "Not enough coins", description: "You don't have enough coins to place this bet." });
            return;
        }
        setRolling(true);
        spendCurrency(betAmount);
        refreshBalance();

        const rollInterval = setInterval(() => {
            setDice1(Math.floor(Math.random() * 6) + 1);
            setDice2(Math.floor(Math.random() * 6) + 1);
        }, 100);

        setTimeout(() => {
            clearInterval(rollInterval);
            const finalDice1 = Math.floor(Math.random() * 6) + 1;
            const finalDice2 = Math.floor(Math.random() * 6) + 1;
            setDice1(finalDice1);
            setDice2(finalDice2);
            setRolling(false);

            const sum = finalDice1 + finalDice2;
            let winnings = 0;
            let multiplier = 0;

            if (finalDice1 === finalDice2) {
                multiplier = 10;
                winnings = betAmount * multiplier;
            } else if (sum === 7 || sum === 11) {
                multiplier = 2;
                winnings = betAmount * multiplier;
            }

            if (winnings > 0) {
                addCurrency(winnings);
                toast({
                    title: `You won ${winnings.toLocaleString()} coins!`,
                    description: `You rolled ${finalDice1} and ${finalDice2}. Your bet returned ${multiplier}x.`,
                });
            } else {
                toast({
                    variant: 'destructive',
                    title: "Better luck next time!",
                    description: `You rolled a ${sum}. You lost your ${betAmount} coin bet.`,
                });
            }
            refreshBalance();
        }, 1500);
    };

    const handleBetChange = (amount: number) => {
        setBetAmount(prev => Math.max(0, prev + amount));
    };

    const DiceIcon = ({ value }: { value: number }) => {
        const icons = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6];
        const Icon = icons[value - 1];
        return <Icon className={cn("w-24 h-24 text-primary", rolling && "animate-spin")} />;
    };

    return (
        <Card>
            <CardContent className="p-6 flex flex-col items-center justify-center gap-8">
                <div className="flex gap-4 sm:gap-8">
                    <DiceIcon value={dice1} />
                    <DiceIcon value={dice2} />
                </div>
                 <div className="w-full max-w-sm space-y-4">
                    <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleBetChange(-10)} disabled={rolling}>-</Button>
                        <Input value={betAmount} onChange={(e) => setBetAmount(Number(e.target.value))} type="number" className="text-center" disabled={rolling} />
                        <Button variant="outline" size="sm" onClick={() => handleBetChange(10)} disabled={rolling}>+</Button>
                        <Coins className="text-yellow-500" />
                    </div>
                    <Button size="lg" className="w-full text-lg h-12" onClick={handleRoll} disabled={rolling || betAmount <= 0}>
                        {rolling ? 'Rolling...' : `Roll for ${betAmount.toLocaleString()}`}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};


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

    
