import React from "react";
import { QuestionType, type Questions } from "@prisma/client";

import { Heading } from "@/components/ui/typography";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { cn } from "@/lib/utils";

export interface IQuestionCardProps {
  question: Questions;
  onSubmit: (answer: string) => void;
  width?: string;
  disabled?: boolean;
}

const QuestionCard = ({
  question,
  onSubmit,
  width,
  disabled,
}: IQuestionCardProps) => {
  return (
    <div className={cn("flex flex-col space-y-4", width)}>
      <label className="text-xl font-bold capitalize xl:text-2xl">
        {question.label}
      </label>
      {question.type === QuestionType.MCQ && (
        <div className="pb-4">
          <RadioGroup onValueChange={onSubmit} disabled={disabled}>
            {question.options?.map((option, index) => (
              <div className="flex items-center space-x-2" key={index}>
                <RadioGroupItem value={option} id={option} />
                <Label htmlFor={option}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      )}
      {question.type === QuestionType.SA && (
        <Textarea
          onChange={(e) => onSubmit(e.target.value)}
          className="pb-4"
          placeholder="Enter your answer"
          disabled={disabled}
        />
      )}
    </div>
  );
};

export default QuestionCard;
