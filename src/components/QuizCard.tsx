import Image from "next/image";
import type { Quiz } from "@prisma/client";

import { cn } from "@/lib/utils";

interface QuizCardProps extends React.HTMLAttributes<HTMLDivElement> {
  aspectRatio?: "portrait" | "square";
  width?: number;
  height?: number;
  quiz?: Quiz;
  selected?: boolean;
}

export function QuizCard({
  quiz,
  aspectRatio = "portrait",
  width,
  height,
  className,
  selected,
  ...props
}: QuizCardProps) {
  return (
    <div
      className={cn("space-y-3 rounded-md", className, {
        "border-4 border-primary": selected,
      })}
      {...props}
    >
      <div className="overflow-hidden rounded-md">
      <svg width={width} height={height}>
      <linearGradient id="myGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ff0000" />
        <stop offset="100%" stopColor="#0000ff" />
      </linearGradient>
      <rect x="10" y="10" width={width} height={height} fill="url(#myGradient)" />
    </svg>
      </div>
      <div className="space-y-1 text-sm">
        <h3 className="font-medium leading-none">{quiz?.title}</h3>
        <p className="text-xs text-muted-foreground">{quiz?.topic}</p>
      </div>
    </div>
  );
}
