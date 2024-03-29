import { useTranslation } from "next-i18next";
import { Loader2Icon } from "lucide-react";
import { useEffect, useState } from "react";

import QuestionCard from "./cards/question-card";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { ScrollArea } from "./ui/scroll-area";
import Timer from "./timer";
import useDisclaimerModal from "@/modals/Disclamer";
import DefaultState from "./default";

import { api } from "@/lib/api";
import { useToast } from "@/hooks/useToast";
import useStore from "@/hooks/useStore";
import { useMixpanel } from "@/lib/mixpanel";
import { useSentry } from "@/lib/sentry";

const Exam = () => {
  const { currentQuiz, setCurrentStep, setShowConfetti } = useStore();
  const [answers, setAnswers] = useState(new Map<number, string>());
  const [completed, setCompleted] = useState(false);
  const { trackEvent } = useMixpanel();
  const { toast } = useToast();
  const { t } = useTranslation(["common"]);
  const { Content: DisclaimerModal, open } = useDisclaimerModal({
    onConfirm: () => useSentry("GradeExam", submitQuiz()),
  });
  const [currentIndex, setCurrentIndex] = useState(0);

  const textList = Array.from(
    { length: 30 },
    (_, index) => `loading-exam-${index + 1}`
  );

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
  });

  const submitQuiz = async () => {
    try {
      await gradeQuiz.mutateAsync({
        quizId: currentQuiz?.id ?? "",
        answers: Array.from(answers.values()),
      });
      setCompleted(true);
      trackEvent("FormSubmission", {
        label: "GradeExam",
        questions: currentQuiz?.questions?.length,
        topic: currentQuiz?.topic,
        subtopic: currentQuiz?.subtopic,
        difficulty: currentQuiz?.difficulty,
        id: currentQuiz?.id,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleAnswer = (answer: string, index: number) => {
    setAnswers(answers.set(index, answer));
    const { id: questionId, type } = currentQuiz?.questions?.[index] ?? {};
    trackEvent("ButtonClick", {
      label: "Question",
      value: answer,
      questionId,
      quizId: currentQuiz?.id,
      topic: currentQuiz?.topic,
      subtopic: currentQuiz?.subtopic,
      type,
    });
  };

  useEffect(() => {
    if (gradeQuiz.isLoading) {
      const interval = setInterval(() => {
        const index = Math.floor(Math.random() * textList.length);
        setCurrentIndex(index);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [gradeQuiz.isLoading]);

  const Loading = () => (
    <DefaultState
      icon={Loader2Icon}
      iconClassName="animate-spin"
      title={t(textList[currentIndex] || "loading-exam")}
    />
  );

  return (
    <section>
      <div className="flex items-center justify-between">
        <Timer completed={completed} />
      </div>
      <Separator className="my-4" />
      {gradeQuiz.isLoading ? (
        <Loading />
      ) : (
        <ScrollArea className="xxl:h-[800px] h-[300px] md:h-[500px]">
          <div className="flex-col space-y-4">
            {!!currentQuiz &&
              currentQuiz.questions?.map((q, index) => (
                <QuestionCard
                  key={q.label}
                  question={q}
                  onSubmit={(answer) => {
                    handleAnswer(answer, index);
                  }}
                  disabled={completed || gradeQuiz.isLoading}
                />
              ))}
          </div>
        </ScrollArea>
      )}
      <Button
        className="float-right mt-5"
        onClick={open}
        disabled={gradeQuiz.isLoading}
      >
        {gradeQuiz.isLoading ? (
          <div className="flex">
            <Loader2Icon className="mr-2 h-5 w-5 animate-spin text-white" />
            <span>{t("home-exam-grade")}</span>
          </div>
        ) : (
          t("submit")
        )}
      </Button>
      <DisclaimerModal />
    </section>
  );
};

export default Exam;
