import { useEffect, useMemo, useState } from "react";
import { ShareIcon } from "lucide-react";

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

type TotalScoreProps = {
  totalScore: number;
  duration?: number;
};

const TotalScore = ({ totalScore, duration = 1000 }: TotalScoreProps) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = Math.ceil(totalScore / (duration / 10));

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
      <p className="text-sm text-muted-foreground">points</p>
    </>
  );
};

type ScoreCardProps = {
  isLoading: boolean;
  amount: number;
  label: string;
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

const PointsCard = () => {
  const { data, isLoading } = api.user.pointsBreakdown.useQuery();

  const totalScore = data?.totalScore || 0;
  const maxScore = 5000;
  const scoreLevels = [
    { title: "Beginner", score: 500, color: "" },
    { title: "Novice", score: 1000, color: "text-orange-500" },
    { title: "Intermediate", score: 2000, color: "text-primary-500" },
    { title: "Advanced", score: 3500, color: "text-purple-500" },
    { title: "Expert", score: 5000, color: "text-emerald-500" },
  ];

  const getTitles = useMemo(() => {
    const score = Math.min(Math.max(totalScore, 0), maxScore);
    const level = scoreLevels.findIndex((level) => score <= level.score);
    return level >= 0
      ? scoreLevels[level]
      : scoreLevels[scoreLevels.length - 1];
  }, [totalScore, maxScore, scoreLevels]);

  if (!data) return <QuizSkeleton />;

  return (
    <Card className="w-[400px]">
      <CardHeader className="flex flex-row items-center justify-between">
        <Title
          isLoading={isLoading}
          color={getTitles?.color || "text-muted-foreground"}
          title={getTitles?.title || "Unclassified"}
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
            label="Avg Score"
          />
          <ScoreCard
            isLoading={isLoading}
            amount={data.uniqueTopics}
            label="Unique Topics"
          />
          <ScoreCard
            isLoading={isLoading}
            amount={data.totalQuizzes}
            label="Total Quizzes"
          />
          <ScoreCard isLoading amount={0} label="Coming Soon" />
        </section>
      </CardFooter>
    </Card>
  );
};

export default PointsCard;
