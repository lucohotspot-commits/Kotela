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
import { Trophy, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LeaderboardProps {
  scores: Score[];
}

const INITIAL_DISPLAY_COUNT = 5;

export function Leaderboard({ scores }: LeaderboardProps) {
  const [showAll, setShowAll] = useState(false);

  const scoresToShow = showAll ? scores : scores.slice(0, INITIAL_DISPLAY_COUNT);

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-6 w-6 text-yellow-500" />
          <span>Leaderboard</span>
        </CardTitle>
        <CardDescription>Your top scores.</CardDescription>
      </CardHeader>
      <CardContent>
        {scores.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Rank</TableHead>
                <TableHead>Score</TableHead>
                <TableHead className="text-right">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scoresToShow.map((score, index) => (
                <TableRow key={`${score.date}-${score.score}-${index}`}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>{score.score.toLocaleString()}</TableCell>
                  <TableCell className="text-right text-sm text-muted-foreground">
                    {new Date(score.date).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center text-muted-foreground border-2 border-dashed rounded-lg p-8">
            <p>No scores yet. Be the first!</p>
          </div>
        )}
      </CardContent>
      {scores.length > INITIAL_DISPLAY_COUNT && (
        <CardFooter className="justify-center border-t pt-4">
          <Button
            variant="ghost"
            onClick={() => setShowAll(!showAll)}
            className="w-full"
          >
            {showAll ? (
              <>
                <ChevronUp className="mr-2 h-4 w-4" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="mr-2 h-4 w-4" />
                Show More
              </>
            )}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
