"use client";

import type { Score } from "@/lib/storage";
import {
  Card,
  CardContent,
  CardDescription,
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
import { Trophy } from "lucide-react";

interface LeaderboardProps {
  scores: Score[];
}

export function Leaderboard({ scores }: LeaderboardProps) {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-6 w-6 text-yellow-500" />
          <span>Leaderboard</span>
        </CardTitle>
        <CardDescription>Your top 10 scores.</CardDescription>
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
              {scores.slice(0, 10).map((score, index) => (
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
    </Card>
  );
}
