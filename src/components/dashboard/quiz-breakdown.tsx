import { QueryObserverBaseResult } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { BarChartComponent } from "./charts";
import { Skeleton } from "../ui/skeleton";
import { useTranslation } from "next-i18next";

interface QuizBreakdownProps {
  queryFn: QueryObserverBaseResult<
    Array<{
      label: string;
      amount: number;
    }>
  >;
}

function QuizBreakdown({ queryFn }: QuizBreakdownProps) {
  const { isLoading, data } = queryFn || {};

  const { t } = useTranslation(["common"]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isLoading ? <Skeleton className="h-6 w-24" /> : t("quizBreakdown")}
        </CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <BarChartComponent data={data} />
      </CardContent>
    </Card>
  );
}

export default QuizBreakdown;
