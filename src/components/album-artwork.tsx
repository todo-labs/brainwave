import Image from "next/image";
import type { Quiz } from "@prisma/client";

import { cn } from "@/lib/utils";

interface AlbumArtworkProps extends React.HTMLAttributes<HTMLDivElement> {
  aspectRatio?: "portrait" | "square";
  width?: number;
  height?: number;
  quiz?: Quiz;
}

export function AlbumArtwork({
  quiz,
  aspectRatio = "portrait",
  width,
  height,
  className,
  ...props
}: AlbumArtworkProps) {
  return (
    <div className={cn("space-y-3", className)} {...props}>
      <div className="overflow-hidden rounded-md">
        <Image
          src={ "/images/album-placeholder.png"}
          alt={quiz?.title}
          width={width}
          height={height}
          className={cn(
            "h-auto w-auto object-cover transition-all hover:scale-105",
            aspectRatio === "portrait" ? "aspect-[3/4]" : "aspect-square"
          )}
        />
      </div>
      <div className="space-y-1 text-sm">
        <h3 className="font-medium leading-none">{quiz?.title}</h3>
        <p className="text-xs text-muted-foreground">{quiz?.topic}</p>
      </div>
    </div>
  );
}
