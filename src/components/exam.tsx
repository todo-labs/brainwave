import { Loader2Icon } from "lucide-react";
import { useState } from "react";

import Question from "./question";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { ScrollArea } from "./ui/scroll-area";
import Timer from "./timer";

import { api } from "@/lib/api";
import { useToast } from "@/hooks/useToast";
import useStore from "@/hooks/useStore";

const Exam = () => {
  const { currentQuiz, setCurrentStep } = useStore();
  const [answers, setAnswers] = useState(new Map<number, string>());
  const [completed, setCompleted] = useState(false);

  const { toast } = useToast();

  const gradeQuiz = api.quiz.gradeExam.useMutation({
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: "Your quiz has been graded. Check your results now.",
      });
      setCurrentStep("result");
      setAnswers(new Map<number, string>());
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
      });
    },
  });

  const submitQuiz = async () => {
    try {
      await gradeQuiz.mutateAsync({
        quizId: currentQuiz?.id ?? "",
        answers: Array.from(answers.values()),
      });
      setCompleted(true);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section>
      <div className="flex items-center justify-between">
        <Timer completed={completed} />
      </div>
      <Separator className="my-4" />
      <ScrollArea className="h-[800px]">
        <div className="flex-col space-y-4">
          {!!currentQuiz &&
            currentQuiz.questions?.map((q, index) => (
              <Question
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
            <span>Grading</span>
          </div>
        ) : (
          <span>Submit</span>
        )}
      </Button>
    </section>
  );
};

export default Exam;
