import { useTranslation } from "next-i18next";
import { useState } from "react";

import QuestionCard from "@/components/cards/question-card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import Timer from "@/components/timer";
import useDisclaimerModal from "@/modals/Disclamer";
import LoadingStepper from "@/components/cards/loading-stepper";

import { api } from "@/lib/api";
import { useToast } from "@/hooks/useToast";
import useStore from "@/hooks/useStore";
import { useMixpanel } from "@/lib/mixpanel";
import { useSentry } from "@/lib/sentry";
import { Loader2Icon } from "lucide-react";

const Exam = () => {
  const { currentQuiz, setCurrentStep, setShowConfetti, setCurrentQuiz } =
    useStore();
  const [answers, setAnswers] = useState(new Map<number, string>());
  const [completed, setCompleted] = useState(false);
  const { trackEvent } = useMixpanel();
  const { toast } = useToast();
  const { t } = useTranslation(["common"]);
  const { Content: DisclaimerModal, open } = useDisclaimerModal({
    onConfirm: () => void useSentry("GradeExam", submitQuiz()),
  });

  const gradeQuiz = api.quiz.gradeExam.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Your quiz has been graded. Check your results now.",
      });
      setAnswers(new Map<number, string>());
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
      });
      trackEvent("Error", {
        label: "GradeExam",
        error: error.message,
        topic: currentQuiz?.topic,
        subtopic: currentQuiz?.subtopic,
        difficulty: currentQuiz?.difficulty,
        id: currentQuiz?.id,
      });
    },
    retry: 2,
  });

  const genReviewNotesMutation = api.quiz.genReviewNotes.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Your review notes has been generated.",
      });
      setCurrentStep("result");
      setShowConfetti(true);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
      });
      trackEvent("Error", {
        label: "GenerateReviewNotes",
        error: error.message,
        topic: currentQuiz?.topic,
        subtopic: currentQuiz?.subtopic,
        difficulty: currentQuiz?.difficulty,
        id: currentQuiz?.id,
      });
    },
    retry: 2,
  });

  const quitQuizMutation = api.quiz.quitQuiz.useMutation({
    onSuccess: () => {
      setCurrentQuiz(null);
      setCurrentStep("choice");
      toast({
        title: "Success",
        description:
          "Your Quiz has been deleted. If you found any issues, please report it.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
      });
      trackEvent("Error", {
        label: "QuitQuiz",
        error: error.message,
        topic: currentQuiz?.topic,
        subtopic: currentQuiz?.subtopic,
        difficulty: currentQuiz?.difficulty,
        id: currentQuiz?.id,
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
      await generateReviewNotes();
    } catch (error) {
      console.error(error);
    }
  };

  const generateReviewNotes = async () => {
    try {
      await genReviewNotesMutation.mutateAsync({
        quizId: currentQuiz?.id ?? "",
      });
      trackEvent("ButtonClick", {
        label: "GenerateReviewNotes",
        topic: currentQuiz?.topic,
        subtopic: currentQuiz?.subtopic,
        difficulty: currentQuiz?.difficulty,
        id: currentQuiz?.id,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const quitQuiz = async () => {
    try {
      await quitQuizMutation.mutateAsync({
        quizId: currentQuiz?.id ?? "",
      });
      trackEvent("ButtonClick", {
        label: "QuitQuiz",
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

  const Loading = () => (
    <section className="flex flex-col space-y-3">
      <LoadingStepper
        title={"Grade Exam"}
        loading={gradeQuiz.isLoading}
        completed={!!currentQuiz?.score}
      />
      <LoadingStepper
        title={"Generate Review Notes"}
        loading={genReviewNotesMutation.isLoading && !gradeQuiz.isLoading}
        completed={!!currentQuiz?.reviewNotes}
      />
    </section>
  );

  const QuitButton = () => (
    <Button
      onClick={quitQuiz}
      variant="destructive"
      disabled={completed || gradeQuiz.isLoading}
    >
      {quitQuizMutation.isLoading ? (
        <Loader2Icon className="animate-spin" />
      ) : (
        t("quit")
      )}
    </Button>
  );

  return (
    <section>
      <div className="flex items-center justify-between space-x-4">
        <Timer completed={completed} />
        <QuitButton />
      </div>
      <Separator className="my-4" />
      {gradeQuiz.isLoading || genReviewNotesMutation.isLoading ? (
        <Loading />
      ) : (
        <>
          <ScrollArea className="xxl:h-[800px] h-[600px] md:h-[500px]">
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
            <ScrollBar orientation="vertical" />
          </ScrollArea>
          <Button
            className="float-right mt-5"
            onClick={open}
            disabled={!!currentQuiz?.score}
          >
            {t("submit")}
          </Button>
        </>
      )}
      <DisclaimerModal />
    </section>
  );
};

export default Exam;
