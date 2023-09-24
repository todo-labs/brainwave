import { useTranslation } from "next-i18next";
import { Loader2Icon } from "lucide-react";
import { useState } from "react";

import QuestionCard from "./cards/question-card";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { ScrollArea } from "./ui/scroll-area";
import Timer from "./timer";
import useDisclaimerModal from "@/modals/Disclamer";

import { api } from "@/lib/api";
import { useToast } from "@/hooks/useToast";
import useStore from "@/hooks/useStore";
import { useMixpanel } from "@/lib/mixpanel";

const Exam = () => {
  const utils = api.useContext();
  const { currentQuiz, setCurrentStep, setShowConfetti } = useStore();
  const [answers, setAnswers] = useState(new Map<number, string>());
  const [completed, setCompleted] = useState(false);
  const { trackEvent } = useMixpanel();
  const { toast } = useToast();
  const { Content: DisclaimerModal, open } = useDisclaimerModal(() => {
    gradeQuiz.reset();
  });

  const gradeQuiz = api.quiz.gradeExam.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Your quiz has been graded. Check your results now.",
      });
      setCurrentStep("result");
      setAnswers(new Map<number, string>());
      setShowConfetti(true);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
      });
    },
    retry: 2,
    onMutate: () => open(),
  });

  const submitQuiz = async () => {
    try {
      await gradeQuiz.mutateAsync({
        quizId: currentQuiz?.id ?? "",
        answers: Array.from(answers.values()),
      });
      setCompleted(true);
      trackEvent("FormSubmission", {
        label: "Exam",
        value: currentQuiz?.id,
        questions: currentQuiz?.questions?.length,
        topic: currentQuiz?.topic,
        subtopic: currentQuiz?.subtopic,
        difficulty: currentQuiz?.difficulty,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const { t } = useTranslation(["common"]);

  return (
    <section>
      <div className="flex items-center justify-between">
        <Timer completed={completed} />
      </div>
      <Separator className="my-4" />
      <ScrollArea className="xxl:h-[800px] h-[300px] md:h-[500px]">
        <div className="flex-col space-y-4">
          {!!currentQuiz &&
            currentQuiz.questions?.map((q, index) => (
              <QuestionCard
                key={q.label}
                question={q}
                onSubmit={(answer) => {
                  setAnswers(answers.set(index, answer));
                }}
              />
            ))}
        </div>
      </ScrollArea>
      <Button
        className="float-right mt-5"
        onClick={() => void submitQuiz()}
        disabled={gradeQuiz.isLoading}
      >
        {gradeQuiz.isLoading ? (
          <div className="flex">
            <Loader2Icon className="mr-2 h-5 w-5 animate-spin text-white" />
            <span>{t("home:exam:grade")}</span>
          </div>
        ) : (
          <span>{t("home:exam:submit")}</span>
        )}
      </Button>
      <DisclaimerModal />
    </section>
  );
};

export default Exam;
