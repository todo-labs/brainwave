import { api } from "@/lib/api";
import { QuizSkeleton } from "./loading-cards";
import QuizCard from "./topic-card";
import Section from "./section";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import useStore from "@/hooks/useStore";
import { cleanEnum } from "@/lib/utils";
import { format } from "date-fns";
import { FileEditIcon } from "lucide-react";

const PastExams = () => {
  const { currentTopic, setCurrentQuiz, setCurrentStep } = useStore();

  const getPastExams = api.quiz.getPastExams.useQuery({
    topic: currentTopic,
  });

  return (
    <Section title="Past Exams" description="">
      <ScrollArea>
        <div className="flex space-x-4 pb-4">
          {getPastExams.isLoading &&
            new Array(10).fill(0).map((_, i) => <QuizSkeleton key={i} />)}
          {getPastExams.isError && <h1>Loading....</h1>}
          {getPastExams.data?.length === 0 && (
            <div className="flex h-[300px] w-full flex-col items-center justify-center gap-4 rounded-lg border border-dashed">
              <FileEditIcon className="h-16 w-16 text-muted-foreground/60 dark:text-muted" />
              <h2 className="text-xl font-bold">
                There are no previous{" "}
                <span className="text-primary">{cleanEnum(currentTopic)}</span>{" "}
                exams
              </h2>
              <p className="max-w-sm text-center text-base text-muted-foreground">
                You have not taken any exams for this topic. Kinda weird, but to
                each their own.
              </p>
            </div>
          )}
          {getPastExams.data &&
            getPastExams.data.map((exam) => (
              <QuizCard
                title={cleanEnum(exam.topic)}
                key={exam.id}
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                onClick={() => {
                  setCurrentQuiz({ ...exam, questions: [] });
                  setCurrentStep("result");
                }}
              >
                <div className="flex items-center justify-between p-3">
                  <div className="space-y-1">
                    <h2 className="text-sm font-semibold tracking-tight text-muted-foreground">
                      {format(exam.createdAt, "dd MMM yyyy")}
                    </h2>
                  </div>
                </div>
              </QuizCard>
            ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </Section>
  );
};

export default PastExams;
