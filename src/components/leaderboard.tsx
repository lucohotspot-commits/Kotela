"use client";

import { useState } from "react";
import type { Score } from "@/lib/storage";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trophy, ChevronDown, ChevronsUp, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LeaderboardProps {
  scores: Score[];
}

const INITIAL_DISPLAY_COUNT = 5;
const LOAD_MORE_COUNT = 5;

export function Leaderboard({ scores }: LeaderboardProps) {
  const [displayCount, setDisplayCount] = useState(INITIAL_DISPLAY_COUNT);

  const scoresToShow = scores.slice(0, displayCount);
  const canLoadMore = displayCount < scores.length;

  const handleShowMore = () => {
    setDisplayCount(prevCount => prevCount + LOAD_MORE_COUNT);
  };

  const handleShowLess = () => {
    setDisplayCount(INITIAL_DISPLAY_COUNT);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Trophy className="h-5 w-5 text-yellow-500" />
          <span>Leaderboard</span>
        </CardTitle>
        <CardDescription className="text-xs">Your top mining runs.</CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-0">
        {scores.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px] text-xs">Rank</TableHead>
                <TableHead className="text-xs">Coins</TableHead>
                <TableHead className="text-right text-xs">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scoresToShow.map((score, index) => (
                <TableRow key={`${score.date}-${score.score}-${index}`} className="h-10">
                  <TableCell className="font-medium text-xs p-2">{index + 1}</TableCell>
                  <TableCell className="text-xs p-2">{score.score.toLocaleString()}</TableCell>
                  <TableCell className="text-right text-xs text-muted-foreground p-2">
                    {new Date(score.date).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center text-muted-foreground border-2 border-dashed rounded-lg p-6">
            <p className="text-sm">No scores yet. Be the first!</p>
          </div>
        )}
      </CardContent>
      {scores.length > INITIAL_DISPLAY_COUNT && (
        <CardFooter className="justify-center border-t p-2">
            {canLoadMore ? (
                <Button variant="ghost" onClick={handleShowMore} className="w-full h-8 text-xs">
                    <ChevronDown className="mr-2 h-4 w-4" />
                    Show More
                </Button>
            ) : (
                <div className="flex w-full justify-center items-center gap-2">
                    <Button variant="ghost" onClick={handleShowLess} className="flex-1 h-8 text-xs">
                        <ChevronsUp className="mr-2 h-4 w-4" />
                        Show Less
                    </Button>
                     <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="flex-1 h-8 text-xs">
                                <Eye className="mr-2 h-4 w-4" />
                                View All
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <Trophy className="h-5 w-5 text-yellow-500" /> All Scores
                            </DialogTitle>
                            </DialogHeader>
                            <ScrollArea className="max-h-[60vh]">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[80px]">Rank</TableHead>
                                            <TableHead>Coins</TableHead>
                                            <TableHead className="text-right">Date</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                    {scores.map((score, index) => (
                                        <TableRow key={`${score.date}-${score.score}-${index}`}>
                                        <TableCell className="font-medium">{index + 1}</TableCell>
                                        <TableCell>{score.score.toLocaleString()}</TableCell>
                                        <TableCell className="text-right text-muted-foreground">
                                            {new Date(score.date).toLocaleDateString()}
                                        </TableCell>
                                        </TableRow>
                                    ))}
                                    </TableBody>
                                </Table>
                            </ScrollArea>
                        </DialogContent>
                    </Dialog>
                </div>
            )}
        </CardFooter>
      )}
    </Card>
  );
}
