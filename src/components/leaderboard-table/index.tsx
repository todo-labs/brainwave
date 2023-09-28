import { AwardIcon } from "lucide-react";
import { useTranslation } from "next-i18next";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";

import { api } from "@/lib/api";
import { cleanEnum } from "@/lib/utils";

export function LeaderboardTable() {
  const { data, isLoading } = api.meta.leaderboard.useQuery();

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

  const { t } = useTranslation(["common"]);

  const loading = new Array(5).fill(0).map((_, index) => (
    <TableRow key={index}>
      <TableCell className="flex items-center font-medium">
        <Skeleton className="h-6 w-6 rounded-full" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-20" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-20" />
      </TableCell>
      <TableCell className="text-right">
        <Skeleton className="h-4 w-10" />
      </TableCell>
    </TableRow>
  ));

  return (
    <Table>
      <TableCaption>{t("statistics-leaderboard-description")}</TableCaption>
      <TableHeader>
        <h1 className="pb-4 text-2xl font-medium">
          {t("statistics-leaderboard-title")}
        </h1>
        <TableRow>
          <TableHead className="text-left">
            {t("statistics-leaderboard-user")}
          </TableHead>
          <TableHead>{t("statistics-leaderboard-topic")}</TableHead>
          <TableHead>{t("statistics-leaderboard-subtopic")}</TableHead>
          <TableHead className="text-right">
            {t("statistics-leaderboard-score")}
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading && loading}
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
