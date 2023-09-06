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
      <CardContent className="p-5">
        <CardTitle>
          <Skeleton className="h-4 w-[100px]" />
        </CardTitle>
      </CardContent>
    </Card>
  );
};

export const QuizSkeleton = () => {
  return (
    <Card>
      <CardContent className="p-5">
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
