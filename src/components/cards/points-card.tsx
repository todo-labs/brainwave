import { useEffect, useMemo, useState } from "react";
import { ShareIcon } from "lucide-react";
import { useTranslation } from "next-i18next";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { QuizSkeleton } from "../loading-cards";

import { api } from "@/lib/api";
import { cn } from "@/lib/utils";

type TotalScoreProps = {
  totalScore: number;
  duration?: number;
};

type ScoreCardProps = {
  isLoading: boolean;
  amount: number;
  label: string;
};

const PointsCard = () => {
  const { data, isLoading } = api.user.pointsBreakdown.useQuery();

  const totalScore = data?.totalScore || 0;
  const maxScore = 5000;
  const scoreLevels = [
    { title: "beginner", score: 500, color: "" },
    { title: "novice", score: 1000, color: "text-orange-500" },
    { title: "intermediate", score: 2000, color: "text-primary-500" },
    { title: "advanced", score: 3500, color: "text-purple-500" },
    { title: "expert", score: 5000, color: "text-emerald-500" },
  ];

  const getTitles = useMemo(() => {
    const score = Math.min(Math.max(totalScore, 0), maxScore);
    const level = scoreLevels.findIndex((level) => score <= level.score);
    return level >= 0
      ? scoreLevels[level]
      : scoreLevels[scoreLevels.length - 1];
  }, [totalScore, maxScore, scoreLevels]);

  const { t } = useTranslation();

  const TotalScore = ({ totalScore, duration = 1000 }: TotalScoreProps) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      let start = 0;
      const increment = Math.ceil(totalScore / (duration / 50));

      const interval = setInterval(() => {
        start += increment;
        if (start >= totalScore) {
          setCount(totalScore);
          clearInterval(interval);
        } else {
          setCount(start);
        }
      }, 100);

      return () => clearInterval(interval);
    }, [totalScore, duration]);

    return (
      <>
        <h1 className="text-6xl font-bold">{count}</h1>
        <p className="text-sm text-muted-foreground">
          {t("statistics:points")}
        </p>
      </>
    );
  };

  const ScoreCard = ({ isLoading, amount, label }: ScoreCardProps) => (
    <Card className="p-3">
      <CardTitle className="mb-2 text-primary">
        {isLoading ? 0 : amount}
      </CardTitle>
      <CardDescription>
        {isLoading ? <Skeleton className="h-6 w-24" /> : label}
      </CardDescription>
    </Card>
  );

  const Title = ({
    isLoading,
    title,
    color,
  }: {
    isLoading: boolean;
    title: string;
    color: string;
  }) => (
    <CardTitle className={cn(color)}>
      {isLoading ? <Skeleton className="h-6 w-24" /> : title}
    </CardTitle>
  );

  if (!data) return <QuizSkeleton />;

  return (
    <Card className="w-[400px] xl:w-[600px]">
      <CardHeader className="flex flex-row items-center justify-between">
        <Title
          isLoading={isLoading}
          color={getTitles?.color || "text-muted-foreground"}
          title={t(`statistics:levels:${getTitles?.title || "unclassified"}`)}
        />
        {/* <ShareIcon className="h-4 w-4 text-muted-foreground" /> */}
      </CardHeader>
      <CardContent className="my-10 flex flex-col items-center justify-center text-center">
        <TotalScore totalScore={data.totalScore} />
      </CardContent>
      <CardFooter className="flex flex-col">
        <section className="grid w-full grid-cols-2 gap-4">
          <ScoreCard
            isLoading={isLoading}
            amount={data.averageScore}
            label={t("statistics:avgScore")}
          />
          <ScoreCard
            isLoading={isLoading}
            amount={data.uniqueTopics}
            label={t("statistics:uniqueTopics")}
          />
          <ScoreCard
            isLoading={isLoading}
            amount={data.totalQuizzes}
            label={t("statistics:totalExams")}
          />
          <ScoreCard isLoading amount={0} label="Coming Soon" />
        </section>
      </CardFooter>
    </Card>
  );
};

export default PointsCard;
