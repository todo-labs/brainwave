import { FileEditIcon } from "lucide-react";
import { Quiz } from "@prisma/client";
import { useTranslation } from "next-i18next";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

import { QuizSkeleton } from "../loading-cards";
import Section from "../section";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";

import { api } from "@/lib/api";
import { cleanEnum } from "@/lib/utils";
import useStore from "@/hooks/useStore";
import { useMixpanel } from "@/lib/mixpanel";

const PastExamCard = (props: Quiz) => {
  const { setCurrentQuiz, setCurrentStep } = useStore();
  const { trackEvent } = useMixpanel();

  const handleCardClick = () => {
    setCurrentQuiz({ ...props, questions: [] });
    setCurrentStep("result");
    trackEvent("ButtonClick", {
      label: "PastExamCard",
      id: props.id,
      topic: props.topic,
      subtopic: props.subtopic,
      difficulty: props.difficulty,
    });
  };

  return (
    <Card
      className="h-[200px] min-w-[250px] max-w-[500px] cursor-pointer justify-center rounded-xl border-2 p-2 shadow-none transition-shadow hover:border-primary hover:border-primary hover:shadow-lg"
      onClick={handleCardClick}
    >
      <CardHeader className="mt-2">
        <Badge className="w-fit rounded-md">
          {cleanEnum(props.difficulty)}
        </Badge>
        <CardTitle className="overflow-ellipsis text-2xl capitalize">
          {props.subtopic}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex w-full flex-col justify-between space-y-4">
        <CardDescription className="text-clip text-sm">
          <Progress value={props.score} max={100} />
        </CardDescription>
      </CardContent>
    </Card>
  );
};

const PastExams = () => {
  const { currentTopic } = useStore();

  const { data, isError, isLoading } = api.quiz.getPastExams.useQuery({
    topic: currentTopic,
  });

  const { t } = useTranslation(["common"]);

  return (
    <Section title={t("home-pastExams-title")} description="">
      <ScrollArea>
        <div className="flex space-x-4 pb-4">
          {isLoading &&
            new Array(10).fill(0).map((_, i) => <QuizSkeleton key={i} />)}
          {isError && (
            <Alert variant="destructive">
              <ExclamationTriangleIcon className="h-4 w-4" />
              <AlertTitle>{t("home-pastExams-error-title")}</AlertTitle>
              <AlertDescription>
                {t("home-pastExams-error-message")}
              </AlertDescription>
            </Alert>
          )}
          {data?.length === 0 && (
            <div className="flex h-[300px] w-full flex-col items-center justify-center gap-4 rounded-lg border border-dashed">
              <FileEditIcon className="h-16 w-16 text-muted-foreground/60 dark:text-muted" />
              <h2 className="text-xl font-bold">
                {t("home-pastExams-empty-title-pre")}{" "}
                <span className="text-primary">{cleanEnum(currentTopic)}</span>{" "}
                {t("home-pastExams-empty-title-post")}
              </h2>
              <p className="max-w-sm text-center text-base text-muted-foreground">
                {t("home-pastExams-empty-message")}
              </p>
            </div>
          )}
          {data && data.map((exam) => <PastExamCard key={exam.id} {...exam} />)}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </Section>
  );
};

export default PastExams;
