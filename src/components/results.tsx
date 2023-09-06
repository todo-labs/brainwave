import { BatteryWarningIcon, Loader2Icon } from "lucide-react";

import Markdown from "./ui/markdown";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import DefaultState from "./default";

import useStore from "@/hooks/useStore";
import { api } from "@/lib/api";

const Results = () => {
  const { currentQuiz } = useStore();

  const { data, isLoading, isError, refetch } = api.quiz.getQuiz.useQuery(
    {
      quizId: currentQuiz?.id ?? "",
    },
    {
      enabled: !!currentQuiz?.id,
    }
  );

  if (isLoading) {
    return (
      <DefaultState
        icon={Loader2Icon}
        iconClassName="animate-spin"
        title="Loading Users"
        description="Please wait while we load all the users"
      />
    );
  }

  if (isError) {
    return (
      <DefaultState
        icon={BatteryWarningIcon}
        title="Error loading Users"
        description="Something went wrong while loading the experiments"
        btnText="Retry"
        onClick={void refetch()}
      />
    );
  }

  return (
    <ScrollArea className="h-[800px]">
      <div className="flex text-sm text-muted">
          <h3>
            {data.topic} / {data.subtopic} / {data.difficulty}
          </h3>
        </div>
      <Markdown content={data?.reviewNotes} />
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};

export default Results;
