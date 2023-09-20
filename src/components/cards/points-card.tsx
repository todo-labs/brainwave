import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { api } from "@/lib/api";

const Title = ({ isLoading, title }: { isLoading: boolean; title: string }) => (
  <CardTitle>{isLoading ? <Skeleton className="h-6 w-24" /> : title}</CardTitle>
);

const TotalScore = ({ totalScore }: { totalScore: number }) => (
  <>
    <h1 className="text-2xl font-semibold">{totalScore}</h1>
    <p className="text-sm text-muted-foreground">points</p>
  </>
);

const ScoreFactor = ({
  isLoading,
  averageScore,
  uniqueTopics,
}: {
  isLoading: boolean;
  averageScore: number;
  uniqueTopics: number;
}) => (
  <CardFooter className="flex flex-col">
    <section className="grid grid-cols-2 gap-4">
      <Card className="p-3">
        <CardTitle className="text-primary">
          {isLoading ? <Skeleton className="h-6 w-24" /> : averageScore}
        </CardTitle>
        <CardDescription>Avg Score</CardDescription>
      </Card>
      <Card className="p-3">
        <CardTitle className="text-primary">
          {isLoading ? <Skeleton className="h-6 w-24" /> : uniqueTopics}
        </CardTitle>
        <CardDescription>Unique Topics</CardDescription>
      </Card>
    </section>
  </CardFooter>
);

const PointsCard = () => {
  const { data, isLoading } = api.user.pointsBreakdown.useQuery();

  if (!data) {
    return "No Data";
  }

  const title = data?.averageScore > 50 ? "Good Job" : "Keep Trying";

  return (
    <Card>
      <CardHeader>
        <Title isLoading={isLoading} title={title} />
        <CardDescription>your score</CardDescription>
      </CardHeader>
      <CardContent>
        <TotalScore totalScore={data.totalScore} />
      </CardContent>
      <ScoreFactor
        isLoading={isLoading}
        averageScore={data.averageScore}
        uniqueTopics={data.uniqueTopics}
      />
    </Card>
  );
};

export default PointsCard;
