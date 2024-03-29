import { useTranslation } from "next-i18next";
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
import { useState } from "react";
import { useMixpanel } from "@/lib/mixpanel";
import { api } from "@/lib/api";
import useStore from "@/hooks/useStore";
import { useToast } from "@/hooks/useToast";
import { Button } from "@/components/ui/button";


const QuitExamModal = () => {
  const { t } = useTranslation(["common"]);
  const [isOpen, setIsOpen] = useState(false);
  const { trackEvent } = useMixpanel();
  const { toast } = useToast();
   const { currentQuiz, setCurrentStep, setCurrentQuiz } =
     useStore();

  const quitQuizMutation = api.quiz.quitQuiz.useMutation({
      onSuccess: () => {
        setCurrentQuiz(null);
        setCurrentStep("choice");
        toast({
          title: t("toast-generic-success-title"),
          description:
            "Your Quiz has been deleted. If you found any issues, please report it.",
        });
      },
      onError: (error) => {
        toast({
          title: t("toast-generic-error-title"),
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

  const open = () => {
    setIsOpen(true);
    trackEvent("ViewedModal", {
      label: "QuitQuiz",
      topic: currentQuiz?.topic,
      subtopic: currentQuiz?.subtopic,
      difficulty: currentQuiz?.difficulty,
      id: currentQuiz?.id,
    });
  };

  const handleConfirm = async () => {
    try {
      setIsOpen(false);
      await quitQuizMutation.mutateAsync({
        quizId: currentQuiz?.id ?? "",
      });
      trackEvent("ButtonClick", {
        label: "QuitQuiz",
        value: "Confirmed",
        topic: currentQuiz?.topic,
        subtopic: currentQuiz?.subtopic,
        difficulty: currentQuiz?.difficulty,
        id: currentQuiz?.id,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
    trackEvent("ButtonClick", {
      label: "QuitExamModal",
      value: "Cancelled",
    });
  };

  return (
    <AlertDialog isOpen={isOpen} onDismiss={handleCancel}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" onClick={open}>
          {t("quit-exam-btn")}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {t("quit-exam-title")}
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription>
          {t("quit-exam-desc")}
        </AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogAction onClick={handleConfirm}>
            {t("yes")}
          </AlertDialogAction>
          <AlertDialogCancel onClick={handleCancel}>
            {t("no")}
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

}

export default QuitExamModal;