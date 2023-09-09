import { Topics } from "@prisma/client";
import { Menu } from "lucide-react";
import { useMemo } from "react";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { cn, topics } from "@/lib/utils";
import useStore from "@/hooks/useStore";

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

  const content = useMemo(() => {
    return topics.map((topic) => (
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
    ));
  }, [
    currentStep,
    isActive,
    setCurrentStep,
    setCurrentSubTopic,
    setCurrentTopic,
  ]);

  const Mobile = () => {
    return (
      <AlertDialog>
        <AlertDialogTrigger className="p-5 md:hidden">
          <Menu className="h-6 w-6 text-primary" />
        </AlertDialogTrigger>
        <AlertDialogContent>
          {content}
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  };

  return (
    <>
      <Mobile />
      <div className={cn("pb-12 md:hidden", className)}>
        <div className="space-y-4 py-4">{content}</div>
      </div>
    </>
  );
}
