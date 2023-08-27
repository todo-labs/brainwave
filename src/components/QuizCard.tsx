import React from "react";
import { FileCodeIcon } from "lucide-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface QuizCardProps {
  title: string;
  onClick?: () => void;
  selected?: boolean;
  documents?: number;
}

const QuizCard: React.FC<QuizCardProps> = ({
  title,
  selected,
  documents,
  onClick,
}) => (
  <Card
    className={cn({
      "border-2 border-primary": selected,
    })}
    onClick={onClick}
  >
    <CardHeader>
      <CardTitle>{title}</CardTitle>
      {!!documents && (
        <CardDescription>
          {documents} {documents === 1 ? "document" : "documents"}
          <FileCodeIcon className="ml-1 inline-block" size={16} />
        </CardDescription>
      )}
    </CardHeader>
  </Card>
);

export default QuizCard;
