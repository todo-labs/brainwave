import { ExclamationTriangleIcon, RocketIcon } from "@radix-ui/react-icons";
import { useTranslation } from "next-i18next";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import QuizCard from "./cards/topic-card";
import React from "react";
import Section from "./section";
import { TopicSkeleton } from "./loading-cards";
import { Button } from "./ui/button";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

import useStore from "@/hooks/useStore";
import { api } from "@/lib/api";
import { useMixpanel } from "@/lib/mixpanel";

const PickATopic = () => {
  const {
    currentTopic: topic,
    currentSubTopic,
    setCurrentSubTopic,
    setCurrentStep,
  } = useStore();

  const { isLoading, data, isError } = api.meta.getSubtopics.useQuery(
    { topic },
    {
      enabled: !!topic,
    }
  );

  const { trackEvent } = useMixpanel();

  const cleanTopic = topic.replace(/_/g, " ").toLocaleLowerCase();

  const { t } = useTranslation(["common"]);

  const handleCardClick = (subtopic: string) => {
    setCurrentSubTopic(subtopic);
    trackEvent("ButtonClick", {
      topic,
      subtopic,
    });
  };

  const handleContinueClick = () => {
    setCurrentStep("config");
    trackEvent("ButtonClick", {
      topic,
      subtopic: currentSubTopic,
    });
  };

  return (
    <Section
      title={t("home:pickAnExam:title", { topic: cleanTopic })}
      description={t("home:pickAnExam:desc")}
    >
      <ScrollArea>
        <div className="flex space-x-4 pb-4">
          {isLoading &&
            new Array(10).fill(0).map((_, i) => <TopicSkeleton key={i} />)}
          {isError && (
            <Alert variant="destructive">
              <ExclamationTriangleIcon className="h-4 w-4" />
              <AlertTitle>{t("home:pickAnExam:error.title")}</AlertTitle>
              <AlertDescription>
                {t("home:pickAnExam:error.message")}
              </AlertDescription>
            </Alert>
          )}
          {data && data.length === 0 && (
            <Alert className="w-fit">
              <RocketIcon className="h-4 w-4" />
              <AlertTitle>{t("home:pickAnExam:comingSoon.title")}</AlertTitle>
              <AlertDescription>
                {t("home:pickAnExam:comingSoon.message")}
              </AlertDescription>
            </Alert>
          )}
          {data &&
            data.map((subtopic) => (
              <QuizCard
                key={subtopic}
                title={subtopic}
                selected={subtopic === currentSubTopic}
                onClick={() => handleCardClick(subtopic)}
              />
            ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <Button disabled={!currentSubTopic} onClick={handleContinueClick}>
        {t("continue")}
      </Button>
    </Section>
  );
};

export default PickATopic;
