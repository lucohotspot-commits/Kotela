
"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Coins, Disc, Circle, CircleDollarSign, PlayCircle, Video, Award, Clock, CheckCircle, Hourglass, User, ChevronRight, Dice1, Dice2, Dice3, Dice4, Dice5, Dice6, ChevronLeft, BookOpenCheck, Loader2, Puzzle } from 'lucide-react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { addCurrency, getCurrency, spendCurrency } from '@/lib/storage';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { getWisemanQuestion, verifyWisemanAnswer, WisemanQuestion } from '@/ai/flows/wiseman-game-flow';
import { getPuzzle, verifyPuzzleAnswer, type Puzzle as PuzzleType } from '@/ai/flows/puzzle-game-flow';
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
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';


const gameDetails: { [key: string]: { name: string; description: string, icon: React.ReactNode } } = {
  'puzzle-game': {
    name: 'Puzzle Game',
    description: 'Solve an AI-generated puzzle to win a prize!',
    icon: <Puzzle className="h-6 w-6" />
  },
  'video-play': {
    name: 'VideAds',
    description: 'Watch videos to earn rewards.',
    icon: <Video className="h-6 w-6" />
  },
  'wiseman': {
    name: 'WiseMan',
    description: 'Stake your coins and answer the WiseMan\'s question. Win and get rewarded, fail and lose your stake.',
    icon: <BookOpenCheck className="h-6 w-6" />
  },
  'lucky-dice': {
    name: 'Lucky Dice',
    description: 'Roll the dice and win rewards based on your roll.',
    icon: <Dice5 className="h-6 w-6" />
  },
  'coin-flip': {
    name: 'Coin Flip',
    description: 'Flip a coin and double your stake, or lose it all.',
    icon: <CircleDollarSign className="h-6 w-6" />
  },
};

const videos = [
    { id: 1, title: 'Learn App Hosting', duration: '1:40', reward: 50, youtubeId: 'Vxa_DzLtlTI', watchTime: 60 },
    { id: 2, title: 'AI-powered Apps with Firebase', duration: '6:37', reward: 75, youtubeId: 'LXb3EKWsInQ', watchTime: 60 },
    { id: 3, title: 'Get Started with Firebase', duration: '3:00', reward: 100, youtubeId: 'Vxa_DzLtlTI', watchTime: 60 },
    { id: 4, title: 'Firebase Crashlytics', duration: '9:25', reward: 150, youtubeId: 'Vxa_DzLtlTI', watchTime: 60 },
    { id: 5, title: 'Firebase Remote Config', duration: '5:10', reward: 125, youtubeId: 'Vxa_DzLtlTI', watchTime: 60 },
    { id: 6, title: 'Build a Gen AI chat app', duration: '8:15', reward: 200, youtubeId: 'LXb3EKWsInQ', watchTime: 60 },
    { id: 7, title: 'What is Genkit?', duration: '0:25', reward: 110, youtubeId: 'Vxa_DzLtlTI', watchTime: 25 },
    { id: 8, title: 'The future of AI', duration: '0:55', reward: 250, youtubeId: 'LXb3EKWsInQ', watchTime: 55 },
]

