"use client";

import { useState, useEffect } from 'react';
import { getScores, type Score } from '@/lib/storage';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trophy } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function LeaderboardPage() {
  const [scores, setScores] = useState<Score[]>([]);

  useEffect(() => {
    setScores(getScores());
  }, []);

  return (
    <div className="flex-grow flex flex-col items-center">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Trophy className="h-6 w-6 text-yellow-500" />
            <span>Leaderboard</span>
          </CardTitle>
          <CardDescription>All top mining runs are recorded here.</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[60vh]">
            {scores.length > 0 ? (
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
            ) : (
              <div className="text-center text-muted-foreground border-2 border-dashed rounded-lg p-12">
                <p>No scores yet. Play a game to see your name in lights!</p>
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
