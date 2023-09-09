import useStore from "@/hooks/useStore";
import { api } from "@/lib/api";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import QuizCard from "./topic-card";
import React from "react";
import Section from "./section";
import { TopicSkeleton } from "./loading-cards";
import { Button } from "./ui/button";

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

  const cleanTopic = topic.replace(/_/g, " ").toLocaleLowerCase();

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
          {data && data.length === 0 && <h1>Coming soon 🚀</h1>}
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
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <Button
        disabled={!currentSubTopic}
        onClick={() => setCurrentStep("config")}
      >
        Continue
      </Button>
    </Section>
  );
};

export default PickATopic;
