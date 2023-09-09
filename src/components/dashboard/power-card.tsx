import { type QueryObserverBaseResult } from "@tanstack/react-query";
import { type LucideIcon, Loader2Icon } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

interface QueryCardProps {
  query: QueryObserverBaseResult<number | string>;
  title: string;
  icon: LucideIcon;
}

function PowerCard({ query, title, icon }: QueryCardProps) {
  const { data, isLoading } = query;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        {
          isLoading ? (
            <Skeleton className="h-6 w-[50px] pb-4" />
          ) : (
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          )
        }
        {React.createElement(
          icon,
          { className: "text-muted-foreground h-6 w-6 text-primary" },
          null
        )
        }
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Loader2Icon className="h-4 w-4 animate-spin text-muted-foreground" />
        ) : (
          <div className="text-2xl font-bold">{data}</div>
        )}
      </CardContent>
    </Card>
  );
}

export default PowerCard;
