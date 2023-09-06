import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const TopicSkeleton = () => {
  return (
    <Card>
      <CardContent>
        <CardHeader>
          <Skeleton />
        </CardHeader>
        <CardTitle>
          <Skeleton />
        </CardTitle>
        <CardDescription>
          <Skeleton />
        </CardDescription>
      </CardContent>
      <CardFooter>
        <Skeleton />
      </CardFooter>
    </Card>
  );
};

export const QuizSkeleton = () => {
  return (
    <Card>
      <CardContent>
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
