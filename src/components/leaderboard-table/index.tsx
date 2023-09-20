import { AwardIcon } from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { api } from "@/lib/api";
import { cleanEnum } from "@/lib/utils";
import { Badge } from "../ui/badge";

export function LeaderboardTable() {
  const { data } = api.meta.leaderboard.useQuery();

  const indexToIcon = (index: number) => {
    switch (index) {
      case 0:
        return <AwardIcon className="h-6 w-6 border-none fill-primary" />;
      case 1:
        return <AwardIcon className="h-6 w-6 fill-yellow-400" />;
      case 2:
        return <AwardIcon className="h-6 w-6 text-muted-foreground" />;
      default:
        return null;
    }
  };

  return (
    <Table>
      <TableCaption>
        Top 5 users who scored the highest on their quizzes in the last 30 days.
      </TableCaption>
      <TableHeader>
        <h1 className="pb-4 text-2xl font-medium">Leaderboard</h1>
        <TableRow>
          <TableHead className="text-left">User</TableHead>
          <TableHead>Topic</TableHead>
          <TableHead>SubTopic</TableHead>
          <TableHead className="text-right">Score</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.map((item, index) => (
          <TableRow key={item.name}>
            <TableCell className="flex items-center font-medium">
              {indexToIcon(index)}
              {item.name}
            </TableCell>
            <TableCell>
              <Badge>{cleanEnum(item.topic)}</Badge>
            </TableCell>
            <TableCell>{item.subtopic}</TableCell>
            <TableCell className="text-right">{item.score}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
