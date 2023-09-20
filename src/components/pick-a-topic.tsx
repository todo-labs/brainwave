import useStore from "@/hooks/useStore";
import { api } from "@/lib/api";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import QuizCard from "./cards/topic-card";
import React from "react";
import Section from "./section";
import { TopicSkeleton } from "./loading-cards";
import { Button } from "./ui/button";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { ExclamationTriangleIcon, RocketIcon } from "@radix-ui/react-icons";

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
      description="Select a subtopic to start your exam."
    >
      <ScrollArea>
        <div className="flex space-x-4 pb-4">
          {isLoading &&
            new Array(10).fill(0).map((_, i) => <TopicSkeleton key={i} />)}
          {isError && (
            <Alert variant="destructive">
              <ExclamationTriangleIcon className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                There was an error fetching our topics. Please try again
              </AlertDescription>
            </Alert>
          )}
          {data && data.length === 0 && (
            <Alert className="w-fit">
              <RocketIcon className="h-4 w-4" />
              <AlertTitle>Heads up!</AlertTitle>
              <AlertDescription>
                We are still working on adding more topics. Please check back in
                a few days.
              </AlertDescription>
            </Alert>
          )}
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
