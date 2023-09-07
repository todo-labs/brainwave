import { BatteryWarningIcon, Loader2Icon } from "lucide-react";

import Markdown from "./ui/markdown";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import DefaultState from "./default";

import useStore from "@/hooks/useStore";
import { api } from "@/lib/api";
import { cleanEnum } from "@/lib/utils";

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
        title="Loading Results"
        description="Please wait while we load your exam results"
      />
    );
  }

  if (isError) {
    return (
      <DefaultState
        icon={BatteryWarningIcon}
        title="uh oh!"
        description="Something went wrong while loading your results."
        btnText="Retry"
        onClick={void refetch()}
      />
    );
  }

  return (
    <ScrollArea className="mx-auto flex h-[800px] flex-col">
      <div className="flex text-sm capitalize text-primary">
        <h3>
          {cleanEnum(data.topic).toLowerCase()} / {data.subtopic} /{" "}
          {cleanEnum(data.difficulty).toLowerCase()}
        </h3>
      </div>
      <Markdown content={data?.reviewNotes} />
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};

export default Results;
