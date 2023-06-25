import React, { useState } from "react";
import type { QuestionType } from "@prisma/client";

import { Heading } from "./ui/typography";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";

import { cn } from "@/lib/utils";

export interface IQuestionCardProps {
  question: {
    question: string;
    type: QuestionType;
    options?: string[] | undefined;
  };
  onSubmit: (answer: string) => void;
  width?: string;
}

const QuestionCard = ({ question, onSubmit, width }: IQuestionCardProps) => {
  const [answer, setAnswer] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(answer);
    setAnswer(""); // Clear the answer after submission
  };

  return (
    <div className={cn("flex flex-col space-y-4", width)}>
      <Heading level="h3" className="font-bold capitalize">
        {question.question}
      </Heading>
      {question.type === "MCQ" && (
        <form onSubmit={handleSubmit}>
          {question.options?.map((option, index) => (
            <div key={index} className="pb-4">
              <label className="flex items-center space-x-2">
                <Checkbox
                  id={`option-${index}`}
                  onCheckedChange={(e) => {
                    console.log(e);
                  }}
                />
                <span className="text-sm font-medium leading-none text-gray-500">
                  {option}
                </span>
              </label>
            </div>
          ))}
        </form>
      )}
      {question.type === "SA" && (
        <form onSubmit={handleSubmit}>
          <Input
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Enter your answer"
          />
        </form>
      )}
    </div>
  );
};

export default QuestionCard;