const PuzzleGame = () => {
    const { toast } = useToast();
    const [gameState, setGameState] = useState<'idle' | 'playing' | 'verifying' | 'result'>('idle');
    const [puzzleData, setPuzzleData] = useState<PuzzleType | null>(null);
    const [userAnswer, setUserAnswer] = useState('');
    const [result, setResult] = useState<{ isCorrect: boolean; explanation: string } | null>(null);

    const handleStartGame = async () => {
        setGameState('playing');
        setPuzzleData(null);
        try {
            const puzzle = await getPuzzle();
            setPuzzleData(puzzle);
        } catch (error) {
            console.error("Failed to get puzzle:", error);
            toast({ variant: 'destructive', title: "Failed to load puzzle", description: "Please try again." });
            setGameState('idle');
        }
    };

    const handleAnswerSubmit = async () => {
        if (!userAnswer || !puzzleData) return;

        setGameState('verifying');

        try {
            const verificationResult = await verifyPuzzleAnswer({
                puzzle: puzzleData.puzzle,
                correctAnswer: puzzleData.answer,
                userAnswer: userAnswer,
            });
            
            if (verificationResult.isCorrect) {
                addCurrency(puzzleData.prize);
                 toast({
                    title: `Correct! You won ${puzzleData.prize.toLocaleString()} coins!`,
                    description: verificationResult.explanation,
                });
            } else {
                 toast({
                    variant: 'destructive',
                    title: "Incorrect!",
                    description: verificationResult.explanation,
                });
            }

            setResult(verificationResult);
            setGameState('result');

        } catch (error) {
            console.error("Failed to verify answer:", error);
            toast({ variant: 'destructive', title: "Failed to verify answer", description: "Please try again." });
            setGameState('playing');
        }
    };

    const handlePlayAgain = () => {
        setGameState('idle');
        setPuzzleData(null);
        setUserAnswer('');
        setResult(null);
    };
    
    const getDifficultyColor = (difficulty: 'easy' | 'medium' | 'hard') => {
        switch (difficulty) {
            case 'easy': return 'text-green-500 border-green-500';
            case 'medium': return 'text-yellow-500 border-yellow-500';
            case 'hard': return 'text-red-500 border-red-500';
            default: return 'text-muted-foreground';
        }
    }


    if (gameState === 'playing' && !puzzleData) {
        return (
            <Card className="flex flex-col items-center justify-center p-6 min-h-[300px]">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="mt-4 text-muted-foreground">The AI is crafting a puzzle...</p>
            </Card>
        );
    }
    
    if (gameState === 'verifying') {
        return (
            <Card className="flex flex-col items-center justify-center p-6 min-h-[300px]">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="mt-4 text-muted-foreground">Checking your answer...</p>
            </Card>
        );
    }

    if (gameState === 'result' && result) {
        return (
             <Card className="text-center p-6">
                <CardHeader>
                    <CardTitle className={cn("text-3xl", result.isCorrect ? "text-green-500" : "text-destructive")}>
                        {result.isCorrect ? "You Solved It!" : "Not Quite!"}
                    </CardTitle>
                     <CardDescription>
                        {result.isCorrect 
                            ? `You won ${puzzleData?.prize.toLocaleString()} coins!`
                            : `Better luck next time.`
                        }
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-lg">"{puzzleData?.puzzle}"</p>
                    <p className="font-bold">Correct Answer: {puzzleData?.answer}</p>
                    <p className="text-muted-foreground text-sm">{result.explanation}</p>
                </CardContent>
                <CardFooter>
                    <Button onClick={handlePlayAgain} className="w-full">Play Again</Button>
                </CardFooter>
            </Card>
        );
    }

    return (
        <Card className="w-full max-w-2xl mx-auto">
            {gameState === 'idle' ? (
                <>
                    <CardHeader className="text-center items-center">
                        <Puzzle className="h-16 w-16 text-primary mb-4" />
                        <CardTitle>AI Puzzle Challenge</CardTitle>
                        <CardDescription>Solve the riddle to win a prize. Click below to start!</CardDescription>
                    </CardHeader>
                    <CardFooter>
                        <Button onClick={handleStartGame} size="lg" className="w-full">
                           Get Puzzle
                        </Button>
                    </CardFooter>
                </>
            ) : (
                <>
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <CardTitle className="flex items-center gap-2">The Riddle Master Asks...</CardTitle>
                            <div className="text-right">
                                {puzzleData && (
                                    <>
                                        <Badge variant="outline" className={getDifficultyColor(puzzleData.difficulty)}>{puzzleData.difficulty}</Badge>
                                        <p className="text-xs text-muted-foreground mt-1">Prize: {puzzleData.prize} coins</p>
                                    </>
                                )}
                            </div>
                        </div>
                        <CardDescription className="text-lg pt-4 text-foreground italic">"{puzzleData?.puzzle}"</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {puzzleData?.answer && (
                            <div className="flex justify-center items-center gap-2" aria-label="Answer length">
                                {puzzleData.answer.split('').map((_, index) => (
                                    <div key={index} className="h-10 w-8 bg-muted rounded-md border flex items-center justify-center font-bold text-xl">
                                        {userAnswer[index] ? userAnswer[index].toUpperCase() : ''}
                                    </div>
                                ))}
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="answer">Your Answer</Label>
                            <Input 
                                id="answer" 
                                placeholder="Type your guess here..." 
                                value={userAnswer}
                                onChange={(e) => setUserAnswer(e.target.value)}
                                maxLength={puzzleData?.answer.length}
                            />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button onClick={handleAnswerSubmit} disabled={!userAnswer} className="w-full">Submit Answer</Button>
                    </CardFooter>
                </>
            )}
        </Card>
    );
};

const VideoPlayGame = () => {
    const { toast } = useToast();
    const [selectedVideo, setSelectedVideo] = useState(videos[0]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [claimedRewards, setClaimedRewards] = useState<number[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [filter, setFilter] = useState('all');
    const videosPerPage = 4;
    
    const getDurationInSeconds = (duration: string) => {
        const parts = duration.split(':').map(Number);
        return parts[0] * 60 + parts[1];
    };
    
    const filteredVideos = useMemo(() => {
        switch(filter) {
            case '30s':
                return videos.filter(v => getDurationInSeconds(v.duration) <= 30);
            case '1m':
                return videos.filter(v => {
                    const seconds = getDurationInSeconds(v.duration);
                    return seconds > 30 && seconds <= 60;
                });
            case 'more':
                return videos.filter(v => getDurationInSeconds(v.duration) > 60);
            default:
                return videos;
        }
    }, [filter]);

    const paginatedVideos = useMemo(() => {
        const startIndex = currentPage * videosPerPage;
        return filteredVideos.slice(startIndex, startIndex + videosPerPage);
    }, [currentPage, filteredVideos]);
    
    const totalPages = Math.ceil(filteredVideos.length / videosPerPage);
    
    useEffect(() => {
        setCurrentPage(0);
        if(filteredVideos.length > 0) {
            setSelectedVideo(filteredVideos[0]);
        } else {
            // Maybe handle no videos found case later
        }
    }, [filter, filteredVideos]);


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
    const getEmbedUrl = (youtubeId: string) => `https://www.youtube.com/embed/${youtubeId}?autoplay=1`;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
                <Card className='overflow-hidden'>
                    <div className="relative aspect-video bg-black flex items-center justify-center">
                        {isPlaying ? (
                             <iframe
                                width="100%"
                                height="100%"
                                src={getEmbedUrl(selectedVideo.youtubeId)}
                                title={selectedVideo.title}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="border-0"
                            ></iframe>
                        ) : (
                           <>
                                <Image src={getThumbnailUrl(selectedVideo.youtubeId)} alt={selectedVideo.title} fill className={cn("object-cover transition-opacity", isPlaying && "opacity-80")} />
                                <button onClick={handlePlay} className='z-10 bg-black/50 p-4 rounded-full text-white hover:bg-black/70 transition-colors disabled:opacity-50 disabled:cursor-not-allowed' disabled={isClaimed(selectedVideo.id)}>
                                    {isClaimed(selectedVideo.id) ? <CheckCircle className='w-16 h-16 text-green-500' /> : <PlayCircle className='w-16 h-16' />}
                                </button>
                           </>
                        )}
                         {isPlaying && progress < 100 && (
                            <div className='absolute top-2 left-2 z-10 text-white flex items-center gap-2 bg-black/50 p-2 rounded'>
                                <Hourglass className='w-4 h-4 animate-spin' />
                                <span>Watching...</span>
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
                <Card className='flex flex-col'>
                    <CardHeader className="p-4 pb-2">
                        <CardTitle>Playlist</CardTitle>
                        <Tabs defaultValue="all" onValueChange={setFilter} className="w-full pt-2">
                            <TabsList className="grid w-full grid-cols-4 h-8 text-xs p-0">
                                <TabsTrigger value="all" className="h-full rounded-none">All</TabsTrigger>
                                <TabsTrigger value="30s" className="h-full rounded-none">30 SECs</TabsTrigger>
                                <TabsTrigger value="1m" className="h-full rounded-none">1 MIN</TabsTrigger>
                                <TabsTrigger value="more" className="h-full rounded-none">MORE</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </CardHeader>
                    <CardContent className='p-2 flex-grow'>
                        <div className="space-y-2">
                        {paginatedVideos.length > 0 ? paginatedVideos.map(video => (
                            <button key={video.id} onClick={() => handleSelectVideo(video)} className={cn("flex items-center gap-3 p-2 rounded-lg w-full text-left hover:bg-muted", selectedVideo.id === video.id && "bg-muted")}>
                                <div className="relative w-32 h-[72px] flex-shrink-0">
                                    <Image src={getThumbnailUrl(video.youtubeId)} alt={video.title} fill className="rounded-md object-cover" />
                                    {isClaimed(video.id) && (
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-md">
                                            <CheckCircle className="w-6 h-6 text-green-400" />
                                        </div>
                                    )}
                                </div>
                                <div className='flex-1'>
                                    <p className="font-semibold text-sm leading-tight">{video.title}</p>
                                    <p className="text-xs text-muted-foreground mt-1">{video.duration}</p>
                                     {isClaimed(video.id) && (
                                        <Badge variant="secondary" className='mt-1 text-green-600 bg-green-500/10 text-[10px] px-1.5 py-0'>Claimed</Badge>
                                    )}
                                </div>
                            </button>
                        )) : (
                            <div className="text-center text-muted-foreground p-8">
                                <p>No videos found for this filter.</p>
                            </div>
                        )}
                        </div>
                    </CardContent>
                    { totalPages > 1 && (
                        <CardFooter className="flex justify-between items-center p-2 border-t">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setCurrentPage(p => p - 1)}
                                disabled={currentPage === 0}
                            >
                                <ChevronLeft className="mr-1" />
                                Prev
                            </Button>
                            <span className="text-sm text-muted-foreground">
                                Page {currentPage + 1} of {totalPages}
                            </span>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setCurrentPage(p => p + 1)}
                                disabled={currentPage >= totalPages - 1}
                            >
                                Next
                                <ChevronRight className="ml-1" />
                            </Button>
                        </CardFooter>
                    )}
                </Card>
            </div>
        </div>
    );
}

const WiseManGame = () => {
    const { toast } = useToast();
    const [gameState, setGameState] = useState<'idle' | 'playing' | 'verifying' | 'result'>('idle');
    const [betAmount, setBetAmount] = useState(10);
    const [balance, setBalance] = useState(0);
    const [questionData, setQuestionData] = useState<WisemanQuestion | null>(null);
    const [userAnswer, setUserAnswer] = useState('');
    const [result, setResult] = useState<{ isCorrect: boolean; explanation: string; winnings: number } | null>(null);
    
    const refreshBalance = useCallback(() => {
        setBalance(getCurrency());
    }, []);

    useEffect(() => {
        refreshBalance();
        window.addEventListener('storage', refreshBalance);
        return () => window.removeEventListener('storage', refreshBalance);
    }, [refreshBalance]);

    const handleStartGame = async () => {
        if (balance < betAmount) {
            toast({ variant: 'destructive', title: "Not enough coins", description: "You don't have enough coins to place this bet." });
            return;
        }

        setGameState('playing');
        spendCurrency(betAmount);
        refreshBalance();
        
        try {
            const question = await getWisemanQuestion();
            setQuestionData(question);
        } catch (error) {
            console.error("Failed to get question:", error);
            toast({ variant: 'destructive', title: "Failed to load question", description: "Please try again." });
            addCurrency(betAmount); // Refund
            setGameState('idle');
        }
    };

    const handleAnswerSubmit = async () => {
        if (!userAnswer || !questionData) return;

        setGameState('verifying');

        try {
            const verificationResult = await verifyWisemanAnswer({
                question: questionData.question,
                correctAnswer: questionData.answer,
                userAnswer: userAnswer,
            });

            const winnings = verificationResult.isCorrect ? betAmount * 3 : 0;
            if (verificationResult.isCorrect) {
                addCurrency(winnings);
            }
            
            setResult({ ...verificationResult, winnings });
            setGameState('result');
            refreshBalance();
        } catch (error) {
            console.error("Failed to verify answer:", error);
            toast({ variant: 'destructive', title: "Failed to verify answer", description: "Please try again." });
            setGameState('playing');
        }
    };
    
    const handleBetChange = (amount: number) => {
        setBetAmount(prev => Math.max(10, prev + amount));
    };

    const handlePlayAgain = () => {
        setGameState('idle');
        setQuestionData(null);
        setUserAnswer('');
        setResult(null);
    };

    if (gameState === 'playing' && !questionData) {
        return (
            <Card className="flex flex-col items-center justify-center p-6 min-h-[300px]">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="mt-4 text-muted-foreground">The WiseMan is thinking of a question...</p>
            </Card>
        );
    }
    
    if (gameState === 'verifying') {
        return (
            <Card className="flex flex-col items-center justify-center p-6 min-h-[300px]">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="mt-4 text-muted-foreground">The WiseMan is pondering your answer...</p>
            </Card>
        );
    }

    if (gameState === 'result' && result) {
        return (
             <Card className="text-center p-6">
                <CardHeader>
                    <CardTitle className={cn("text-3xl", result.isCorrect ? "text-green-500" : "text-destructive")}>
                        {result.isCorrect ? "You are Wise!" : "Incorrect!"}
                    </CardTitle>
                    <CardDescription>
                        {result.isCorrect 
                            ? `You won ${result.winnings.toLocaleString()} coins!`
                            : `You lost your stake of ${betAmount.toLocaleString()} coins.`
                        }
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-lg">"{questionData?.question}"</p>
                    <p className="font-bold">Correct Answer: {questionData?.answer}</p>
                    <p className="text-muted-foreground text-sm">{result.explanation}</p>
                </CardContent>
                <CardFooter>
                    <Button onClick={handlePlayAgain} className="w-full">Play Again</Button>
                </CardFooter>
            </Card>
        );
    }

    return (
        <Card className="w-full max-w-2xl mx-auto">
            {gameState === 'idle' ? (
                <>
                    <CardHeader className="text-center items-center">
                        <img
                            src="https://api.dicebear.com/9.x/bottts/svg"
                            alt="avatar"
                            width={80}
                            height={80}
                            className="rounded-full bg-muted mb-4"
                        />
                        <CardTitle>Challenge the WiseMan</CardTitle>
                        <CardDescription>Place your stake and test your knowledge.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="w-full max-w-xs space-y-4 mx-auto">
                            <div className="flex items-center space-x-2">
                                <Button variant="outline" size="sm" onClick={() => handleBetChange(-10)}>-</Button>
                                <Input value={betAmount} onChange={(e) => setBetAmount(Number(e.target.value))} type="number" className="text-center w-24" />
                                <Button variant="outline" size="sm" onClick={() => handleBetChange(10)}>+</Button>
                                <Input value={`Stake: ${betAmount.toLocaleString()}`} className="text-center flex-1" disabled />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button onClick={handleStartGame} disabled={betAmount <= 0} size="lg" className="w-full">
                            Stake {betAmount.toLocaleString()} &amp; Get Question
                        </Button>
                    </CardFooter>
                </>
            ) : (
                <>
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle className="flex items-center gap-2">The WiseMan Asks...</CardTitle>
                                <Badge variant="outline" className="mt-2">{questionData?.category}</Badge>
                            </div>
                            <img
                                src="https://api.dicebear.com/9.x/bottts/svg"
                                alt="avatar"
                                width={60}
                                height={60}
                                className="rounded-full bg-muted"
                            />
                        </div>
                        <CardDescription className="text-lg pt-4">{questionData?.question}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <Label htmlFor="answer">Your Answer</Label>
                            <Input 
                                id="answer" 
                                placeholder="Type your answer here..." 
                                value={userAnswer}
                                onChange={(e) => setUserAnswer(e.target.value)}
                            />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button onClick={handleAnswerSubmit} disabled={!userAnswer} className="w-full">Submit Answer</Button>
                    </CardFooter>
                </>
            )}
        </Card>
    );
};


const CoinFlipGame = () => {
    const { toast } = useToast();
    const [choice, setChoice] = useState<'heads' | 'tails' | null>(null);
    const [result, setResult] = useState<'heads' | 'tails' | null>(null);
    const [flipping, setFlipping] = useState(false);
    const [betAmount, setBetAmount] = useState(10);
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
        if (balance < betAmount) {
            toast({ variant: 'destructive', title: "Not enough coins", description: `You need ${betAmount.toLocaleString()} to make this bet.` });
            return;
        }

        setFlipping(true);
        setResult(null);
        spendCurrency(betAmount);
        refreshBalance();

        setTimeout(() => {
            const outcome = Math.random() > 0.5 ? 'heads' : 'tails';
            setResult(outcome);
            setFlipping(false);

            if (outcome === choice) {
                const winnings = betAmount * 2;
                addCurrency(winnings);
                toast({
                    title: `You won ${winnings.toLocaleString()} coins!`,
                    description: `It was ${outcome}. Your balance is now ${(balance - betAmount + winnings).toLocaleString()}.`,
                });
            } else {
                toast({
                    variant: 'destructive',
                    title: `You lost ${betAmount.toLocaleString()} coins.`,
                    description: `It was ${outcome}. Your balance is now ${(balance - betAmount).toLocaleString()}.`,
                });
            }
            refreshBalance();
        }, 2500); // Animation duration
    }
    
    const handleBetChange = (amount: number) => {
        setBetAmount(prev => Math.max(0, prev + amount));
    };

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
                        "relative w-full h-full transition-transform ease-in-out duration-coin-flip",
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
                
                <div className="w-full max-w-sm space-y-4">
                    <div className="space-y-2">
                        <Label>Stake Amount</Label>
                        <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm" onClick={() => handleBetChange(-10)} disabled={flipping}>-</Button>
                            <Input 
                                value={betAmount} 
                                onChange={(e) => setBetAmount(Number(e.target.value))} 
                                type="number" 
                                className="text-center" 
                                disabled={flipping} 
                            />
                            <Button variant="outline" size="sm" onClick={() => handleBetChange(10)} disabled={flipping}>+</Button>
                        </div>
                    </div>
                    
                    <div className="flex gap-4 justify-center">
                        <Button variant={choice === 'heads' ? 'default' : 'outline'} onClick={() => setChoice('heads')} disabled={flipping} className='flex-1'>Heads</Button>
                        <Button variant={choice === 'tails' ? 'default' : 'outline'} onClick={() => setChoice('tails')} disabled={flipping} className='flex-1'>Tails</Button>
                    </div>

                    <Button onClick={handleFlip} disabled={!choice || flipping || betAmount <= 0 || balance < betAmount} size="lg" className="w-full">
                        {flipping ? 'Flipping...' : `Flip for ${betAmount.toLocaleString()}`}
                    </Button>
                </div>
                 <p className='text-muted-foreground text-sm h-5'>
                    {result ? `It was ${result}! You ${result === choice ? 'won!' : 'lost.'}` : 'Choose Heads or Tails and place your bet.'}
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
        return <Icon className={cn("w-20 h-20 sm:w-24 sm:h-24 text-primary", rolling && "animate-spin")} />;
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
        case 'puzzle-game':
            return <PuzzleGame />;
        case 'video-play':
            return <VideoPlayGame />;
        case 'wiseman':
            return <WiseManGame />;
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
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
        <div>
            <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
                {details.icon}
                {details.name}
            </h1>
            <p className="text-muted-foreground mt-1">{details.description}</p>
        </div>
        <div className="flex items-center justify-end gap-2 text-lg font-bold text-primary px-2 py-1 rounded-md bg-muted flex-shrink-0">
            <Coins className="w-5 h-5 text-yellow-500"/>
            <span className='text-lg'>{currency.toLocaleString()}</span>
        </div>
      </div>

      {renderGame()}

    </div>
  );
}
