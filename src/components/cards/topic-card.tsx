import React from "react";
import { FileCodeIcon } from "lucide-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface TopicCardProps {
  title: string;
  onClick?: () => void;
  selected?: boolean;
  documents?: number;
  children?: React.ReactNode;
  actionComponent?: React.ReactNode;
}

const TopicCard: React.FC<TopicCardProps> = ({
  title,
  selected,
  documents,
  onClick,
  children,
  actionComponent,
}) => (
  <Card
    className={cn(
      {
        "border-2 border-primary": selected,
      },
      "cursor-pointer"
    )}
    onClick={onClick}
  >
    <CardHeader>
      <CardTitle className="flex w-full flex-col">
        {!!actionComponent && (
          <span className="flex flex-row-reverse pb-2">{actionComponent}</span>
        )}
        {title}
      </CardTitle>
      {!!documents && (
        <CardDescription>
          {documents} {documents === 1 ? "document" : "documents"}
          <FileCodeIcon className="ml-1 inline-block" size={16} />
        </CardDescription>
      )}
    </CardHeader>
    {children}
  </Card>
);

export default TopicCard;
