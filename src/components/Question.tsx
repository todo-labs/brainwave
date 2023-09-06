import React from "react";
import { QuestionType, type Questions } from "@prisma/client";

import { Heading } from "@/components/ui/typography";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

import { cn } from "@/lib/utils";

export interface IQuestionCardProps {
  question: Questions;
  onSubmit: (answer: string) => void;
  width?: string;
}

const QuestionCard = ({ question, onSubmit, width }: IQuestionCardProps) => {
  return (
    <div className={cn("flex flex-col space-y-4", width)}>
      <Heading level="h3" className="font-bold capitalize">
        {question.label}
      </Heading>
      {question.type === QuestionType.MCQ && (
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
      {question.type === QuestionType.SA && (
        <Textarea
          onChange={(e) => onSubmit(e.target.value)}
          className="pb-4"
          placeholder="Enter your answer"
        />
      )}
    </div>
  );
};

export default QuestionCard;
