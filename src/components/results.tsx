import { BatteryWarningIcon, Loader2Icon } from "lucide-react";
import { useTranslation } from "next-i18next";

import Markdown from "./ui/markdown";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import DefaultState from "./default";

import useStore from "@/hooks/useStore";
import { api } from "@/lib/api";
import { cleanEnum } from "@/lib/utils";

const Results = () => {
  const { currentQuiz } = useStore();

  const { data, isLoading, isError, refetch } = api.quiz.getQuiz.useQuery(
    { quizId: currentQuiz?.id ?? "" },
    { enabled: !!currentQuiz?.id }
  );

  const { t } = useTranslation(["common"]);

  if (isLoading) {
    return (
      <DefaultState
        icon={Loader2Icon}
        iconClassName="animate-spin"
        title={t("home-results-loading-title")}
        description={t("home-results-loading-message")}
      />
    );
  }

  if (isError) {
    return (
      <DefaultState
        icon={BatteryWarningIcon}
        title={t("home-results-error-title")}
        description={t("home-results-error-message")}
        btnText={t("home-results-error-btn")}
        onClick={void refetch()}
      />
    );
  }

  return (
    <ScrollArea className="mx-auto flex flex-col md:h-[800px] xl:h-[1000px]">
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
