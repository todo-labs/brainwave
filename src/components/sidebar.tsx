import { Topics } from "@prisma/client";

import { Button } from "@/components/ui/button";

import { cn, topics } from "@/lib/utils";
import useStore from "@/hooks/useStore";
import { useMixpanel } from "@/lib/mixpanel";
import { useTranslation } from "next-i18next";

type SidebarProps = React.HTMLAttributes<HTMLDivElement>;

export function Sidebar({ className }: SidebarProps) {
  const {
    currentTopic,
    setCurrentTopic,
    setCurrentSubTopic,
    currentStep,
    setCurrentStep,
  } = useStore();

  const { t } = useTranslation(["common"]);

  const isActive = (topic: string) => {
    return currentTopic === topic;
  };

  const { trackEvent } = useMixpanel();

  const handleClicked = (topic: Topics) => {
    setCurrentTopic(topic);
    setCurrentStep("choice");
    setCurrentSubTopic("");
    trackEvent("ButtonClick", {
      label: "Sidebar",
      value: topic,
    });
  };

  return (
    <div className={cn("pb-12 md:hidden", className)}>
      <div className="space-y-4 py-4">
        {topics.map((topic) => (
          <div key={topic.name} className="px-4 py-2">
            <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
              {t(topic.name)}
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
