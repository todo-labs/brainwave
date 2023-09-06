import useStore from "@/hooks/useStore";
import { api } from "@/lib/api";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import QuizCard from "./topic-card";
import React from "react";
import Section from "./section";
import { TopicSkeleton } from "./loading-cards";
import { Button } from "./ui/button";

const PickATopic = () => {
  const { currentTopic, currentSubTopic, setCurrentSubTopic, setCurrentStep } =
    useStore();

  const { isLoading, data, isError } = api.meta.getSubtopics.useQuery(
    {
      topic: currentTopic,
    },
    {
      enabled: !!currentTopic,
    }
  );

  const cleanTopic = currentTopic.replace(/_/g, " ").toLocaleLowerCase();

  return (
    <Section
      title={`Choose your ${cleanTopic} Exam`}
      description="Top picks for you."
    >
      <ScrollArea>
        <div className="flex space-x-4 pb-4">
          {isLoading &&
            new Array(10).fill(0).map((_, i) => <TopicSkeleton key={i} />)}
          {isError && <h1>Error....</h1>}
          {data &&
            data.map((subtopic) => (
              <QuizCard
                key={subtopic}
                title={subtopic}
                selected={subtopic === currentSubTopic}
                onClick={() => {
                  setCurrentSubTopic(subtopic);
                }}
              />
            ))}
        </div>
        <Button
          disabled={!currentSubTopic}
          onClick={() => setCurrentStep("config")}
        >
          Continue
        </Button>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </Section>
  );
};

export default PickATopic;
