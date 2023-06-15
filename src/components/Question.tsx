import React, { useState } from "react";
import { Heading } from "./ui/typography";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import type { AIQuiz } from "types";
import { Checkbox } from "./ui/checkbox";

export interface IQuestionCardProps {
  question: AIQuiz;
  onSubmit: (answer: string) => void;
  width?: string;
}

const QuestionCard = ({ question, onSubmit, width }: IQuestionCardProps) => {
  const [answer, setAnswer] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(answer);
  };

  return (
    <div className={cn("flex flex-col space-y-4", width)}>
      <Heading level="h1" className="font-bold capitalize">
        {question.question}
      </Heading>
      {question.type === "MCQ" && (
        <form onSubmit={handleSubmit}>
          {question.options?.map((option, index) => (
            <div key={index} className="pb-4">
              <div className="items-top flex space-x-2">
                <Checkbox
                  id="terms1"
                  onCheckedChange={(e) => {
                    console.log(e);
                  }}
                />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="terms1"
                    className="text-sm font-medium text-gray-500 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {option}
                  </label>
                </div>
              </div>
            </div>
          ))}
        </form>
      )}
      {question.type === "SA" && (
        <form onSubmit={handleSubmit}>
          <Input value={answer} onChange={(e) => setAnswer(e.target.value)} />
        </form>
      )}
      {question.type === "TF" && (
        <form onSubmit={handleSubmit}>
          <Button variant="ghost" onClick={() => setAnswer("True")}>
            True
          </Button>
          <Button variant="ghost" onClick={() => setAnswer("False")}>
            False
          </Button>
        </form>
      )}
    </div>
  );
};

export default QuestionCard;
