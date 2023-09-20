import { useEffect, useState } from "react";

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

const Title = ({ isLoading, title }: { isLoading: boolean; title: string }) => (
  <CardTitle>{isLoading ? <Skeleton className="h-6 w-24" /> : title}</CardTitle>
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

  if (!data) {
    return <QuizSkeleton />;
  }

  const title = data?.averageScore > 50 ? "Good Job" : "Keep Trying";

  return (
    <Card className="w-[400px]">
      <CardHeader>
        <Title isLoading={isLoading} title={title} />
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
