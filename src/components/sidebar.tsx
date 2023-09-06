import { Topics } from "@prisma/client";

import { Button } from "@/components/ui/button";

import { cn, topics } from "@/lib/utils";
import useStore from "@/hooks/useStore";
import { api } from "@/lib/api";

type SidebarProps = React.HTMLAttributes<HTMLDivElement>;

export function Sidebar({ className }: SidebarProps) {
  const {
    currentTopic,
    setCurrentTopic,
    setCurrentSubTopic,
    currentStep,
    setCurrentStep,
  } = useStore();

  const isActive = (topic: string) => {
    return currentTopic === topic;
  };

  const handleClicked = (topic: Topics) => {
    setCurrentTopic(topic);
    setCurrentStep("choice");
    setCurrentSubTopic("");
  };

  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        {topics.map((topic) => (
          <div key={topic.name} className="px-4 py-2">
            <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
              {topic.name}
            </h2>
            <div className="space-y-1">
              {topic.children.map((subtopic) => (
                <Button
                  key={subtopic.name}
                  variant="ghost"
                  size="sm"
                  className={cn("w-full justify-start", {
                    "bg-accent text-primary": isActive(subtopic.topic),
                  })}
                  disabled={currentStep === "exam"}
                  onClick={() => handleClicked(subtopic.topic)}
                >
                  {subtopic.emoji} {subtopic.name}
                </Button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
