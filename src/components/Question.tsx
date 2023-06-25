import React from "react";
import type { QuestionType } from "@prisma/client";

import { Heading } from "./ui/typography";
import { Input } from "./ui/input";
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
  return (
    <div className={cn("flex flex-col space-y-4", width)}>
      <Heading level="h3" className="font-bold capitalize">
        {question.question}
      </Heading>
      {question.type === "MCQ" && (
        <div>
          {question.options?.map((option, index) => (
            <div key={index} className="pb-4">
              <label className="flex items-center space-x-2">
                <Checkbox
                  id={`option-${index}`}
                  onCheckedChange={(e) => {
                    onSubmit(option);
                  }}
                />
                <span className="text-sm font-medium leading-none text-gray-500">
                  {option}
                </span>
              </label>
            </div>
          ))}
        </div>
      )}
      {question.type === "SA" && (
        <Input
          onChange={(e) => onSubmit(e.target.value)}
          placeholder="Enter your answer"
        />
      )}
    </div>
  );
};

export default QuestionCard;
