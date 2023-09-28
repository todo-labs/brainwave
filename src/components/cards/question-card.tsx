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
}

const QuestionCard = ({ question, onSubmit, width }: IQuestionCardProps) => {
  return (
    <div className={cn("flex flex-col space-y-4", width)}>
      <Heading level="h3" className="font-bold capitalize">
        {question.label}
      </Heading>
      {question.type === QuestionType.MCQ && (
        <div className="pb-4">
          <RadioGroup onValueChange={onSubmit}>
            {question.options?.map((option, index) => (
              <div className="flex items-center space-x-2" key={index}>
                <RadioGroupItem value={option} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`}>{option}</Label>
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
        />
      )}
    </div>
  );
};

export default QuestionCard;
